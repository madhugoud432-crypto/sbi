"""
CLI Script: Generate Random Banking Statements for SBI Portal.

Usage:
    python generate_random_statements.py [--count 50] [--days 180] [--account 12345678901] [--username rahul.sharma] [--clear] [--export-pdf statement.pdf] [--export-csv statement.csv]
"""

import sys
import os
import argparse
from datetime import datetime, timedelta, timezone

# Add backend directory to sys.path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from app.db.session import SessionLocal
from app.models.models import Account, User, Transaction
from app.services.statement_generator import (
    populate_account_random_statements,
    populate_all_accounts_random_statements,
    generate_statement_pdf,
    generate_statement_csv,
)


def main():
    parser = argparse.ArgumentParser(description="Generate realistic random bank statements for SBI Portal.")
    parser.add_argument("--count", type=int, default=40, help="Number of transactions to generate per account (default: 40)")
    parser.add_argument("--days", type=int, default=90, help="Number of past days to distribute transactions across (default: 90)")
    parser.add_argument("--account", type=str, default=None, help="Target account number or account ID")
    parser.add_argument("--username", type=str, default=None, help="Target username to generate statements for all their accounts")
    parser.add_argument("--clear", action="store_true", help="Clear existing transactions before generating")
    parser.add_argument("--export-pdf", type=str, default=None, help="Export generated statement to specified PDF file path")
    parser.add_argument("--export-csv", type=str, default=None, help="Export generated statement to specified CSV file path")

    args = parser.parse_args()

    db = SessionLocal()
    try:
        print("=" * 65)
        print("    STATE BANK OF INDIA - RANDOM STATEMENT GENERATOR")
        print("=" * 65)

        target_accounts = []

        if args.account:
            acc = db.query(Account).filter(
                (Account.account_number == args.account) | (Account.id == args.account)
            ).first()
            if not acc:
                print(f"[ERROR] Account '{args.account}' not found.")
                return
            target_accounts.append(acc)
        elif args.username:
            user = db.query(User).filter(User.username == args.username).first()
            if not user:
                print(f"[ERROR] User '{args.username}' not found.")
                return
            target_accounts = db.query(Account).filter(Account.user_id == user.id).all()
            if not target_accounts:
                print(f"[WARN] No accounts found for user '{args.username}'.")
                return
        else:
            target_accounts = db.query(Account).all()
            if not target_accounts:
                print("[WARN] No accounts found in database. Please run seed script first: python -m app.db.seed")
                return

        print(f"Target Accounts: {len(target_accounts)}")
        print(f"Transactions per Account: {args.count}")
        print(f"Time Range: Past {args.days} days")
        print(f"Clear Existing: {'YES' if args.clear else 'NO'}")
        print("-" * 65)

        total_created = 0
        for acc in target_accounts:
            user = acc.user
            user_label = user.full_name if user else "Unknown User"
            print(f"Processing Account: {acc.account_number} ({acc.account_type.value.upper()}) - Holder: {user_label}...")

            txns, updated_acc = populate_account_random_statements(
                db=db,
                account_id=acc.id,
                count=args.count,
                days_back=args.days,
                clear_existing=args.clear,
            )
            total_created += len(txns)
            print(f"  -> Generated {len(txns)} transactions. Updated Balance: INR {updated_acc.balance:,.2f}")

            # Optional exports
            now = datetime.now(timezone.utc)
            from_dt = now - timedelta(days=args.days)
            to_dt = now

            if args.export_pdf:
                pdf_path = args.export_pdf
                if len(target_accounts) > 1:
                    base, ext = os.path.splitext(pdf_path)
                    pdf_path = f"{base}_{acc.account_number}{ext}"
                pdf_bytes = generate_statement_pdf(
                    account=updated_acc,
                    user=user,
                    transactions=txns,
                    from_date=from_dt,
                    to_date=to_dt,
                )
                with open(pdf_path, "wb") as f:
                    f.write(pdf_bytes)
                print(f"  -> Exported PDF statement to: {pdf_path}")

            if args.export_csv:
                csv_path = args.export_csv
                if len(target_accounts) > 1:
                    base, ext = os.path.splitext(csv_path)
                    csv_path = f"{base}_{acc.account_number}{ext}"
                csv_text = generate_statement_csv(
                    account=updated_acc,
                    user=user,
                    transactions=txns,
                    from_date=from_dt,
                    to_date=to_dt,
                )
                with open(csv_path, "w", encoding="utf-8") as f:
                    f.write(csv_text)
                print(f"  -> Exported CSV statement to: {csv_path}")

        print("=" * 65)
        print(f"[SUCCESS] Complete! Total transactions created: {total_created}")
        print("=" * 65)

    except Exception as e:
        print(f"[ERROR] Statement generation failed: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()
