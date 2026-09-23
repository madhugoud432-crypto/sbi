from fastapi import APIRouter
from app.api.v1.endpoints import auth, accounts, transactions, transfers, dashboard, admin, captcha, upload, statements

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])
api_router.include_router(accounts.router, prefix="/accounts", tags=["Accounts"])
api_router.include_router(transactions.router, prefix="/transactions", tags=["Transactions"])
api_router.include_router(statements.router, prefix="/statements", tags=["Statements"])
api_router.include_router(transfers.router, prefix="/transfers", tags=["Transfers"])
api_router.include_router(admin.router, prefix="/admin", tags=["Admin"])
api_router.include_router(captcha.router, prefix="/captcha", tags=["Captcha"])
api_router.include_router(upload.router, prefix="/upload", tags=["Upload"])

