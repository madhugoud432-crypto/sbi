"""
CLI Script: Manage User Profiles & Bank Accounts for SBI Portal.

Usage:
    # 1. List all profiles:
    python scripts/manage_user.py --list

    # 2. Create a new profile with a bank account:
    python scripts/manage_user.py --create --username john.doe --name "John Doe" --email "john@example.com" --password "John@1234" --balance 150000 --phone "9876543210"

    # 3. Update an existing profile's details or balance:
    python scripts/manage_user.py --update --username rahul.sharma --name "Rahul V. Sharma" --balance 500000 --password "Rahul@9999"
"""

import sys
import os
import argparse
import random
import uuid
from decimal import Decimal
from datetime import datetime, timezone

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from app.db.session import SessionLocal
from app.models.models import User, Account, UserRole, UserStatus, AccountType, AccountStatus
from app.core.security import hash_password
from app.services.statement_generator import populate_account_random_statements


def gen_account_number():
    return "".join([str(random.randint(0, 9)) for _ in range(11)])


def list_users(db):
    users = db.query(User).all()
    print("=" * 80)
    print(f"{'USERNAME':<18} | {'FULL NAME':<22} | {'ROLE':<8} | {'PHONE':<12} | {'ACCOUNTS / BALANCE'}")
    print("=" * 80)
    for u in users:
        acc_info = []
        for a in u.accounts:
            acc_info.append(f"{a.account_number} ({a.account_type.value}: INR {a.balance:,.2f})")
        acc_str = ", ".join(acc_info) if acc_info else "No accounts"
        print(f"{u.username:<18} | {u.full_name:<22} | {u.role.value:<8} | {str(u.phone or '-'):<12} | {acc_str}")
    print("=" * 80)
    print(f"Total Profiles: {len(users)}")


def create_user(db, args):
    if not args.username or not args.name or not args.password:
        print("[ERROR] Please provide --username, --name, and --password to create a user.")
        return

    existing = db.query(User).filter(
        (User.username == args.username) | (User.email == (args.email or f"{args.username}@sbi.co.in"))
    ).first()
    if existing:
        print(f"[ERROR] User '{args.username}' or email already exists in database.")
        return

    email = args.email or f"{args.username}@sbi.co.in"
    role = UserRole.ADMIN if args.role.lower() == "admin" else UserRole.CUSTOMER

    user = User(
        id=str(uuid.uuid4()),
        username=args.username,
        email=email,
        full_name=args.name,
        hashed_password=hash_password(args.password),
        role=role,
        status=UserStatus.ACTIVE,
        is_verified=True,
        phone=args.phone or "".join([str(random.randint(0, 9)) for _ in range(10)]),
        address=args.address or "Address on record with SBI",
        pan_number=args.pan or "ABCDE" + str(random.randint(1000, 9999)) + "F",
        aadhar_last4=str(random.randint(1000, 9999)),
    )
    db.add(user)
    db.flush()

    # Create Primary Savings Account
    init_balance = Decimal(str(args.balance if args.balance is not None else 100000.00))
    account = Account(
        id=str(uuid.uuid4()),
        user_id=user.id,
        account_number=args.account_number or gen_account_number(),
        account_type=AccountType.SAVINGS,
        status=AccountStatus.ACTIVE,
        balance=init_balance,
        available_balance=init_balance,
        branch_code="001",
        branch_name="Main Branch, Bengaluru",
        ifsc_code="SBIN0000001",
        interest_rate=Decimal("3.50"),
        is_primary=True,
        nominee_name="Nominee on file",
    )
    db.add(account)
    db.commit()
    db.refresh(user)
    db.refresh(account)

    print(f"[SUCCESS] Created new user profile:")
    print(f"  • Username:       {user.username}")
    print(f"  • Full Name:      {user.full_name}")
    print(f"  • Email:          {user.email}")
    print(f"  • Phone:          {user.phone}")
    print(f"  • Role:           {user.role.value}")
    print(f"  • Account Number: {account.account_number} ({account.account_type.value.upper()})")
    print(f"  • Balance:        INR {account.balance:,.2f}")
    print(f"  • Password:       {args.password}")

    # Generate initial statement history if requested
    if args.generate_statements:
        print("Generating initial 30 statement transactions...")
        populate_account_random_statements(db, account.id, count=30, days_back=90, starting_balance=init_balance)
        db.refresh(account)
        print(f"  • Updated Balance after statements: INR {account.balance:,.2f}")


def update_user(db, args):
    if not args.username:
        print("[ERROR] Please specify --username of the profile to update.")
        return

    user = db.query(User).filter(User.username == args.username).first()
    if not user:
        print(f"[ERROR] User '{args.username}' not found.")
        return

    changes = []
    if args.name:
        user.full_name = args.name
        changes.append(f"Full Name -> {args.name}")
    if args.email:
        user.email = args.email
        changes.append(f"Email -> {args.email}")
    if args.phone:
        user.phone = args.phone
        changes.append(f"Phone -> {args.phone}")
    if args.address:
        user.address = args.address
        changes.append(f"Address -> {args.address}")
    if args.pan:
        user.pan_number = args.pan
        changes.append(f"PAN -> {args.pan}")
    if args.password:
        user.hashed_password = hash_password(args.password)
        changes.append(f"Password updated")
    if args.role:
        user.role = UserRole.ADMIN if args.role.lower() == "admin" else UserRole.CUSTOMER
        changes.append(f"Role -> {user.role.value}")

    # Update account balance if provided
    if args.balance is not None:
        primary_acc = db.query(Account).filter(Account.user_id == user.id).first()
        if primary_acc:
            new_bal = Decimal(str(args.balance))
            primary_acc.balance = new_bal
            primary_acc.available_balance = new_bal
            changes.append(f"Account {primary_acc.account_number} Balance -> INR {new_bal:,.2f}")

    db.commit()
    print(f"[SUCCESS] Updated user '{args.username}':")
    for c in changes:
        print(f"  • {c}")


def main():
    parser = argparse.ArgumentParser(description="Manage SBI Portal Profiles & Accounts")
    parser.add_argument("--list", action="store_true", help="List all existing user profiles and balances")
    parser.add_argument("--create", action="store_true", help="Create a new profile with bank account")
    parser.add_argument("--update", action="store_true", help="Update an existing profile's details or balance")

    # Fields
    parser.add_argument("--username", type=str, help="Username")
    parser.add_argument("--name", type=str, help="Full Name")
    parser.add_argument("--email", type=str, help="Email Address")
    parser.add_argument("--password", type=str, help="Plaintext Password")
    parser.add_argument("--phone", type=str, help="Phone Number (10 digits)")
    parser.add_argument("--pan", type=str, help="PAN Number (10 chars)")
    parser.add_argument("--address", type=str, help="Home Address")
    parser.add_argument("--role", type=str, default="customer", choices=["customer", "admin"], help="User role (customer/admin)")
    parser.add_argument("--balance", type=float, help="Account Balance (INR)")
    parser.add_argument("--account-number", type=str, help="Custom Account Number (optional)")
    parser.add_argument("--generate-statements", action="store_true", help="Generate 30 sample transactions for the new account")

    args = parser.parse_args()
    db = SessionLocal()

    try:
        if args.list:
            list_users(db)
        elif args.create:
            create_user(db, args)
        elif args.update:
            update_user(db, args)
        else:
            parser.print_help()
    except Exception as e:
        print(f"[ERROR] Operation failed: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    main()
