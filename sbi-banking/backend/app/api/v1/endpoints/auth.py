from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.api.deps import get_current_user
from app.models.models import User
from app.schemas.schemas import (
    LoginRequest, OTPVerifyRequest, TokenResponse,
    RefreshRequest, ChangePasswordRequest, MessageResponse, UserResponse,
    RegistrationRequest, ActivationRequest,
)
from app.services.auth_service import (
    authenticate_user, create_otp_session,
    verify_otp_and_login, refresh_access_token, change_password,
    register_user, activate_user,
)
from app.core.security import generate_captcha_text
from app.db.redis import set_session, get_session

router = APIRouter()


@router.get("/captcha")
def get_captcha():
    """Generate a CAPTCHA challenge."""
    import uuid
    captcha_id = str(uuid.uuid4())
    text = generate_captcha_text()
    set_session(f"captcha:{captcha_id}", text, expire_seconds=300)
    return {"captcha_id": captcha_id, "question": f"Enter: {text}"}


@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    """Step 1: Validate username/password, return session_token for OTP."""
    user, error = authenticate_user(db, data.username, data.password)
    if error:
        raise HTTPException(status_code=401, detail=error)

    session_token, otp = create_otp_session(user.id)

    return {
        "session_token": session_token,
        "message": f"OTP sent to registered mobile. (Demo OTP: {otp})",
        "demo_otp": otp,
        "otp": otp,
        "otp_required": True,
    }


@router.post("/verify-otp", response_model=TokenResponse)
def verify_otp(data: OTPVerifyRequest, db: Session = Depends(get_db)):
    """Step 2: Verify OTP and get JWT tokens."""
    return verify_otp_and_login(db, data.session_token, data.otp)


@router.post("/refresh")
def refresh_token(data: RefreshRequest, db: Session = Depends(get_db)):
    return refresh_access_token(db, data.refresh_token)


@router.post("/logout", response_model=MessageResponse)
def logout(current_user: User = Depends(get_current_user)):
    return MessageResponse(message="Logged out successfully")


@router.post("/change-password", response_model=MessageResponse)
def change_pwd(
    data: ChangePasswordRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    change_password(db, current_user, data.current_password, data.new_password)
    return MessageResponse(message="Password changed successfully")


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.post("/register")
def register(data: RegistrationRequest, db: Session = Depends(get_db)):
    """User-driven new user registration."""
    return register_user(
        db,
        account_number=data.account_number,
        cif_number=data.cif_number,
        branch_code=data.branch_code,
        country_code=data.country_code,
        mobile_number=data.mobile_number,
        facility=data.facility,
        captcha_token=data.captcha_token,
        captcha_answer=data.captcha_answer,
    )


@router.post("/activate")
def activate(data: ActivationRequest, db: Session = Depends(get_db)):
    """Activate a pending username (Activation Of Username flow)."""
    return activate_user(
        db,
        temp_username=data.temp_username,
        cif_number=data.cif_number,
        date_of_birth=data.date_of_birth,
        captcha_token=data.captcha_token,
        captcha_answer=data.captcha_answer,
    )


@router.post("/demo-login", response_model=TokenResponse)
def demo_login(payload: dict, db: Session = Depends(get_db)):
    """Instant login without OTP/Captcha for testing.
    Can log in as seeded users or dynamically create a user with all data.
    """
    from app.models.models import UserRole, UserStatus, Account, AccountType, AccountStatus, Transaction, TransactionType, TransactionCategory, Beneficiary
    from app.core.security import hash_password, create_access_token, create_refresh_token
    from decimal import Decimal
    import random
    import uuid
    from datetime import datetime, timedelta, timezone

    username = payload.get("username")
    create_new = payload.get("create_new", False)

    if create_new:
        # Create a new user with all values
        suffix = uuid.uuid4().hex[:6]
        new_username = f"demo.{suffix}"
        
        indian_names = ["Aarav Patel", "Neha Gupta", "Vikram Mehta", "Priya Sharma", "Aditya Rao", "Ananya Nair", "Rajesh Iyer", "Meera Sen"]
        full_name = random.choice(indian_names)
        
        user = User(
            id=str(uuid.uuid4()),
            username=new_username,
            email=f"{new_username}@example.com",
            phone="9" + "".join([str(random.randint(0, 9)) for _ in range(9)]),
            full_name=full_name,
            hashed_password=hash_password("Demo@1234"),
            role=UserRole.CUSTOMER,
            status=UserStatus.ACTIVE,
            is_verified=True,
            address=f"{random.randint(10, 150)}, Residency Road, Bengaluru, Karnataka - 560025",
            pan_number="".join([random.choice("ABCDEFGHIJKLMNOPQRSTUVWXYZ") for _ in range(5)]) + "".join([str(random.randint(0, 9)) for _ in range(4)]) + random.choice("ABCDEFGHIJKLMNOPQRSTUVWXYZ"),
            aadhar_last4="".join([str(random.randint(0, 9)) for _ in range(4)]),
            date_of_birth=datetime.now(timezone.utc) - timedelta(days=365 * random.randint(22, 60))
        )
        db.add(user)
        db.flush()

        # Seed Accounts
        savings_num = "".join([str(random.randint(0, 9)) for _ in range(11)])
        savings = Account(
            id=str(uuid.uuid4()),
            user_id=user.id,
            account_number=savings_num,
            account_type=AccountType.SAVINGS,
            status=AccountStatus.ACTIVE,
            balance=Decimal("175450.00"),
            available_balance=Decimal("175450.00"),
            branch_code="001",
            branch_name="MG Road Branch, Bengaluru",
            ifsc_code="SBIN0000001",
            interest_rate=Decimal("3.50"),
            is_primary=True,
            nominee_name=f"Spouse of {full_name.split()[0]}"
        )
        db.add(savings)

        current_num = "".join([str(random.randint(0, 9)) for _ in range(11)])
        current = Account(
            id=str(uuid.uuid4()),
            user_id=user.id,
            account_number=current_num,
            account_type=AccountType.CURRENT,
            status=AccountStatus.ACTIVE,
            balance=Decimal("62300.00"),
            available_balance=Decimal("62300.00"),
            branch_code="001",
            branch_name="MG Road Branch, Bengaluru",
            ifsc_code="SBIN0000001",
            interest_rate=Decimal("0.00"),
            is_primary=False
        )
        db.add(current)
        db.flush()

        # Seed Transactions for Savings Account
        txn_templates = [
            ("Salary Credit", TransactionType.CREDIT, TransactionCategory.SALARY, 85000),
            ("ATM Withdrawal", TransactionType.DEBIT, TransactionCategory.ATM, 5000),
            ("Online Purchase - Amazon", TransactionType.DEBIT, TransactionCategory.POS, 1299),
            ("Interest Credit", TransactionType.CREDIT, TransactionCategory.INTEREST, 312),
            ("UPI Payment - Swiggy", TransactionType.DEBIT, TransactionCategory.UPI, 485),
            ("UPI - Petrol Pump", TransactionType.DEBIT, TransactionCategory.UPI, 3000),
            ("UPI - Grocery", TransactionType.DEBIT, TransactionCategory.UPI, 1240),
            ("Refund Credit", TransactionType.CREDIT, TransactionCategory.OTHER, 1500),
            ("NEFT Transfer - HDFC Bank", TransactionType.DEBIT, TransactionCategory.NEFT, 25000),
            ("UPI Payment - Zomato", TransactionType.DEBIT, TransactionCategory.UPI, 620),
            ("Uber Ride UPI", TransactionType.DEBIT, TransactionCategory.UPI, 350),
            ("Cash Deposit", TransactionType.CREDIT, TransactionCategory.OTHER, 10000)
        ]

        running_balance = Decimal("175450.00")
        now = datetime.now(timezone.utc)
        for i, (desc, t_type, cat, amt_val) in enumerate(txn_templates):
            amt = Decimal(str(amt_val))
            txn_date = now - timedelta(days=len(txn_templates) - i, hours=random.randint(0, 23))
            
            txn = Transaction(
                id=str(uuid.uuid4()),
                account_id=savings.id,
                transaction_ref=f"SBI{uuid.uuid4().hex[:18].upper()}",
                type=t_type,
                category=cat,
                amount=amt,
                balance_after=running_balance,
                description=desc,
                value_date=txn_date,
                channel="NET_BANKING"
            )
            db.add(txn)
            if t_type == TransactionType.DEBIT:
                running_balance -= amt
            else:
                running_balance += amt

        # Seed Beneficiary
        b = Beneficiary(
            id=str(uuid.uuid4()),
            user_id=user.id,
            account_number="".join([str(random.randint(0, 9)) for _ in range(11)]),
            ifsc_code="HDFC0001234",
            bank_name="HDFC Bank",
            beneficiary_name="Amit Kumar",
            nickname="Amit",
            is_verified=True
        )
        db.add(b)
        db.commit()
        db.refresh(user)

    else:
        # Sign in as pre-seeded user
        if not username:
            username = "rahul.sharma"
            
        user = db.query(User).filter(User.username == username).first()
        if not user:
            # Fallback check for admin
            if username == "admin":
                user = db.query(User).filter(User.role == UserRole.ADMIN).first()
            else:
                user = db.query(User).filter(User.role == UserRole.CUSTOMER).first()
                
        if not user:
            raise HTTPException(status_code=404, detail=f"Demo user '{username}' not found. Please run seed script.")

    # Generate tokens
    access_token = create_access_token(user.id, {"role": user.role.value})
    refresh_token = create_refresh_token(user.id)

    # Update login info
    user.failed_login_attempts = 0
    user.last_login = datetime.now(timezone.utc)
    db.commit()
    db.refresh(user)

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=UserResponse.model_validate(user),
    )
