import math
from datetime import datetime, timedelta, timezone
from decimal import Decimal
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, Response, UploadFile, File, Form
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.api.deps import get_current_user
from app.models.models import User, Account, Transaction, UserRole, TransactionType, TransactionCategory
from app.schemas.schemas import (
    GenerateStatementsRequest,
    StatementSummaryResponse,
    StatementGenerationResponse,
)
from app.services.statement_generator import (
    populate_account_random_statements,
    populate_all_accounts_random_statements,
    generate_statement_pdf,
    generate_statement_csv,
)
from app.services.statement_parser import parse_and_import_statement

router = APIRouter()


def parse_period_dates(
    period: Optional[str] = "3m",
    from_date: Optional[datetime] = None,
    to_date: Optional[datetime] = None,
) -> tuple[datetime, datetime]:
    now = datetime.now(timezone.utc)
    if to_date is None:
        to_date = now

    if from_date is None:
        if period == "1m":
            from_date = now - timedelta(days=30)
        elif period == "3m":
            from_date = now - timedelta(days=90)
        elif period == "6m":
            from_date = now - timedelta(days=180)
        elif period == "1y":
            from_date = now - timedelta(days=365)
        else:
            from_date = now - timedelta(days=90)

    return from_date, to_date


@router.post("/generate-random", response_model=StatementGenerationResponse)
def generate_random_statements_endpoint(
    req: GenerateStatementsRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Generate realistic random statement transactions for an account.
    """
    if not req.account_id:
        acc = db.query(Account).filter(Account.user_id == current_user.id).first()
        if not acc:
            raise HTTPException(status_code=404, detail="No accounts found for user.")
        account_id = acc.id
    else:
        account_id = req.account_id
        acc = db.query(Account).filter(Account.id == account_id).first()
        if not acc:
            raise HTTPException(status_code=404, detail="Account not found.")
        if acc.user_id != current_user.id and current_user.role != UserRole.ADMIN:
            raise HTTPException(status_code=403, detail="Access denied to this account.")

    count = max(5, min(req.count, 200))
    days = max(7, min(req.days, 730))

    txns, updated_account = populate_account_random_statements(
        db=db,
        account_id=account_id,
        count=count,
        days_back=days,
        clear_existing=req.clear_existing,
        starting_balance=req.starting_balance,
    )

    return StatementGenerationResponse(
        message=f"Successfully generated {len(txns)} random statement transactions.",
        success=True,
        account_number=updated_account.account_number,
        transactions_generated=len(txns),
        new_balance=updated_account.balance,
    )


@router.post("/upload")
async def upload_statement_file(
    file: UploadFile = File(...),
    account_id: str = Form(...),
    clear_existing: bool = Form(False),
    start_balance: Optional[float] = Form(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Upload real bank statement file (CSV, Excel .xlsx, .xls) to import transactions
    with automated header discovery and mathematical balance tallying.
    """
    account = db.query(Account).filter(Account.id == account_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found.")

    if account.user_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Access denied.")

    filename = file.filename or "statement.csv"
    if not filename.lower().endswith((".csv", ".xlsx", ".xls")):
        raise HTTPException(
            status_code=400,
            detail="Unsupported file format. Please upload a CSV or Excel (.xlsx / .xls) file.",
        )

    content = await file.read()
    if len(content) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    override_balance = Decimal(str(start_balance)) if start_balance is not None else None

    try:
        result = parse_and_import_statement(
            db=db,
            account_id=account_id,
            file_content=content,
            filename=filename,
            clear_existing=clear_existing,
            override_start_balance=override_balance,
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse statement: {str(e)}")


@router.post("/adjust-balance")
def admin_adjust_balance(
    account_id: str = Query(...),
    amount: float = Query(...),
    action: str = Query(..., regex="^(credit|debit)$"),
    description: str = Query(default="Manual Adjustment"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Admin control to manually credit/debit funds or post bulk adjustments with ledger integrity.
    """
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Admin privileges required.")

    account = db.query(Account).filter(Account.id == account_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found.")

    amt_dec = Decimal(str(abs(amount)))
    txn_type = TransactionType.CREDIT if action == "credit" else TransactionType.DEBIT

    if txn_type == TransactionType.DEBIT and account.balance < amt_dec:
        raise HTTPException(status_code=400, detail="Insufficient account balance for debit adjustment.")

    new_balance = account.balance + amt_dec if txn_type == TransactionType.CREDIT else account.balance - amt_dec

    txn = Transaction(
        id=str(uuid.uuid4()),
        account_id=account.id,
        transaction_ref=f"SBIADJ{uuid.uuid4().hex[:12].upper()}",
        type=txn_type,
        category=TransactionCategory.OTHER,
        amount=amt_dec,
        balance_after=new_balance,
        description=description,
        narration=f"{description} (Admin Adjustment by {current_user.username})",
        counterparty_name="STATE BANK OF INDIA",
        channel="BRANCH_ADJUSTMENT",
        value_date=datetime.now(timezone.utc),
        created_at=datetime.now(timezone.utc),
    )
    db.add(txn)

    account.balance = new_balance
    account.available_balance = new_balance
    db.commit()
    db.refresh(account)

    return {
        "success": True,
        "message": f"Successfully {action}ed INR {amt_dec:,.2f} to account {account.account_number}",
        "new_balance": float(new_balance),
        "transaction_ref": txn.transaction_ref,
    }


@router.post("/generate-random-all")
def generate_random_all_endpoint(
    count: int = Query(default=35, ge=5, le=100),
    days: int = Query(default=90, ge=7, le=365),
    clear_existing: bool = False,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Admin endpoint to generate statements across all accounts."""
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Admin privileges required.")

    result = populate_all_accounts_random_statements(
        db=db,
        count_per_account=count,
        days_back=days,
        clear_existing=clear_existing,
    )
    return result


@router.get("/download")
def download_statement(
    account_id: str,
    format: str = Query(default="pdf", regex="^(pdf|csv|excel)$"),
    period: Optional[str] = Query(default="3m"),
    from_date: Optional[datetime] = None,
    to_date: Optional[datetime] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Download official Account Statement in PDF or CSV format.
    """
    account = db.query(Account).filter(Account.id == account_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found.")

    if account.user_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Access denied.")

    parsed_from, parsed_to = parse_period_dates(period, from_date, to_date)

    txns = (
        db.query(Transaction)
        .filter(
            Transaction.account_id == account_id,
            Transaction.value_date >= parsed_from,
            Transaction.value_date <= parsed_to,
        )
        .order_by(Transaction.value_date.asc())
        .all()
    )

    filename_date = datetime.now(timezone.utc).strftime("%Y%m%d")
    clean_acc_num = account.account_number

    if format.lower() == "pdf":
        pdf_bytes = generate_statement_pdf(
            account=account,
            user=account.user or current_user,
            transactions=txns,
            from_date=parsed_from,
            to_date=parsed_to,
        )
        filename = f"SBI_Statement_{clean_acc_num}_{filename_date}.pdf"
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename=\"{filename}\"",
                "Access-Control-Expose-Headers": "Content-Disposition",
            },
        )
    else:
        csv_text = generate_statement_csv(
            account=account,
            user=account.user or current_user,
            transactions=txns,
            from_date=parsed_from,
            to_date=parsed_to,
        )
        filename = f"SBI_Statement_{clean_acc_num}_{filename_date}.csv"
        return Response(
            content=csv_text,
            media_type="text/csv",
            headers={
                "Content-Disposition": f"attachment; filename=\"{filename}\"",
                "Access-Control-Expose-Headers": "Content-Disposition",
            },
        )


@router.get("/summary", response_model=StatementSummaryResponse)
def get_statement_summary(
    account_id: str,
    period: Optional[str] = Query(default="3m"),
    from_date: Optional[datetime] = None,
    to_date: Optional[datetime] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get aggregated statement summary metrics (Opening, Closing, Credits, Debits, Net flow).
    """
    account = db.query(Account).filter(Account.id == account_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found.")

    if account.user_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Access denied.")

    parsed_from, parsed_to = parse_period_dates(period, from_date, to_date)

    txns = (
        db.query(Transaction)
        .filter(
            Transaction.account_id == account_id,
            Transaction.value_date >= parsed_from,
            Transaction.value_date <= parsed_to,
        )
        .order_by(Transaction.value_date.asc())
        .all()
    )

    total_credits = Decimal("0.00")
    total_debits = Decimal("0.00")
    credit_count = 0
    debit_count = 0

    for t in txns:
        if t.type.value == "credit":
            total_credits += Decimal(str(t.amount))
            credit_count += 1
        else:
            total_debits += Decimal(str(t.amount))
            debit_count += 1

    if txns:
        first_t = txns[0]
        if first_t.type.value == "credit":
            opening_balance = Decimal(str(first_t.balance_after)) - Decimal(str(first_t.amount))
        else:
            opening_balance = Decimal(str(first_t.balance_after)) + Decimal(str(first_t.amount))
        closing_balance = txns[-1].balance_after
    else:
        opening_balance = account.balance
        closing_balance = account.balance

    return StatementSummaryResponse(
        account_id=account.id,
        account_number=account.account_number,
        from_date=parsed_from,
        to_date=parsed_to,
        opening_balance=opening_balance,
        closing_balance=closing_balance,
        total_credits=total_credits,
        total_debits=total_debits,
        credit_count=credit_count,
        debit_count=debit_count,
        net_flow=total_credits - total_debits,
        total_transactions=len(txns),
    )
