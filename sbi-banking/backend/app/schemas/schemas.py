from pydantic import BaseModel, EmailStr, field_validator, model_validator
from typing import Optional, List
from decimal import Decimal
from datetime import datetime
import re

from app.models.models import (
    UserRole, UserStatus, AccountType, AccountStatus,
    TransactionType, TransactionCategory, TransferStatus
)


# ── Auth Schemas ─────────────────────────────────────────────
class LoginRequest(BaseModel):
    username: str
    password: str
    captcha_token: Optional[str] = None
    captcha_answer: Optional[str] = None


class OTPVerifyRequest(BaseModel):
    session_token: str
    otp: str


class RegistrationRequest(BaseModel):
    account_number: str
    cif_number: str
    branch_code: str
    country_code: str
    mobile_number: str
    facility: str  # Full / Limited / View
    captcha_token: str
    captcha_answer: str
    consent: bool = True


class ActivationRequest(BaseModel):
    temp_username: str
    cif_number: str
    date_of_birth: str  # dd/mm/yyyy
    captcha_token: str
    captcha_answer: str

    @field_validator("temp_username")
    @classmethod
    def _u(cls, v):
        if not v or len(v) > 16:
            raise ValueError("Enter a valid temporary username")
        return v

    @field_validator("cif_number")
    @classmethod
    def _cif(cls, v):
        if not v.isdigit() or not (1 <= len(v) <= 20):
            raise ValueError("CIF number must be numeric")
        return v


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: "UserResponse"


class RefreshRequest(BaseModel):
    refresh_token: str


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str
    confirm_password: str

    @field_validator("new_password")
    @classmethod
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        if not re.search(r"[A-Z]", v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not re.search(r"[0-9]", v):
            raise ValueError("Password must contain at least one digit")
        if not re.search(r"[!@#$%^&*]", v):
            raise ValueError("Password must contain at least one special character")
        return v

    @model_validator(mode="after")
    def passwords_match(self):
        if self.new_password != self.confirm_password:
            raise ValueError("Passwords do not match")
        return self


# ── User Schemas ─────────────────────────────────────────────
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    phone: Optional[str] = None
    full_name: str
    password: str
    role: UserRole = UserRole.CUSTOMER


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    full_name: Optional[str] = None
    address: Optional[str] = None


class UserResponse(BaseModel):
    id: str
    username: str
    email: str
    phone: Optional[str]
    full_name: str
    role: UserRole
    status: UserStatus
    is_verified: bool
    last_login: Optional[datetime]
    created_at: datetime
    profile_image: Optional[str] = None

    model_config = {"from_attributes": True}


class UserAdminResponse(UserResponse):
    failed_login_attempts: int
    pan_number: Optional[str]
    address: Optional[str]


# ── Account Schemas ───────────────────────────────────────────
class AccountCreate(BaseModel):
    account_type: AccountType = AccountType.SAVINGS
    branch_code: Optional[str] = None
    branch_name: Optional[str] = None
    ifsc_code: Optional[str] = None
    nominee_name: Optional[str] = None
    is_primary: bool = False


class AccountResponse(BaseModel):
    id: str
    user_id: str
    account_number: str
    account_type: AccountType
    status: AccountStatus
    balance: Decimal
    available_balance: Decimal
    branch_code: Optional[str]
    branch_name: Optional[str]
    ifsc_code: Optional[str]
    currency: str
    interest_rate: Decimal
    is_primary: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class AccountSummary(BaseModel):
    id: str
    account_number: str
    account_type: AccountType
    balance: Decimal
    available_balance: Decimal
    status: AccountStatus

    model_config = {"from_attributes": True}


# ── Transaction Schemas ───────────────────────────────────────
class TransactionResponse(BaseModel):
    id: str
    account_id: str
    transaction_ref: str
    type: TransactionType
    category: TransactionCategory
    amount: Decimal
    balance_after: Decimal
    description: Optional[str]
    narration: Optional[str]
    counterparty_name: Optional[str]
    counterparty_account: Optional[str]
    channel: str
    value_date: datetime
    created_at: datetime

    model_config = {"from_attributes": True}


class TransactionFilter(BaseModel):
    from_date: Optional[datetime] = None
    to_date: Optional[datetime] = None
    type: Optional[TransactionType] = None
    category: Optional[TransactionCategory] = None
    min_amount: Optional[Decimal] = None
    max_amount: Optional[Decimal] = None
    search: Optional[str] = None


# ── Transfer Schemas ──────────────────────────────────────────
class TransferCreate(BaseModel):
    from_account_id: str
    beneficiary_account: str
    beneficiary_ifsc: str
    beneficiary_name: str
    beneficiary_bank: Optional[str] = None
    amount: Decimal
    transfer_type: str = "IMPS"
    remarks: Optional[str] = None

    @field_validator("amount")
    @classmethod
    def validate_amount(cls, v):
        if v <= 0:
            raise ValueError("Amount must be positive")
        if v > Decimal("1000000"):
            raise ValueError("Amount exceeds maximum transfer limit")
        return v


class TransferOTPRequest(BaseModel):
    transfer_id: str
    otp: str


class TransferResponse(BaseModel):
    id: str
    from_account_id: str
    transfer_ref: str
    transfer_type: str
    amount: Decimal
    status: TransferStatus
    beneficiary_name: Optional[str]
    beneficiary_account: Optional[str]
    beneficiary_ifsc: Optional[str]
    remarks: Optional[str]
    otp_verified: bool
    processed_at: Optional[datetime]
    created_at: datetime

    model_config = {"from_attributes": True}


# ── Beneficiary Schemas ───────────────────────────────────────
class BeneficiaryCreate(BaseModel):
    account_number: str
    ifsc_code: str
    bank_name: Optional[str] = None
    beneficiary_name: str
    nickname: Optional[str] = None


class BeneficiaryResponse(BaseModel):
    id: str
    nickname: Optional[str]
    account_number: str
    ifsc_code: Optional[str]
    bank_name: Optional[str]
    beneficiary_name: str
    is_verified: bool
    daily_limit: Decimal
    created_at: datetime

    model_config = {"from_attributes": True}


# ── Dashboard Schemas ─────────────────────────────────────────
class DashboardResponse(BaseModel):
    user: UserResponse
    accounts: List[AccountSummary]
    recent_transactions: List[TransactionResponse]
    total_balance: Decimal
    total_accounts: int


# ── Admin Schemas ─────────────────────────────────────────────
class AdminStatsResponse(BaseModel):
    total_users: int
    active_users: int
    locked_users: int
    total_accounts: int
    total_balance: Decimal
    total_transactions_today: int
    total_transfers_today: int
    pending_transfers: int


class PaginatedResponse(BaseModel):
    items: list
    total: int
    page: int
    page_size: int
    pages: int


# ── Statements Schemas ─────────────────────────────────────────
class GenerateStatementsRequest(BaseModel):
    account_id: Optional[str] = None
    count: int = 35
    days: int = 90
    clear_existing: bool = False
    starting_balance: Optional[Decimal] = None


class StatementSummaryResponse(BaseModel):
    account_id: str
    account_number: str
    from_date: datetime
    to_date: datetime
    opening_balance: Decimal
    closing_balance: Decimal
    total_credits: Decimal
    total_debits: Decimal
    credit_count: int
    debit_count: int
    net_flow: Decimal
    total_transactions: int


class StatementGenerationResponse(BaseModel):
    message: str
    success: bool = True
    account_number: str
    transactions_generated: int
    new_balance: Decimal


# ── Misc ──────────────────────────────────────────────────────
class MessageResponse(BaseModel):
    message: str
    success: bool = True

