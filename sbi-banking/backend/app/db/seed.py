"""
Seed script: creates demo data for SBI Banking portal.
Run: python -m app.db.seed
"""
import uuid
import random
import sys
import os
from decimal import Decimal
from datetime import datetime, timedelta, timezone

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.db.session import SessionLocal
from app.db.base import Base
from app.db.session import engine
from app.models.models import (
    User, Account, Transaction, Beneficiary,
    UserRole, UserStatus, AccountType, AccountStatus,
    TransactionType, TransactionCategory
)
from app.core.security import hash_password
from app.core.config import settings


def gen_uuid():
    return str(uuid.uuid4())


def gen_account_number():
    return "".join([str(random.randint(0, 9)) for _ in range(11)])


def gen_ref():
    return f"SBI{uuid.uuid4().hex[:18].upper()}"


TRANSACTIONS_DATA = [
    ("NEFT Transfer - HDFC Bank", TransactionType.DEBIT, TransactionCategory.NEFT, 25000),
    ("Salary Credit", TransactionType.CREDIT, TransactionCategory.SALARY, 85000),
    ("ATM Withdrawal", TransactionType.DEBIT, TransactionCategory.ATM, 5000),
    ("Online Purchase - Amazon", TransactionType.DEBIT, TransactionCategory.POS, 1299),
    ("Interest Credit", TransactionType.CREDIT, TransactionCategory.INTEREST, 312),
    ("IMPS Transfer", TransactionType.DEBIT, TransactionCategory.IMPS, 15000),
    ("Bill Payment - Electricity", TransactionType.DEBIT, TransactionCategory.OTHER, 2450),
    ("UPI Payment - Swiggy", TransactionType.DEBIT, TransactionCategory.UPI, 485),
    ("Salary Credit", TransactionType.CREDIT, TransactionCategory.SALARY, 85000),
    ("EMI - Home Loan", TransactionType.DEBIT, TransactionCategory.OTHER, 23500),
    ("ATM Withdrawal", TransactionType.DEBIT, TransactionCategory.ATM, 10000),
    ("RTGS Transfer", TransactionType.DEBIT, TransactionCategory.RTGS, 100000),
    ("Refund Credit", TransactionType.CREDIT, TransactionCategory.OTHER, 1299),
    ("UPI - Petrol Pump", TransactionType.DEBIT, TransactionCategory.UPI, 3000),
    ("Interest Credit", TransactionType.CREDIT, TransactionCategory.INTEREST, 287),
    ("Online Purchase - Flipkart", TransactionType.DEBIT, TransactionCategory.POS, 4599),
    ("NEFT Received", TransactionType.CREDIT, TransactionCategory.NEFT, 50000),
    ("Service Charges", TransactionType.DEBIT, TransactionCategory.CHARGES, 50),
    ("UPI - Grocery", TransactionType.DEBIT, TransactionCategory.UPI, 1240),
    ("FD Maturity Credit", TransactionType.CREDIT, TransactionCategory.OTHER, 52000),
]


from app.services.statement_generator import populate_account_random_statements


def seed():
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # Check if already seeded
        if db.query(User).filter(User.username == settings.ADMIN_USERNAME).first():
            print("Database already seeded. Skipping.")
            return

        print("Seeding users...")

        # Admin
        admin = User(
            id=gen_uuid(),
            username=settings.ADMIN_USERNAME,
            email=settings.ADMIN_EMAIL,
            full_name="SBI Administrator",
            hashed_password=hash_password(settings.ADMIN_PASSWORD),
            role=UserRole.ADMIN,
            status=UserStatus.ACTIVE,
            is_verified=True,
            phone="9000000000",
        )
        db.add(admin)

        # Demo customer
        customer = User(
            id=gen_uuid(),
            username="rahul.sharma",
            email="rahul.sharma@email.com",
            full_name="Rahul Sharma",
            hashed_password=hash_password("Rahul@1234"),
            role=UserRole.CUSTOMER,
            status=UserStatus.ACTIVE,
            is_verified=True,
            phone="9876543210",
            address="42, MG Road, Bengaluru, Karnataka - 560001",
            pan_number="ABCDE1234F",
            aadhar_last4="7890",
        )
        db.add(customer)

        # Second demo customer
        customer2 = User(
            id=gen_uuid(),
            username="priya.singh",
            email="priya.singh@email.com",
            full_name="Priya Singh",
            hashed_password=hash_password("Priya@1234"),
            role=UserRole.CUSTOMER,
            status=UserStatus.ACTIVE,
            is_verified=True,
            phone="9123456789",
        )
        db.add(customer2)
        db.flush()

        print("Seeding accounts & realistic random statements...")

        # Savings account for Rahul
        savings = Account(
            id=gen_uuid(),
            user_id=customer.id,
            account_number=gen_account_number(),
            account_type=AccountType.SAVINGS,
            status=AccountStatus.ACTIVE,
            balance=Decimal("248750.00"),
            available_balance=Decimal("248750.00"),
            branch_code="001",
            branch_name="MG Road Branch, Bengaluru",
            ifsc_code="SBIN0000001",
            interest_rate=Decimal("3.50"),
            is_primary=True,
            nominee_name="Sunita Sharma",
        )
        db.add(savings)

        # Current account
        current = Account(
            id=gen_uuid(),
            user_id=customer.id,
            account_number=gen_account_number(),
            account_type=AccountType.CURRENT,
            status=AccountStatus.ACTIVE,
            balance=Decimal("75300.00"),
            available_balance=Decimal("75300.00"),
            branch_code="001",
            branch_name="MG Road Branch, Bengaluru",
            ifsc_code="SBIN0000001",
            interest_rate=Decimal("0.00"),
            is_primary=False,
        )
        db.add(current)

        # Fixed deposit
        fd = Account(
            id=gen_uuid(),
            user_id=customer.id,
            account_number=gen_account_number(),
            account_type=AccountType.FIXED_DEPOSIT,
            status=AccountStatus.ACTIVE,
            balance=Decimal("500000.00"),
            available_balance=Decimal("0.00"),
            branch_code="001",
            branch_name="MG Road Branch, Bengaluru",
            ifsc_code="SBIN0000001",
            interest_rate=Decimal("7.00"),
            is_primary=False,
        )
        db.add(fd)

        # Beneficiary
        b = Beneficiary(
            id=gen_uuid(),
            user_id=customer.id,
            account_number=gen_account_number(),
            ifsc_code="HDFC0001234",
            bank_name="HDFC Bank",
            beneficiary_name="Amit Kumar",
            nickname="Amit",
            is_verified=True,
        )
        db.add(b)

        # Account for customer2
        savings2 = Account(
            id=gen_uuid(),
            user_id=customer2.id,
            account_number=gen_account_number(),
            account_type=AccountType.SAVINGS,
            status=AccountStatus.ACTIVE,
            balance=Decimal("125000.00"),
            available_balance=Decimal("125000.00"),
            branch_code="002",
            branch_name="Connaught Place Branch, Delhi",
            ifsc_code="SBIN0000002",
            is_primary=True,
        )
        db.add(savings2)
        db.commit()

        # Generate realistic random multi-month statement history
        print("Generating random statement history for Rahul's Savings Account (60 txns, 180 days)...")
        populate_account_random_statements(db, savings.id, count=60, days_back=180, starting_balance=Decimal("180000.00"))

        print("Generating random statement history for Rahul's Current Account (30 txns, 90 days)...")
        populate_account_random_statements(db, current.id, count=30, days_back=90, starting_balance=Decimal("60000.00"))

        print("Generating random statement history for Priya's Savings Account (35 txns, 90 days)...")
        populate_account_random_statements(db, savings2.id, count=35, days_back=90, starting_balance=Decimal("95000.00"))

        print("[OK] Seed complete with full random statement history!")
        print()
        print("=" * 50)
        print("Demo Credentials")
        print("=" * 50)
        print(f"Admin:    {settings.ADMIN_USERNAME} / {settings.ADMIN_PASSWORD}")
        print(f"Customer: rahul.sharma / Rahul@1234")
        print(f"Customer: priya.singh / Priya@1234")
        print("=" * 50)

    except Exception as e:
        print(f"Seed error: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()

