"""
Statement Generator Service:
Generates realistic Indian banking transaction statements (UPI, NEFT, IMPS, RTGS,
Salary, ATM, POS, Bills, Mutual Funds, Interest) with mathematical balance integrity,
and generates authentic SBI-branded PDF/CSV statements.
"""

import io
import csv
import uuid
import random
from decimal import Decimal
from datetime import datetime, timedelta, timezone
from typing import List, Dict, Any, Optional, Tuple

from sqlalchemy.orm import Session
from sqlalchemy import desc, asc

from app.models.models import (
    Account, Transaction, User,
    TransactionType, TransactionCategory, AccountType
)

# ── Authentic Indian Transaction Templates ────────────────────────────

SALARY_TEMPLATES = [
    {"desc": "SALARY CREDIT - TATA CONSULTANCY SERVICES", "counterparty": "TCS LTD", "min": 65000, "max": 120000, "cat": TransactionCategory.SALARY},
    {"desc": "SALARY FOR THE MONTH - INFOSYS LTD", "counterparty": "INFOSYS TECHNOLOGIES", "min": 70000, "max": 135000, "cat": TransactionCategory.SALARY},
    {"desc": "DIRECT DEP SALARY - WIPRO ENTERPRISES", "counterparty": "WIPRO LTD", "min": 60000, "max": 110000, "cat": TransactionCategory.SALARY},
    {"desc": "ACH CR - ACCENTURE SOLUTIONS PVT LTD", "counterparty": "ACCENTURE", "min": 80000, "max": 150000, "cat": TransactionCategory.SALARY},
    {"desc": "SALARY CREDIT - HCL TECHNOLOGIES", "counterparty": "HCL TECH", "min": 55000, "max": 95000, "cat": TransactionCategory.SALARY},
]

UPI_DEBIT_TEMPLATES = [
    {"desc": "UPI/SWIGGY/{ref}/Food Order", "counterparty": "Swiggy Bundl Technologies", "min": 180, "max": 1250, "cat": TransactionCategory.UPI},
    {"desc": "UPI/ZOMATO/{ref}/Dinner", "counterparty": "Zomato Limited", "min": 220, "max": 1480, "cat": TransactionCategory.UPI},
    {"desc": "UPI/BLINKIT/{ref}/Grocery", "counterparty": "Blinkit Commerce", "min": 350, "max": 2400, "cat": TransactionCategory.UPI},
    {"desc": "UPI/ZEPTO/{ref}/Quick Mart", "counterparty": "Zepto Marketplace", "min": 190, "max": 1850, "cat": TransactionCategory.UPI},
    {"desc": "UPI/AMAZONPAY/{ref}/Shopping", "counterparty": "Amazon Seller Services", "min": 499, "max": 4999, "cat": TransactionCategory.UPI},
    {"desc": "UPI/FLIPKART/{ref}/Order", "counterparty": "Flipkart Internet Pvt Ltd", "min": 699, "max": 3890, "cat": TransactionCategory.UPI},
    {"desc": "UPI/UBER/{ref}/Cab Ride", "counterparty": "Uber India Systems", "min": 140, "max": 850, "cat": TransactionCategory.UPI},
    {"desc": "UPI/OLA/{ref}/Auto Ride", "counterparty": "ANI Technologies Ola", "min": 90, "max": 420, "cat": TransactionCategory.UPI},
    {"desc": "UPI/PHONEPE/{ref}/Chai & Snacks", "counterparty": "Chai Point Corner", "min": 40, "max": 180, "cat": TransactionCategory.UPI},
    {"desc": "UPI/GPAY/{ref}/Daily Dairy Milk", "counterparty": "Nandini Milk Parlour", "min": 60, "max": 350, "cat": TransactionCategory.UPI},
    {"desc": "UPI/PAYTM/{ref}/Metro Card Recharge", "counterparty": "BMRCL Metro Rail", "min": 200, "max": 1000, "cat": TransactionCategory.UPI},
    {"desc": "UPI/CRED/{ref}/Credit Card Bill Payment", "counterparty": "Dreamplug Cred", "min": 5000, "max": 35000, "cat": TransactionCategory.UPI},
    {"desc": "UPI/PHARMACY/{ref}/Apollo Pharmacy", "counterparty": "Apollo Hospitals Ent", "min": 250, "max": 1850, "cat": TransactionCategory.UPI},
    {"desc": "UPI/BOOKMYSHOW/{ref}/Movie Tickets", "counterparty": "Bigtree Entertainment", "min": 360, "max": 1200, "cat": TransactionCategory.UPI},
    {"desc": "UPI/STARBUCKS/{ref}/Coffee & Bakery", "counterparty": "Tata Starbucks Pvt Ltd", "min": 320, "max": 950, "cat": TransactionCategory.UPI},
    {"desc": "UPI/MAKEMYTRIP/{ref}/Flight Booking", "counterparty": "MakeMyTrip India", "min": 3500, "max": 14000, "cat": TransactionCategory.UPI},
]

UPI_CREDIT_TEMPLATES = [
    {"desc": "UPI/GPAY/{ref}/Splitwise Dinner", "counterparty": "Rohan Verma", "min": 300, "max": 1500, "cat": TransactionCategory.UPI},
    {"desc": "UPI/PHONEPE/{ref}/Trip Share", "counterparty": "Ananya Desai", "min": 1200, "max": 6500, "cat": TransactionCategory.UPI},
    {"desc": "UPI/PAYTM/{ref}/Rent Share", "counterparty": "Vikram Malhotra", "min": 5000, "max": 18000, "cat": TransactionCategory.UPI},
    {"desc": "UPI/REFUND/{ref}/Amazon Refund", "counterparty": "Amazon Seller Services", "min": 499, "max": 3499, "cat": TransactionCategory.OTHER},
    {"desc": "UPI/CASHBACK/{ref}/Cred Reward", "counterparty": "Dreamplug Cred", "min": 15, "max": 250, "cat": TransactionCategory.OTHER},
]

CARD_POS_TEMPLATES = [
    {"desc": "POS 4111XXXX4321 DMART SUPERMARKET", "counterparty": "Avenue Supermarts D-Mart", "min": 1500, "max": 7500, "cat": TransactionCategory.POS},
    {"desc": "POS 5241XXXX8910 RELIANCE DIGITAL", "counterparty": "Reliance Retail Ltd", "min": 2500, "max": 28000, "cat": TransactionCategory.POS},
    {"desc": "POS 4532XXXX1029 HPCL PETROL PUMP", "counterparty": "Hindustan Petroleum", "min": 1500, "max": 4500, "cat": TransactionCategory.POS},
    {"desc": "POS 4211XXXX7722 SHELL FUEL STATION", "counterparty": "Shell India Markets", "min": 2000, "max": 5000, "cat": TransactionCategory.POS},
    {"desc": "POS 4111XXXX3344 SHOPPERS STOP", "counterparty": "Shoppers Stop Retail", "min": 1800, "max": 8900, "cat": TransactionCategory.POS},
    {"desc": "POS 5422XXXX9911 DECATHLON SPORTS", "counterparty": "Decathlon Sports India", "min": 999, "max": 6500, "cat": TransactionCategory.POS},
    {"desc": "POS 4111XXXX0021 IKEA HOME FURNISHING", "counterparty": "IKEA India", "min": 2200, "max": 15000, "cat": TransactionCategory.POS},
]

NEFT_IMPS_DEBIT_TEMPLATES = [
    {"desc": "NEFT DR-HDFC0001234-HOUSE RENT", "counterparty": "Suresh Landlord", "ifsc": "HDFC0001234", "min": 18000, "max": 35000, "cat": TransactionCategory.NEFT},
    {"desc": "IMPS DR/{ref}/HOME MAINTENANCE", "counterparty": "Palm Meadows Society", "ifsc": "ICIC0000982", "min": 3500, "max": 6500, "cat": TransactionCategory.IMPS},
    {"desc": "NEFT DR-SBIN0004521-FAMILY SUPPORT", "counterparty": "Kavita Sharma", "ifsc": "SBIN0004521", "min": 10000, "max": 25000, "cat": TransactionCategory.NEFT},
    {"desc": "RTGS DR-UTIB0000123-CAR DOWNPAYMENT", "counterparty": "Pratham Motors Pvt Ltd", "ifsc": "UTIB0000123", "min": 75000, "max": 250000, "cat": TransactionCategory.RTGS},
]

NEFT_IMPS_CREDIT_TEMPLATES = [
    {"desc": "NEFT CR-HDFC0000456-FREELANCE CONSULTING", "counterparty": "Apex Digital Labs", "ifsc": "HDFC0000456", "min": 25000, "max": 85000, "cat": TransactionCategory.NEFT},
    {"desc": "IMPS CR/{ref}/DIVIDEND CREDIT", "counterparty": "TCS DIVIDEND ACCOUNT", "ifsc": "CITI0000001", "min": 1200, "max": 8500, "cat": TransactionCategory.INTEREST},
    {"desc": "NEFT CR-SBIN0001289-RENT RECEIVED", "counterparty": "Tenant Ramesh", "ifsc": "SBIN0001289", "min": 15000, "max": 28000, "cat": TransactionCategory.NEFT},
]

BILL_PAYMENTS = [
    {"desc": "BIL/BESCOM ELECTRICITY BILL/PAYMENT", "counterparty": "BESCOM Bangalore", "min": 1200, "max": 4500, "cat": TransactionCategory.OTHER},
    {"desc": "BIL/AIRTEL BROADBAND FIBER BILL", "counterparty": "Bharti Airtel Ltd", "min": 999, "max": 1899, "cat": TransactionCategory.OTHER},
    {"desc": "BIL/JIO FIBER POSTPAID BILL", "counterparty": "Reliance Jio Infocomm", "min": 699, "max": 1499, "cat": TransactionCategory.OTHER},
    {"desc": "BIL/GAIL GAS UTILITY PIPED GAS", "counterparty": "GAIL Gas Limited", "min": 450, "max": 1100, "cat": TransactionCategory.OTHER},
    {"desc": "BIL/TATA PLAY DTH SUBSCRIPTION", "counterparty": "Tata Play Ltd", "min": 350, "max": 800, "cat": TransactionCategory.OTHER},
]

INVESTMENTS_AND_EMIS = [
    {"desc": "ACH DR - ZERODHA BROKING LTD / SIP", "counterparty": "Zerodha Broking Ltd", "min": 5000, "max": 25000, "cat": TransactionCategory.OTHER},
    {"desc": "ACH DR - GROWW MUTUAL FUND SIP", "counterparty": "Groww Nextbillion Tech", "min": 3000, "max": 15000, "cat": TransactionCategory.OTHER},
    {"desc": "ACH DR - SBI MUTUAL FUND BLUECHIP", "counterparty": "SBI Funds Management", "min": 2500, "max": 10000, "cat": TransactionCategory.OTHER},
    {"desc": "LOAN EMI - SBI HOME LOAN A/C 3928172635", "counterparty": "SBI RACPC Bengaluru", "min": 24500, "max": 48000, "cat": TransactionCategory.OTHER},
    {"desc": "LOAN EMI - SBI CAR LOAN A/C 9912837461", "counterparty": "SBI Auto Loan Hub", "min": 8500, "max": 16500, "cat": TransactionCategory.OTHER},
]

ATM_WITHDRAWALS = [
    {"desc": "ATM WDL / SBI ATM MG ROAD BENGALURU", "counterparty": "SBI ATM MG Road", "min": 2000, "max": 10000, "cat": TransactionCategory.ATM},
    {"desc": "ATM WDL / SBI ATM INDIRANAGAR 100FT", "counterparty": "SBI ATM Indiranagar", "min": 3000, "max": 10000, "cat": TransactionCategory.ATM},
    {"desc": "ATM WDL / HDFC BANK ATM KORAMANGALA", "counterparty": "HDFC NFS ATM", "min": 1000, "max": 8000, "cat": TransactionCategory.ATM},
]

BANK_FEES_AND_INTEREST = [
    {"desc": "SB INTEREST CREDIT FOR QTR", "counterparty": "STATE BANK OF INDIA", "min": 350, "max": 2800, "cat": TransactionCategory.INTEREST, "type": TransactionType.CREDIT},
    {"desc": "QUARTERLY SMS ALERT CHARGES + GST", "counterparty": "STATE BANK OF INDIA", "min": 17, "max": 21, "cat": TransactionCategory.CHARGES, "type": TransactionType.DEBIT},
    {"desc": "ANNUAL DEBIT CARD AMC + 18% GST", "counterparty": "STATE BANK OF INDIA", "min": 147, "max": 295, "cat": TransactionCategory.CHARGES, "type": TransactionType.DEBIT},
]


# ── Generator Core Engine ──────────────────────────────────────────────

def generate_ref_code(prefix: str = "SBI") -> str:
    """Generate authentic transaction reference number."""
    digits = "".join([str(random.randint(0, 9)) for _ in range(12)])
    return f"{prefix}{digits}"


def generate_upi_ref() -> str:
    """Generate authentic 12-digit UPI RRN."""
    return "".join([str(random.randint(0, 9)) for _ in range(12)])


def create_random_transaction_records(
    account: Account,
    count: int = 35,
    days_back: int = 90,
    starting_balance: Optional[Decimal] = None,
) -> List[Dict[str, Any]]:
    """
    Creates a mathematically consistent, realistic sequence of transaction records
    spanning `days_back` days up to the current moment.
    """
    now = datetime.now(timezone.utc)
    start_date = now - timedelta(days=days_back)

    # Initial anchor balance
    if starting_balance is None:
        if account.account_type == AccountType.CURRENT:
            current_bal = Decimal(str(random.randint(50000, 250000)))
        elif account.account_type == AccountType.FIXED_DEPOSIT:
            current_bal = Decimal(str(random.randint(100000, 1000000)))
        else:
            current_bal = Decimal(str(random.randint(30000, 150000)))
    else:
        current_bal = starting_balance

    # Build chronological dates
    # Distribute timestamps realistically: business hours (9-22), higher weight in recent weeks
    dates = []
    for _ in range(count):
        # Weighted random distribution towards recent days
        day_offset = int(random.triangular(0, days_back, days_back * 0.7))
        hour = random.choice([8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22])
        minute = random.randint(0, 59)
        second = random.randint(0, 59)
        txn_time = start_date + timedelta(days=day_offset, hours=hour, minutes=minute, seconds=second)
        if txn_time > now:
            txn_time = now - timedelta(minutes=random.randint(5, 60))
        dates.append(txn_time)

    dates.sort()

    records = []
    running_balance = current_bal

    # Ensure monthly salary occurs near start of month dates in range
    months_seen = set()

    for idx, txn_date in enumerate(dates):
        month_key = (txn_date.year, txn_date.month)
        
        # Determine candidate transaction type and template
        # 1. Monthly salary around 1st-5th or 28th-31st of month if not yet credited
        if (txn_date.day in [1, 2, 3, 28, 29, 30, 31] or idx == 0) and month_key not in months_seen:
            months_seen.add(month_key)
            tpl = random.choice(SALARY_TEMPLATES)
            txn_type = TransactionType.CREDIT
            category = tpl["cat"]
            amount = Decimal(str(random.randint(tpl["min"], tpl["max"])))
            desc_text = tpl["desc"]
            counterparty = tpl["counterparty"]
            channel = "ACH/SALARY"
            ifsc = "SBIN0000001"
            ref = generate_ref_code("SBISAL")
        
        # 2. Bank interest credit or charges
        elif random.random() < 0.08:
            tpl = random.choice(BANK_FEES_AND_INTEREST)
            txn_type = tpl.get("type", TransactionType.CREDIT if "INTEREST" in tpl["desc"] else TransactionType.DEBIT)
            category = tpl["cat"]
            amount = Decimal(str(random.randint(tpl["min"], tpl["max"])))
            desc_text = tpl["desc"]
            counterparty = tpl["counterparty"]
            channel = "SYSTEM"
            ifsc = "SBIN0000001"
            ref = generate_ref_code("SBIINT" if txn_type == TransactionType.CREDIT else "SBICHG")
        
        # 3. Monthly recurring bills / Investments / EMIs
        elif random.random() < 0.18:
            if random.random() < 0.5:
                tpl = random.choice(INVESTMENTS_AND_EMIS)
            else:
                tpl = random.choice(BILL_PAYMENTS)
            txn_type = TransactionType.DEBIT
            category = tpl["cat"]
            amount = Decimal(str(random.randint(tpl["min"], tpl["max"])))
            desc_text = tpl["desc"]
            counterparty = tpl["counterparty"]
            channel = "NET_BANKING"
            ifsc = "SBIN0000001"
            ref = generate_ref_code("SBIBIL")
        
        # 4. NEFT / IMPS transfers (debit or credit)
        elif random.random() < 0.22:
            is_credit = random.random() < 0.35
            if is_credit:
                tpl = random.choice(NEFT_IMPS_CREDIT_TEMPLATES)
                txn_type = TransactionType.CREDIT
            else:
                tpl = random.choice(NEFT_IMPS_DEBIT_TEMPLATES)
                txn_type = TransactionType.DEBIT
            category = tpl["cat"]
            amount = Decimal(str(random.randint(tpl["min"], tpl["max"])))
            ref_num = generate_ref_code("TRF")
            desc_text = tpl["desc"].format(ref=ref_num)
            counterparty = tpl["counterparty"]
            channel = "NET_BANKING"
            ifsc = tpl.get("ifsc", "SBIN0000001")
            ref = ref_num
        
        # 5. ATM Cash withdrawal
        elif random.random() < 0.12:
            tpl = random.choice(ATM_WITHDRAWALS)
            txn_type = TransactionType.DEBIT
            category = tpl["cat"]
            amount = Decimal(str(random.choice([1000, 2000, 3000, 4000, 5000, 8000, 10000])))
            desc_text = tpl["desc"]
            counterparty = tpl["counterparty"]
            channel = "ATM"
            ifsc = "SBIN0000001"
            ref = generate_ref_code("SBIATM")
        
        # 6. Card / POS
        elif random.random() < 0.15:
            tpl = random.choice(CARD_POS_TEMPLATES)
            txn_type = TransactionType.DEBIT
            category = tpl["cat"]
            amount = Decimal(str(random.randint(tpl["min"], tpl["max"])))
            desc_text = tpl["desc"]
            counterparty = tpl["counterparty"]
            channel = "POS_CARD"
            ifsc = "SBIN0000001"
            ref = generate_ref_code("SBIPOS")
        
        # 7. UPI (Daily transactions - Micro payments)
        else:
            is_credit = random.random() < 0.15
            upi_rrn = generate_upi_ref()
            if is_credit:
                tpl = random.choice(UPI_CREDIT_TEMPLATES)
                txn_type = TransactionType.CREDIT
            else:
                tpl = random.choice(UPI_DEBIT_TEMPLATES)
                txn_type = TransactionType.DEBIT
            category = tpl["cat"]
            amount = Decimal(str(random.randint(tpl["min"], tpl["max"])))
            desc_text = tpl["desc"].format(ref=upi_rrn)
            counterparty = tpl["counterparty"]
            channel = "UPI"
            ifsc = "SBIN0000001"
            ref = f"UPI{upi_rrn}"

        # Ensure account balance stays healthy (avoid negative balance)
        if txn_type == TransactionType.DEBIT:
            if running_balance - amount < Decimal("1500.00"):
                # Switch to a credit or scale down amount
                if running_balance < Decimal("3000.00"):
                    txn_type = TransactionType.CREDIT
                    amount = Decimal(str(random.randint(10000, 35000)))
                    desc_text = "NEFT CR-HDFC0000999-FAMILY TRANSFER"
                    counterparty = "Family Member"
                    category = TransactionCategory.NEFT
                    channel = "NET_BANKING"
                else:
                    amount = Decimal(str(max(50, int(running_balance * Decimal("0.3")))))

        # Update running balance
        if txn_type == TransactionType.CREDIT:
            running_balance += amount
        else:
            running_balance -= amount

        records.append({
            "id": str(uuid.uuid4()),
            "account_id": account.id,
            "transaction_ref": ref,
            "type": txn_type,
            "category": category,
            "amount": amount,
            "balance_after": running_balance,
            "description": desc_text,
            "narration": f"{desc_text} / {counterparty}",
            "counterparty_name": counterparty,
            "counterparty_account": "".join([str(random.randint(0, 9)) for _ in range(11)]),
            "counterparty_ifsc": ifsc,
            "channel": channel,
            "value_date": txn_date,
            "created_at": txn_date,
        })

    return records


def populate_account_random_statements(
    db: Session,
    account_id: str,
    count: int = 40,
    days_back: int = 90,
    clear_existing: bool = False,
    starting_balance: Optional[Decimal] = None,
) -> Tuple[List[Transaction], Account]:
    """
    Populates an account with random statement transactions and updates
    the account balance in the database.
    """
    account = db.query(Account).filter(Account.id == account_id).first()
    if not account:
        raise ValueError(f"Account {account_id} not found")

    if clear_existing:
        db.query(Transaction).filter(Transaction.account_id == account_id).delete()
        db.flush()

    # Determine base starting balance if appending or clearing
    if not clear_existing and account.balance and account.balance > 0:
        base_bal = account.balance
    else:
        base_bal = starting_balance or Decimal("50000.00")

    records = create_random_transaction_records(
        account=account,
        count=count,
        days_back=days_back,
        starting_balance=base_bal,
    )

    created_txns = []
    for r in records:
        txn = Transaction(
            id=r["id"],
            account_id=r["account_id"],
            transaction_ref=r["transaction_ref"],
            type=r["type"],
            category=r["category"],
            amount=r["amount"],
            balance_after=r["balance_after"],
            description=r["description"],
            narration=r["narration"],
            counterparty_name=r["counterparty_name"],
            counterparty_account=r["counterparty_account"],
            counterparty_ifsc=r["counterparty_ifsc"],
            channel=r["channel"],
            value_date=r["value_date"],
            created_at=r["created_at"],
        )
        db.add(txn)
        created_txns.append(txn)

    # Sync latest balance onto account
    if records:
        final_balance = records[-1]["balance_after"]
        account.balance = final_balance
        account.available_balance = final_balance

    db.commit()
    db.refresh(account)

    return created_txns, account


def populate_all_accounts_random_statements(
    db: Session,
    count_per_account: int = 35,
    days_back: int = 90,
    clear_existing: bool = False,
) -> Dict[str, Any]:
    """Populates random statements for all active accounts in the database."""
    accounts = db.query(Account).all()
    total_txns = 0
    account_summaries = []

    for acc in accounts:
        txns, updated_acc = populate_account_random_statements(
            db=db,
            account_id=acc.id,
            count=count_per_account,
            days_back=days_back,
            clear_existing=clear_existing,
        )
        total_txns += len(txns)
        account_summaries.append({
            "account_number": updated_acc.account_number,
            "account_type": updated_acc.account_type.value,
            "transactions_added": len(txns),
            "current_balance": float(updated_acc.balance),
        })

    return {
        "accounts_updated": len(accounts),
        "total_transactions_created": total_txns,
        "accounts": account_summaries,
    }


# ── PDF Statement Generation (ReportLab) ──────────────────────────────

def generate_statement_pdf(
    account: Account,
    user: User,
    transactions: List[Transaction],
    from_date: datetime,
    to_date: datetime,
) -> bytes:
    """
    Generates a professional, print-ready SBI Account Statement PDF
    using ReportLab with standard banking typography and layout.
    """
    from reportlab.lib.pagesizes import A4
    from reportlab.lib import colors
    from reportlab.platypus import (
        SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether, HRFlowable
    )
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.units import mm, inch

    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        leftMargin=15 * mm,
        rightMargin=15 * mm,
        topMargin=15 * mm,
        bottomMargin=15 * mm,
    )

    styles = getSampleStyleSheet()
    
    # Custom Brand Colors
    sbi_blue = colors.HexColor("#1A365D")
    sbi_light_blue = colors.HexColor("#EBF8FF")
    sbi_accent = colors.HexColor("#2B6CB0")
    credit_green = colors.HexColor("#22543D")
    debit_red = colors.HexColor("#742A2A")
    gray_border = colors.HexColor("#CBD5E0")
    light_gray = colors.HexColor("#F7FAFC")
    dark_gray = colors.HexColor("#2D3748")

    # Typography Styles
    title_style = ParagraphStyle(
        "SBITitle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=15,
        leading=18,
        textColor=sbi_blue,
    )
    subtitle_style = ParagraphStyle(
        "SBISubTitle",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8,
        leading=11,
        textColor=colors.HexColor("#4A5568"),
    )
    meta_label = ParagraphStyle(
        "MetaLabel",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=7.5,
        leading=10,
        textColor=sbi_blue,
    )
    meta_val = ParagraphStyle(
        "MetaVal",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=7.5,
        leading=10,
        textColor=dark_gray,
    )
    th_style = ParagraphStyle(
        "TableHeader",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=7.5,
        leading=9.5,
        textColor=colors.white,
        alignment=0,
    )
    th_style_right = ParagraphStyle(
        "TableHeaderRight",
        parent=th_style,
        alignment=2,
    )
    td_style = ParagraphStyle(
        "TableCell",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=6.5,
        leading=8.5,
        textColor=dark_gray,
    )
    td_style_right = ParagraphStyle(
        "TableCellRight",
        parent=td_style,
        alignment=2,
    )
    td_credit = ParagraphStyle(
        "TableCredit",
        parent=td_style_right,
        fontName="Helvetica-Bold",
        textColor=colors.HexColor("#276749"),
    )
    td_debit = ParagraphStyle(
        "TableDebit",
        parent=td_style_right,
        fontName="Helvetica-Bold",
        textColor=colors.HexColor("#9B2C2C"),
    )

    story = []

    # 1. Header Banner & Bank Details
    header_data = [
        [
            Paragraph("<b>STATE BANK OF INDIA</b><br/><font size='7' color='#4A5568'>THE BANKER TO EVERY INDIAN</font>", title_style),
            Paragraph(
                f"<b>STATEMENT OF ACCOUNT</b><br/>"
                f"<font size='7' color='#718096'>Generated on: {datetime.now(timezone.utc).strftime('%d-%b-%Y %H:%M:%S')} UTC<br/>"
                f"Period: {from_date.strftime('%d-%b-%Y')} to {to_date.strftime('%d-%b-%Y')}</font>",
                subtitle_style
            ),
        ]
    ]
    header_table = Table(header_data, colWidths=[110 * mm, 70 * mm])
    header_table.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("ALIGN", (1, 0), (1, 0), "RIGHT"),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]))
    story.append(header_table)
    story.append(HRFlowable(width="100%", thickness=1.5, color=sbi_blue, spaceBefore=2, spaceAfter=8))

    # 2. Account & Customer Details Card
    cust_name = user.full_name or "Valued Customer"
    cust_address = user.address or "Address on Record with SBI"
    pan = user.pan_number or "PAN on File"
    acc_num = account.account_number
    acc_type = account.account_type.value.replace("_", " ").upper()
    ifsc = account.ifsc_code or "SBIN0000001"
    branch = account.branch_name or "Main Branch, Bengaluru"

    cust_info = [
        [Paragraph("<b>Account Holder:</b>", meta_label), Paragraph(cust_name, meta_val), Paragraph("<b>Account Number:</b>", meta_label), Paragraph(f"<b>{acc_num}</b>", meta_val)],
        [Paragraph("<b>Address:</b>", meta_label), Paragraph(cust_address[:45], meta_val), Paragraph("<b>Account Type:</b>", meta_label), Paragraph(acc_type, meta_val)],
        [Paragraph("<b>PAN:</b>", meta_label), Paragraph(pan, meta_val), Paragraph("<b>IFSC Code:</b>", meta_label), Paragraph(ifsc, meta_val)],
        [Paragraph("<b>Branch:</b>", meta_label), Paragraph(branch, meta_val), Paragraph("<b>Currency:</b>", meta_label), Paragraph("INR (₹)", meta_val)],
    ]
    info_table = Table(cust_info, colWidths=[28 * mm, 62 * mm, 28 * mm, 62 * mm])
    info_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), light_gray),
        ("BOX", (0, 0), (-1, -1), 0.5, gray_border),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING", (0, 0), (-1, -1), 3),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
        ("LEFTPADDING", (0, 0), (-1, -1), 5),
        ("RIGHTPADDING", (0, 0), (-1, -1), 5),
    ]))
    story.append(info_table)
    story.append(Spacer(1, 8))

    # 3. Financial Summary Bar
    total_credits = sum(Decimal(str(t.amount)) for t in transactions if t.type == TransactionType.CREDIT)
    total_debits = sum(Decimal(str(t.amount)) for t in transactions if t.type == TransactionType.DEBIT)
    
    # Calculate opening and closing balance
    if transactions:
        # sorted by date
        sorted_txns = sorted(transactions, key=lambda x: x.value_date)
        first_txn = sorted_txns[0]
        if first_txn.type == TransactionType.CREDIT:
            opening_balance = Decimal(str(first_txn.balance_after)) - Decimal(str(first_txn.amount))
        else:
            opening_balance = Decimal(str(first_txn.balance_after)) + Decimal(str(first_txn.amount))
        closing_balance = sorted_txns[-1].balance_after
    else:
        opening_balance = account.balance
        closing_balance = account.balance

    summary_data = [
        [
            Paragraph(f"<b>Opening Balance:</b> ₹{opening_balance:,.2f}", meta_val),
            Paragraph(f"<b>Total Credits (+):</b> <font color='#276749'>₹{total_credits:,.2f}</font>", meta_val),
            Paragraph(f"<b>Total Debits (-):</b> <font color='#9B2C2C'>₹{total_debits:,.2f}</font>", meta_val),
            Paragraph(f"<b>Closing Balance:</b> <b>₹{closing_balance:,.2f}</b>", meta_label),
        ]
    ]
    summary_table = Table(summary_data, colWidths=[45 * mm, 45 * mm, 45 * mm, 45 * mm])
    summary_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), sbi_light_blue),
        ("BOX", (0, 0), (-1, -1), 0.5, sbi_accent),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]))
    story.append(summary_table)
    story.append(Spacer(1, 10))

    # 4. Transaction Ledger Table
    table_headers = [
        Paragraph("Txn Date", th_style),
        Paragraph("Ref No / Channel", th_style),
        Paragraph("Description & Counterparty", th_style),
        Paragraph("Debit (₹)", th_style_right),
        Paragraph("Credit (₹)", th_style_right),
        Paragraph("Balance (₹)", th_style_right),
    ]
    table_rows = [table_headers]

    # Sort transactions chronologically
    sorted_txns = sorted(transactions, key=lambda x: x.value_date)

    for i, t in enumerate(sorted_txns):
        dt_str = t.value_date.strftime("%d-%b-%Y\n%H:%M") if t.value_date else ""
        ref_str = f"<b>{t.transaction_ref}</b><br/>{t.channel}"
        desc_str = f"{t.description or ''}"
        if t.counterparty_name:
            desc_str += f"<br/><font color='#718096'>{t.counterparty_name}</font>"

        debit_str = f"₹{t.amount:,.2f}" if t.type == TransactionType.DEBIT else "-"
        credit_str = f"₹{t.amount:,.2f}" if t.type == TransactionType.CREDIT else "-"
        bal_str = f"₹{t.balance_after:,.2f}"

        row = [
            Paragraph(dt_str, td_style),
            Paragraph(ref_str, td_style),
            Paragraph(desc_str, td_style),
            Paragraph(debit_str, td_debit if t.type == TransactionType.DEBIT else td_style_right),
            Paragraph(credit_str, td_credit if t.type == TransactionType.CREDIT else td_style_right),
            Paragraph(bal_str, td_style_right),
        ]
        table_rows.append(row)

    if len(table_rows) == 1:
        table_rows.append([
            Paragraph("No transactions recorded for the selected period.", td_style),
            Paragraph("", td_style), Paragraph("", td_style), Paragraph("", td_style),
            Paragraph("", td_style), Paragraph("", td_style),
        ])

    txn_table = Table(
        table_rows,
        colWidths=[22 * mm, 28 * mm, 68 * mm, 20 * mm, 20 * mm, 22 * mm],
        repeatRows=1,
    )
    
    t_style = [
        ("BACKGROUND", (0, 0), (-1, 0), sbi_blue),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("GRID", (0, 0), (-1, -1), 0.3, gray_border),
        ("TOPPADDING", (0, 0), (-1, -1), 3),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
        ("LEFTPADDING", (0, 0), (-1, -1), 3),
        ("RIGHTPADDING", (0, 0), (-1, -1), 3),
    ]
    # Alternating row background
    for r_idx in range(1, len(table_rows)):
        bg_col = colors.white if r_idx % 2 != 0 else colors.HexColor("#F7FAFC")
        t_style.append(("BACKGROUND", (0, r_idx), (-1, r_idx), bg_col))

    txn_table.setStyle(TableStyle(t_style))
    story.append(txn_table)
    story.append(Spacer(1, 10))

    # 5. Important Disclaimers & Footer
    disclaimer_text = (
        "<b>Important Notice:</b> This is a computer-generated statement and does not require a physical signature. "
        "Please examine this statement immediately. If no discrepancy is reported to the bank within 30 days of the statement date, "
        "the account entries will be considered correct. For queries, contact your branch or SBI 24x7 helpline: 1800-1234 / 1800-2100."
    )
    disclaimer_p = Paragraph(disclaimer_text, ParagraphStyle("Disc", parent=styles["Normal"], fontName="Helvetica-Oblique", fontSize=6, leading=8, textColor=colors.HexColor("#718096")))
    story.append(KeepTogether([
        HRFlowable(width="100%", thickness=0.5, color=gray_border, spaceBefore=4, spaceAfter=4),
        disclaimer_p
    ]))

    doc.build(story)
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes


# ── CSV Statement Generation ──────────────────────────────────────────

def generate_statement_csv(
    account: Account,
    user: User,
    transactions: List[Transaction],
    from_date: datetime,
    to_date: datetime,
) -> str:
    """Generates an official SBI Account Statement in CSV format."""
    output = io.StringIO()
    writer = csv.writer(output)

    # Header metadata
    writer.writerow(["STATE BANK OF INDIA - ACCOUNT STATEMENT"])
    writer.writerow(["Generated On", datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")])
    writer.writerow(["Statement Period", f"{from_date.strftime('%Y-%m-%d')} to {to_date.strftime('%Y-%m-%d')}"])
    writer.writerow([])
    writer.writerow(["Account Holder", user.full_name])
    writer.writerow(["Account Number", f"'{account.account_number}"])
    writer.writerow(["Account Type", account.account_type.value.upper()])
    writer.writerow(["Branch", account.branch_name or "Main Branch"])
    writer.writerow(["IFSC Code", account.ifsc_code or "SBIN0000001"])
    writer.writerow(["Currency", "INR"])
    writer.writerow([])

    # Table columns
    writer.writerow([
        "Txn Date",
        "Value Date",
        "Transaction Ref",
        "Description",
        "Category",
        "Counterparty Name",
        "Counterparty Account",
        "Counterparty IFSC",
        "Channel",
        "Debit (INR)",
        "Credit (INR)",
        "Balance (INR)",
    ])

    sorted_txns = sorted(transactions, key=lambda x: x.value_date)
    for t in sorted_txns:
        writer.writerow([
            t.value_date.strftime("%Y-%m-%d %H:%M:%S") if t.value_date else "",
            t.value_date.strftime("%Y-%m-%d") if t.value_date else "",
            t.transaction_ref,
            t.description,
            t.category.value if t.category else "",
            t.counterparty_name or "",
            t.counterparty_account or "",
            t.counterparty_ifsc or "",
            t.channel or "",
            f"{t.amount:.2f}" if t.type == TransactionType.DEBIT else "",
            f"{t.amount:.2f}" if t.type == TransactionType.CREDIT else "",
            f"{t.balance_after:.2f}",
        ])

    return output.getvalue()
