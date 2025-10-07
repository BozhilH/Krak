from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
import uuid
from datetime import datetime, timedelta
import aiohttp
import asyncio
import jwt
import hashlib
from enum import Enum


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Kraken API Base URL
KRAKEN_API_BASE = "https://api.kraken.com/0/public"

# Global aiohttp client session
http_session = None

async def get_http_session():
    global http_session
    if http_session is None:
        http_session = aiohttp.ClientSession()
    return http_session

# Admin Models and Enums
class UserRole(str, Enum):
    ADMIN = "admin"
    SUPPORT = "support"
    KYC = "kyc"
    ACCOUNTING = "accounting"

class TicketStatus(str, Enum):
    OPEN = "open"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"
    CLOSED = "closed"

class TicketPriority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"

class TransactionStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    REJECTED = "rejected"
    PROCESSING = "processing"

class KYCStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    REQUIRES_REVIEW = "requires_review"

# Admin User Models
class AdminUser(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    email: str
    role: UserRole
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: Optional[datetime] = None

class AdminUserCreate(BaseModel):
    username: str
    email: str
    password: str
    role: UserRole

class AdminLogin(BaseModel):
    username: str
    password: str

class AdminLoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: AdminUser

# Client Management Models
class Client(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    first_name: str
    last_name: str
    phone: Optional[str] = None
    country: Optional[str] = None
    kyc_status: KYCStatus = KYCStatus.PENDING
    is_verified: bool = False
    is_active: bool = True
    total_balance: float = 0.0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_activity: Optional[datetime] = None

class ClientUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    country: Optional[str] = None
    kyc_status: Optional[KYCStatus] = None
    is_verified: Optional[bool] = None
    is_active: Optional[bool] = None

# Support Ticket Models
class SupportTicket(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_id: str
    client_email: str
    subject: str
    category: str
    message: str
    status: TicketStatus = TicketStatus.OPEN
    priority: TicketPriority = TicketPriority.MEDIUM
    assigned_to: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    resolved_at: Optional[datetime] = None

class TicketUpdate(BaseModel):
    status: Optional[TicketStatus] = None
    priority: Optional[TicketPriority] = None
    assigned_to: Optional[str] = None

class TicketResponse(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    ticket_id: str
    admin_user_id: str
    admin_username: str
    message: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Transaction Models
class Transaction(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_id: str
    client_email: str
    type: str  # 'deposit' or 'withdrawal'
    asset: str
    amount: float
    status: TransactionStatus = TransactionStatus.PENDING
    method: Optional[str] = None
    address: Optional[str] = None
    transaction_hash: Optional[str] = None
    fee: float = 0.0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    processed_at: Optional[datetime] = None
    notes: Optional[str] = None

class TransactionUpdate(BaseModel):
    status: Optional[TransactionStatus] = None
    transaction_hash: Optional[str] = None
    notes: Optional[str] = None

# Sum-Sub KYC Models
class SumSubRequestInfo(BaseModel):
    requested_documents: List[str]
    comment: Optional[str] = None

# JWT Configuration
SECRET_KEY = "your-secret-key-here"  # In production, use environment variable
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 480  # 8 hours

security = HTTPBearer()

# Authentication Functions
def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return hash_password(plain_password) == hashed_password

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        role: str = payload.get("role")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return {"username": username, "role": role}
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def verify_admin(token_data: dict = Depends(verify_token)):
    if token_data["role"] not in ["admin", "support", "kyc", "accounting"]:
        raise HTTPException(status_code=403, detail="Access denied")
    return token_data

async def verify_admin_only(token_data: dict = Depends(verify_token)):
    if token_data["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return token_data

# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

class TickerResponse(BaseModel):
    pair: str
    ask_price: float
    ask_volume: float
    bid_price: float
    bid_volume: float
    last_price: float
    volume: float
    volume_weighted_avg_price: float
    number_of_trades: int
    low_24h: float
    high_24h: float
    opening_price: float

class OrderBookEntry(BaseModel):
    price: float
    volume: float
    timestamp: float

class OrderBookResponse(BaseModel):
    pair: str
    asks: List[OrderBookEntry]
    bids: List[OrderBookEntry]

class OHLCEntry(BaseModel):
    timestamp: int
    open: float
    high: float
    low: float
    close: float
    volume: float
    count: int

class OHLCResponse(BaseModel):
    pair: str
    interval: int
    data: List[OHLCEntry]

class TradeEntry(BaseModel):
    price: float
    volume: float
    timestamp: float
    buy_sell: str
    market_limit: str

class TradesResponse(BaseModel):
    pair: str
    trades: List[TradeEntry]
    last: int

# Utility function to make API calls to Kraken
async def make_kraken_request(endpoint: str, params: Dict[str, Any] = None) -> Dict[str, Any]:
    session = await get_http_session()
    url = f"{KRAKEN_API_BASE}/{endpoint}"
    
    try:
        async with session.get(url, params=params) as response:
            if response.status == 200:
                data = await response.json()
                if data.get("error"):
                    raise HTTPException(status_code=400, detail=f"Kraken API Error: {data['error']}")
                return data.get("result", {})
            else:
                raise HTTPException(status_code=response.status, detail=f"Kraken API request failed")
    except aiohttp.ClientError as e:
        raise HTTPException(status_code=500, detail=f"Network error: {str(e)}")

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Kraken Trading API"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Admin Authentication Endpoints
@api_router.post("/admin/login", response_model=AdminLoginResponse)
async def admin_login(login_data: AdminLogin):
    try:
        # In production, get from database
        # For demo, using hardcoded admin users
        admin_users = {
            "admin": {"password": hash_password("admin123"), "role": "admin", "email": "admin@cryptoox.com"},
            "support": {"password": hash_password("support123"), "role": "support", "email": "support@cryptoox.com"},
            "kyc_agent": {"password": hash_password("kyc123"), "role": "kyc", "email": "kyc@cryptoox.com"},
            "accountant": {"password": hash_password("accounting123"), "role": "accounting", "email": "accounting@cryptoox.com"}
        }
        
        user_data = admin_users.get(login_data.username)
        if not user_data or not verify_password(login_data.password, user_data["password"]):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        access_token = create_access_token(data={"sub": login_data.username, "role": user_data["role"]})
        
        admin_user = AdminUser(
            username=login_data.username,
            email=user_data["email"],
            role=user_data["role"],
            last_login=datetime.utcnow()
        )
        
        return AdminLoginResponse(
            access_token=access_token,
            token_type="bearer",
            user=admin_user
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Client Management Endpoints
@api_router.get("/admin/clients", dependencies=[Depends(verify_admin)])
async def get_clients(skip: int = 0, limit: int = 50):
    try:
        # Mock client data - in production, fetch from database
        clients = []
        for i in range(20):
            client = Client(
                email=f"user{i+1}@example.com",
                first_name=f"John{i+1}",
                last_name=f"Doe{i+1}",
                phone=f"+1555{i:03d}{i:04d}",
                country="United States" if i % 3 == 0 else "Canada" if i % 3 == 1 else "United Kingdom",
                kyc_status=KYCStatus.APPROVED if i % 4 == 0 else KYCStatus.PENDING if i % 4 == 1 else KYCStatus.REQUIRES_REVIEW,
                is_verified=i % 4 == 0,
                total_balance=float(1000 + i * 500),
                last_activity=datetime.utcnow() - timedelta(days=i)
            )
            clients.append(client)
        
        return {"clients": clients[skip:skip+limit], "total": len(clients)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/admin/clients/{client_id}", dependencies=[Depends(verify_admin)])
async def get_client(client_id: str):
    try:
        # Mock client data - in production, fetch from database
        client = Client(
            id=client_id,
            email="john.doe@example.com",
            first_name="John",
            last_name="Doe",
            phone="+1555123456",
            country="United States",
            kyc_status=KYCStatus.APPROVED,
            is_verified=True,
            total_balance=15000.50,
            last_activity=datetime.utcnow() - timedelta(hours=2)
        )
        return client
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.put("/admin/clients/{client_id}", dependencies=[Depends(verify_admin)])
async def update_client(client_id: str, update_data: ClientUpdate):
    try:
        # In production, update database
        updated_client = Client(
            id=client_id,
            email="john.doe@example.com",
            first_name=update_data.first_name or "John",
            last_name=update_data.last_name or "Doe",
            phone=update_data.phone or "+1555123456",
            country=update_data.country or "United States",
            kyc_status=update_data.kyc_status or KYCStatus.APPROVED,
            is_verified=update_data.is_verified if update_data.is_verified is not None else True,
            is_active=update_data.is_active if update_data.is_active is not None else True,
            total_balance=15000.50,
            last_activity=datetime.utcnow()
        )
        return updated_client
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Support Ticket Management
@api_router.get("/admin/tickets", dependencies=[Depends(verify_admin)])
async def get_support_tickets(status: Optional[str] = None, skip: int = 0, limit: int = 50):
    try:
        # Mock ticket data
        tickets = []
        statuses = [TicketStatus.OPEN, TicketStatus.IN_PROGRESS, TicketStatus.RESOLVED, TicketStatus.CLOSED]
        priorities = [TicketPriority.LOW, TicketPriority.MEDIUM, TicketPriority.HIGH, TicketPriority.URGENT]
        
        for i in range(25):
            ticket = SupportTicket(
                client_id=f"client_{i+1}",
                client_email=f"user{i+1}@example.com",
                subject=f"Support Request #{i+1}" if i % 4 == 0 else f"Account Issue #{i+1}" if i % 4 == 1 else f"Trading Problem #{i+1}" if i % 4 == 2 else f"KYC Question #{i+1}",
                category="technical" if i % 4 == 0 else "account" if i % 4 == 1 else "trading" if i % 4 == 2 else "kyc",
                message=f"This is a support request message for ticket #{i+1}. The user is experiencing issues and needs assistance.",
                status=statuses[i % 4],
                priority=priorities[i % 4],
                assigned_to="support" if i % 3 == 0 else "kyc_agent" if i % 3 == 1 else None,
                created_at=datetime.utcnow() - timedelta(days=i, hours=i),
                updated_at=datetime.utcnow() - timedelta(hours=i),
                resolved_at=datetime.utcnow() - timedelta(hours=i//2) if statuses[i % 4] == TicketStatus.RESOLVED else None
            )
            tickets.append(ticket)
        
        if status:
            tickets = [t for t in tickets if t.status == status]
        
        return {"tickets": tickets[skip:skip+limit], "total": len(tickets)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.put("/admin/tickets/{ticket_id}", dependencies=[Depends(verify_admin)])
async def update_support_ticket(ticket_id: str, update_data: TicketUpdate, current_user=Depends(verify_admin)):
    try:
        # Mock update - in production, update database
        updated_ticket = SupportTicket(
            id=ticket_id,
            client_id="client_1",
            client_email="user1@example.com",
            subject="Support Request #1",
            category="technical",
            message="This is a support request message.",
            status=update_data.status or TicketStatus.IN_PROGRESS,
            priority=update_data.priority or TicketPriority.MEDIUM,
            assigned_to=update_data.assigned_to or current_user["username"],
            updated_at=datetime.utcnow(),
            resolved_at=datetime.utcnow() if update_data.status == TicketStatus.RESOLVED else None
        )
        return updated_ticket
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Transaction Management
@api_router.get("/admin/transactions", dependencies=[Depends(verify_admin)])
async def get_transactions(transaction_type: Optional[str] = None, status: Optional[str] = None, skip: int = 0, limit: int = 50):
    try:
        # Mock transaction data
        transactions = []
        assets = ["BTC", "ETH", "XRP", "ADA", "DOT"]
        methods = ["bank_transfer", "credit_card", "sepa", "easypay"]
        
        for i in range(30):
            is_deposit = i % 2 == 0
            transaction = Transaction(
                client_id=f"client_{i+1}",
                client_email=f"user{i+1}@example.com",
                type="deposit" if is_deposit else "withdrawal",
                asset=assets[i % len(assets)],
                amount=float(100 + i * 50),
                status=TransactionStatus.CONFIRMED if i % 4 == 0 else TransactionStatus.PENDING if i % 4 == 1 else TransactionStatus.PROCESSING,
                method=methods[i % len(methods)] if is_deposit else None,
                address=f"1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa{i}" if not is_deposit else None,
                transaction_hash=f"0x{i:064d}" if i % 3 == 0 else None,
                fee=float(i * 0.5),
                created_at=datetime.utcnow() - timedelta(days=i, hours=i),
                processed_at=datetime.utcnow() - timedelta(hours=i) if i % 4 == 0 else None,
                notes=f"Transaction #{i+1} notes" if i % 5 == 0 else None
            )
            transactions.append(transaction)
        
        if transaction_type:
            transactions = [t for t in transactions if t.type == transaction_type]
        if status:
            transactions = [t for t in transactions if t.status == status]
        
        return {"transactions": transactions[skip:skip+limit], "total": len(transactions)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.put("/admin/transactions/{transaction_id}", dependencies=[Depends(verify_admin_only)])
async def update_transaction(transaction_id: str, update_data: TransactionUpdate):
    try:
        # Mock update - in production, update database
        updated_transaction = Transaction(
            id=transaction_id,
            client_id="client_1",
            client_email="user1@example.com",
            type="deposit",
            asset="BTC",
            amount=1000.0,
            status=update_data.status or TransactionStatus.CONFIRMED,
            method="bank_transfer",
            transaction_hash=update_data.transaction_hash,
            fee=5.0,
            processed_at=datetime.utcnow() if update_data.status == TransactionStatus.CONFIRMED else None,
            notes=update_data.notes
        )
        return updated_transaction
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Admin Dashboard Stats
@api_router.get("/admin/dashboard/stats", dependencies=[Depends(verify_admin)])
async def get_dashboard_stats():
    try:
        stats = {
            "total_clients": 1245,
            "active_clients": 892,
            "pending_kyc": 123,
            "open_tickets": 45,
            "pending_deposits": 23,
            "pending_withdrawals": 18,
            "total_volume_24h": 2450000.50,
            "total_fees_24h": 12250.75,
            "new_registrations_today": 15,
            "resolved_tickets_today": 12
        }
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Sum-Sub KYC Integration
@api_router.get("/admin/sumsub/dashboard", dependencies=[Depends(verify_admin)])
async def get_sumsub_dashboard():
    """Get Sum-Sub KYC dashboard data"""
    try:
        # Mock Sum-Sub integration data - in production, integrate with actual Sum-Sub API
        dashboard_data = {
            "total_applications": 245,
            "pending_review": 23,
            "approved": 189,
            "rejected": 33,
            "on_hold": 15,
            "avg_processing_time_hours": 4.2,
            "recent_applications": [
                {
                    "applicant_id": "sumsub_app_001",
                    "external_user_id": "user_12345",
                    "name": "John Smith",
                    "email": "john.smith@example.com",
                    "country": "United States",
                    "status": "pending_review",
                    "level": "basic-kyc",
                    "created_at": "2025-08-04T10:30:00Z",
                    "documents": ["passport", "selfie"]
                },
                {
                    "applicant_id": "sumsub_app_002", 
                    "external_user_id": "user_12346",
                    "name": "Maria Garcia",
                    "email": "maria.garcia@example.com",
                    "country": "Spain",
                    "status": "approved",
                    "level": "enhanced-kyc",
                    "created_at": "2025-08-04T09:15:00Z",
                    "documents": ["drivers_license", "utility_bill", "selfie"]
                },
                {
                    "applicant_id": "sumsub_app_003",
                    "external_user_id": "user_12347", 
                    "name": "Chen Wei",
                    "email": "chen.wei@example.com",
                    "country": "Singapore",
                    "status": "on_hold",
                    "level": "basic-kyc",
                    "created_at": "2025-08-04T08:45:00Z",
                    "documents": ["passport"],
                    "notes": "Additional documentation required"
                }
            ],
            "verification_levels": [
                {"name": "basic-kyc", "count": 156, "description": "Basic identity verification"},
                {"name": "enhanced-kyc", "count": 89, "description": "Enhanced due diligence"}
            ],
            "country_distribution": {
                "United States": 67,
                "United Kingdom": 43,
                "Germany": 32,
                "France": 28,
                "Spain": 25,
                "Other": 50
            }
        }
        return dashboard_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/admin/sumsub/applicants", dependencies=[Depends(verify_admin)])
async def get_sumsub_applicants(
    status: Optional[str] = None,
    level: Optional[str] = None,
    skip: int = 0,
    limit: int = 50
):
    """Get Sum-Sub applicants list with filtering"""
    try:
        # Mock applicant data - in production, fetch from Sum-Sub API
        statuses = ["pending_review", "approved", "rejected", "on_hold", "in_progress"]
        levels = ["basic-kyc", "enhanced-kyc", "corporate-kyc"]
        countries = ["United States", "United Kingdom", "Germany", "France", "Spain", "Canada", "Australia"]
        
        applicants = []
        for i in range(25):
            applicant = {
                "applicant_id": f"sumsub_app_{i+1:03d}",
                "external_user_id": f"user_{12345 + i}",
                "first_name": f"User{i+1}",
                "last_name": f"Test{i+1}",
                "email": f"user{i+1}@example.com",
                "country": countries[i % len(countries)],
                "status": statuses[i % len(statuses)],
                "level": levels[i % len(levels)],
                "created_at": f"2025-08-{(i % 30) + 1:02d}T{(i % 24):02d}:00:00Z",
                "updated_at": f"2025-08-{(i % 30) + 1:02d}T{(i % 24):02d}:30:00Z",
                "documents_count": (i % 4) + 1,
                "risk_score": round(0.1 + (i % 10) * 0.09, 2),
                "review_result": {
                    "review_answer": "GREEN" if i % 3 == 0 else "YELLOW" if i % 3 == 1 else "RED",
                    "reject_labels": ["DOCUMENT_QUALITY"] if i % 5 == 0 else [],
                    "review_reject_type": None
                }
            }
            
            # Apply filters
            if status and applicant["status"] != status:
                continue
            if level and applicant["level"] != level:
                continue
                
            applicants.append(applicant)
        
        # Pagination
        total = len(applicants)
        applicants = applicants[skip:skip+limit]
        
        return {
            "applicants": applicants,
            "total": total,
            "skip": skip,
            "limit": limit
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/admin/sumsub/applicants/{applicant_id}", dependencies=[Depends(verify_admin)])
async def get_sumsub_applicant_detail(applicant_id: str):
    """Get detailed Sum-Sub applicant information"""
    try:
        # Mock detailed applicant data
        applicant_detail = {
            "applicant_id": applicant_id,
            "external_user_id": "user_12345",
            "info": {
                "first_name": "John",
                "last_name": "Smith", 
                "middle_name": "Michael",
                "email": "john.smith@example.com",
                "phone": "+1-555-123-4567",
                "date_of_birth": "1990-01-15",
                "country": "United States",
                "nationality": "US",
                "place_of_birth": "New York",
                "addresses": [
                    {
                        "type": "current",
                        "street": "123 Main Street",
                        "city": "New York",
                        "state": "NY",
                        "postal_code": "10001",
                        "country": "US"
                    }
                ]
            },
            "status": "pending_review",
            "level": "basic-kyc",
            "created_at": "2025-08-04T10:30:00Z",
            "updated_at": "2025-08-04T11:15:00Z",
            "review": {
                "review_id": "review_001",
                "review_status": "pending",
                "review_answer": None,
                "review_reject_type": None,
                "reject_labels": [],
                "client_comment": "Standard KYC verification",
                "moderator_comment": None,
                "review_date": None
            },
            "documents": [
                {
                    "document_id": "doc_001",
                    "document_type": "PASSPORT",
                    "country": "US",
                    "status": "approved",
                    "image_ids": ["img_001", "img_002"],
                    "uploaded_at": "2025-08-04T10:31:00Z"
                },
                {
                    "document_id": "doc_002",
                    "document_type": "SELFIE",
                    "country": "US", 
                    "status": "approved",
                    "image_ids": ["img_003"],
                    "uploaded_at": "2025-08-04T10:32:00Z"
                }
            ],
            "verification_steps": [
                {
                    "step": "document_upload",
                    "status": "completed",
                    "completed_at": "2025-08-04T10:32:00Z"
                },
                {
                    "step": "face_matching",
                    "status": "completed", 
                    "completed_at": "2025-08-04T10:33:00Z"
                },
                {
                    "step": "manual_review",
                    "status": "in_progress",
                    "completed_at": None
                }
            ],
            "risk_assessment": {
                "overall_score": 0.25,
                "factors": [
                    {"factor": "document_quality", "score": 0.95, "status": "pass"},
                    {"factor": "face_match", "score": 0.89, "status": "pass"},
                    {"factor": "aml_screening", "score": 0.10, "status": "pass"},
                    {"factor": "pep_screening", "score": 0.05, "status": "pass"}
                ]
            },
            "aml_results": {
                "sanctions_match": False,
                "pep_match": False,
                "adverse_media": False,
                "screening_date": "2025-08-04T10:34:00Z"
            }
        }
        
        return applicant_detail
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/admin/sumsub/applicants/{applicant_id}/approve", dependencies=[Depends(verify_admin_only)])
async def approve_sumsub_applicant(applicant_id: str):
    """Approve a Sum-Sub applicant"""
    try:
        # In production, this would call Sum-Sub API to approve the applicant
        result = {
            "applicant_id": applicant_id,
            "status": "approved",
            "approved_at": datetime.utcnow().isoformat(),
            "approved_by": "admin",  # Would be extracted from JWT token
            "message": "Applicant approved successfully"
        }
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/admin/sumsub/applicants/{applicant_id}/reject", dependencies=[Depends(verify_admin_only)])
async def reject_sumsub_applicant(
    applicant_id: str,
    rejection_reason: str,
    rejection_comment: Optional[str] = None
):
    """Reject a Sum-Sub applicant"""
    try:
        # In production, this would call Sum-Sub API to reject the applicant
        result = {
            "applicant_id": applicant_id,
            "status": "rejected",
            "rejected_at": datetime.utcnow().isoformat(),
            "rejected_by": "admin",  # Would be extracted from JWT token
            "rejection_reason": rejection_reason,
            "rejection_comment": rejection_comment,
            "message": "Applicant rejected successfully"
        }
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/admin/sumsub/applicants/{applicant_id}/request-info", dependencies=[Depends(verify_admin)])
async def request_additional_info(
    applicant_id: str,
    request_data: SumSubRequestInfo
):
    """Request additional information from applicant"""
    try:
        # In production, this would call Sum-Sub API to request additional info
        result = {
            "applicant_id": applicant_id,
            "status": "on_hold",
            "requested_documents": request_data.requested_documents,
            "comment": request_data.comment,
            "requested_at": datetime.utcnow().isoformat(),
            "requested_by": "admin",  # Would be extracted from JWT token
            "message": "Additional information requested successfully"
        }
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/admin/sumsub/webhook-logs", dependencies=[Depends(verify_admin)])
async def get_sumsub_webhook_logs(skip: int = 0, limit: int = 50):
    """Get Sum-Sub webhook logs"""
    try:
        # Mock webhook logs data
        webhook_logs = []
        event_types = ["applicantCreated", "applicantPending", "applicantReviewed", "applicantOnHold"]
        
        for i in range(20):
            log = {
                "id": f"webhook_log_{i+1:03d}",
                "event_type": event_types[i % len(event_types)],
                "applicant_id": f"sumsub_app_{i+1:03d}",
                "external_user_id": f"user_{12345 + i}",
                "status": "processed" if i % 4 != 0 else "failed",
                "received_at": f"2025-08-04T{10 + (i % 12):02d}:00:00Z",
                "processed_at": f"2025-08-04T{10 + (i % 12):02d}:00:05Z" if i % 4 != 0 else None,
                "error_message": "Invalid signature" if i % 4 == 0 else None,
                "payload_size": 1024 + (i * 50),
                "retry_count": 0 if i % 4 != 0 else 2
            }
            webhook_logs.append(log)
        
        # Pagination
        total = len(webhook_logs)
        webhook_logs = webhook_logs[skip:skip+limit]
        
        return {
            "logs": webhook_logs,
            "total": total,
            "skip": skip,
            "limit": limit
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Asset Pairs
@api_router.get("/ticker/{pair}")
async def get_ticker(pair: str):
    """Get ticker information for a specific trading pair"""
    try:
        data = await make_kraken_request("Ticker", {"pair": pair})
        
        # Kraken returns data with pair keys that might be different from input
        pair_key = list(data.keys())[0] if data else None
        if not pair_key:
            raise HTTPException(status_code=404, detail="Trading pair not found")
        
        pair_data = data[pair_key]
        
        return {
            "pair": pair,
            "ask_price": float(pair_data["a"][0]),
            "ask_volume": float(pair_data["a"][1]),
            "bid_price": float(pair_data["b"][0]),
            "bid_volume": float(pair_data["b"][1]),
            "last_price": float(pair_data["c"][0]),
            "last_volume": float(pair_data["c"][1]),
            "volume": float(pair_data["v"][1]),
            "volume_weighted_avg_price": float(pair_data["p"][1]),
            "number_of_trades": int(pair_data["t"][1]),
            "low_24h": float(pair_data["l"][1]),
            "high_24h": float(pair_data["h"][1]),
            "opening_price": float(pair_data["o"])
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/ticker")
async def get_multiple_tickers(pairs: str):
    """Get ticker information for multiple trading pairs (comma-separated)"""
    try:
        data = await make_kraken_request("Ticker", {"pair": pairs})
        
        result = {}
        for pair_key, pair_data in data.items():
            # Clean up the pair name for consistent response
            clean_pair = pair_key
            result[clean_pair] = {
                "ask_price": float(pair_data["a"][0]),
                "ask_volume": float(pair_data["a"][1]),
                "bid_price": float(pair_data["b"][0]),
                "bid_volume": float(pair_data["b"][1]),
                "last_price": float(pair_data["c"][0]),
                "last_volume": float(pair_data["c"][1]),
                "volume": float(pair_data["v"][1]),
                "volume_weighted_avg_price": float(pair_data["p"][1]),
                "number_of_trades": int(pair_data["t"][1]),
                "low_24h": float(pair_data["l"][1]),
                "high_24h": float(pair_data["h"][1]),
                "opening_price": float(pair_data["o"])
            }
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/orderbook/{pair}")
async def get_orderbook(pair: str, count: int = 100):
    """Get order book for a specific trading pair"""
    try:
        data = await make_kraken_request("Depth", {"pair": pair, "count": count})
        
        pair_key = list(data.keys())[0] if data else None
        if not pair_key:
            raise HTTPException(status_code=404, detail="Trading pair not found")
        
        pair_data = data[pair_key]
        
        asks = []
        for ask in pair_data["asks"]:
            asks.append({
                "price": float(ask[0]),
                "volume": float(ask[1]),
                "timestamp": float(ask[2])
            })
        
        bids = []
        for bid in pair_data["bids"]:
            bids.append({
                "price": float(bid[0]),
                "volume": float(bid[1]),
                "timestamp": float(bid[2])
            })
        
        return {
            "pair": pair,
            "asks": asks,
            "bids": bids
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/ohlc/{pair}")
async def get_ohlc(pair: str, interval: int = 1, since: Optional[int] = None):
    """Get OHLC data for a specific trading pair"""
    try:
        params = {"pair": pair, "interval": interval}
        if since:
            params["since"] = since
            
        data = await make_kraken_request("OHLC", params)
        
        pair_key = list(data.keys())[0] if data else None
        if not pair_key:
            raise HTTPException(status_code=404, detail="Trading pair not found")
        
        ohlc_data = data[pair_key]
        
        entries = []
        for entry in ohlc_data:
            entries.append({
                "timestamp": int(entry[0]),
                "open": float(entry[1]),
                "high": float(entry[2]),
                "low": float(entry[3]),
                "close": float(entry[4]),
                "vwap": float(entry[5]),
                "volume": float(entry[6]),
                "count": int(entry[7])
            })
        
        return {
            "pair": pair,
            "interval": interval,
            "data": entries,
            "last": data.get("last", 0)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/trades/{pair}")
async def get_recent_trades(pair: str, since: Optional[int] = None):
    """Get recent trades for a specific trading pair"""
    try:
        params = {"pair": pair}
        if since:
            params["since"] = since
            
        data = await make_kraken_request("Trades", params)
        
        pair_key = list(data.keys())[0] if data else None
        if not pair_key:
            raise HTTPException(status_code=404, detail="Trading pair not found")
        
        trades_data = data[pair_key]
        
        trades = []
        for trade in trades_data:
            trades.append({
                "price": float(trade[0]),
                "volume": float(trade[1]),
                "timestamp": float(trade[2]),
                "buy_sell": trade[3],  # 'b' = buy, 's' = sell
                "market_limit": trade[4],  # 'm' = market, 'l' = limit
                "misc": trade[5] if len(trade) > 5 else ""
            })
        
        return {
            "pair": pair,
            "trades": trades,
            "last": data.get("last", 0)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/assets")
async def get_assets():
    """Get list of all available assets"""
    try:
        data = await make_kraken_request("Assets")
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/asset-pairs")
async def get_asset_pairs():
    """Get list of all available asset pairs"""
    try:
        data = await make_kraken_request("AssetPairs")
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Convenience endpoint to get all market data for dashboard
@api_router.get("/market-summary")
async def get_market_summary():
    """Get market summary for main cryptocurrency pairs"""
    try:
        # Get ticker data for major pairs
        major_pairs = "BTCUSD,ETHUSD,XRPUSD,ADAUSD,DOTUSD,LINKUSD"
        ticker_data = await get_multiple_tickers(major_pairs)
        
        # Format the response for easy consumption by frontend
        market_data = {}
        pair_mapping = {
            "XBTUSD": "BTCUSD",
            "XETHZUSD": "ETHUSD", 
            "XXRPZUSD": "XRPUSD",
            "ADAUSD": "ADAUSD",
            "DOTUSD": "DOTUSD",
            "LINKUSD": "LINKUSD"
        }
        
        for kraken_pair, clean_pair in pair_mapping.items():
            if kraken_pair in ticker_data:
                data = ticker_data[kraken_pair]
                # Format to match existing frontend expectations
                market_data[clean_pair] = {
                    "c": [str(data["last_price"]), str(data["last_volume"])],
                    "h": [str(data["high_24h"]), str(data["high_24h"])],
                    "l": [str(data["low_24h"]), str(data["low_24h"])],
                    "o": str(data["opening_price"]),
                    "p": [str(data["volume_weighted_avg_price"]), str(data["volume_weighted_avg_price"])],
                    "t": [data["number_of_trades"], data["number_of_trades"]],
                    "v": [str(data["volume"]), str(data["volume"])]
                }
        
        return market_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============================================
# Portfolio Analytics API Endpoints
# ============================================

class PortfolioHolding(BaseModel):
    asset: str
    symbol: str
    amount: float
    value_usd: float
    percentage: float
    avg_buy_price: float
    current_price: float
    profit_loss: float
    profit_loss_percentage: float

class PortfolioPnLResponse(BaseModel):
    total_balance: float
    realized_pnl: float
    unrealized_pnl: float
    total_pnl: float
    pnl_percentage: float
    historical_balance: List[Dict[str, Any]]
    realized_pnl_history: List[Dict[str, Any]]
    unrealized_pnl_history: List[Dict[str, Any]]
    staking_rewards: float
    staking_apr: float

class TradeSummaryResponse(BaseModel):
    total_trades: int
    buy_trades: int
    sell_trades: int
    total_volume_usd: float
    volume_by_asset: List[Dict[str, Any]]
    trades_by_date: List[Dict[str, Any]]
    avg_trade_size: float
    largest_trade: float
    trading_fees_paid: float

@api_router.get("/v1/portfolio/holdings")
async def get_portfolio_holdings(userId: str):
    """Get user's portfolio holdings with asset allocation"""
    try:
        # Mock portfolio data - in production, fetch from MongoDB user portfolio collection
        current_prices = {
            "BTC": 114675.0,
            "ETH": 3553.33,
            "XRP": 3.012,
            "ADA": 0.742,
            "DOT": 3.633,
            "LINK": 16.643
        }
        
        # Mock user holdings
        holdings_data = [
            {"asset": "Bitcoin", "symbol": "BTC", "amount": 0.5234, "avg_buy_price": 95000.0},
            {"asset": "Ethereum", "symbol": "ETH", "amount": 2.3456, "avg_buy_price": 2800.0},
            {"asset": "Ripple", "symbol": "XRP", "amount": 1000.0, "avg_buy_price": 0.65},
            {"asset": "Cardano", "symbol": "ADA", "amount": 500.0, "avg_buy_price": 0.65},
            {"asset": "Polkadot", "symbol": "DOT", "amount": 100.0, "avg_buy_price": 4.5},
            {"asset": "Chainlink", "symbol": "LINK", "amount": 50.0, "avg_buy_price": 14.0}
        ]
        
        total_value = 0.0
        holdings = []
        
        for holding in holdings_data:
            symbol = holding["symbol"]
            current_price = current_prices.get(symbol, 0.0)
            value_usd = holding["amount"] * current_price
            total_value += value_usd
            
            profit_loss = (current_price - holding["avg_buy_price"]) * holding["amount"]
            profit_loss_percentage = ((current_price - holding["avg_buy_price"]) / holding["avg_buy_price"]) * 100
            
            holdings.append({
                "asset": holding["asset"],
                "symbol": symbol,
                "amount": holding["amount"],
                "value_usd": value_usd,
                "percentage": 0.0,  # Will be calculated after
                "avg_buy_price": holding["avg_buy_price"],
                "current_price": current_price,
                "profit_loss": profit_loss,
                "profit_loss_percentage": profit_loss_percentage
            })
        
        # Calculate percentages
        for holding in holdings:
            holding["percentage"] = (holding["value_usd"] / total_value) * 100 if total_value > 0 else 0.0
        
        return {
            "userId": userId,
            "total_value": total_value,
            "holdings": holdings,
            "last_updated": datetime.utcnow().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/v1/portfolio/pnl")
async def get_portfolio_pnl(userId: str, range: str = "24h"):
    """Get user's profit & loss data with historical trends"""
    try:
        # Calculate date range
        time_range = range  # Avoid using 'range' directly as it shadows builtin
        now = datetime.utcnow()
        if time_range == "24h":
            start_date = now - timedelta(hours=24)
            data_points = 24
            interval_hours = 1
        elif time_range == "7d":
            start_date = now - timedelta(days=7)
            data_points = 7
            interval_hours = 24
        elif time_range == "30d":
            start_date = now - timedelta(days=30)
            data_points = 30
            interval_hours = 24
        elif time_range == "YTD":
            start_date = datetime(now.year, 1, 1)
            data_points = (now - start_date).days + 1
            interval_hours = 24
        else:
            raise HTTPException(status_code=400, detail="Invalid range. Use: 24h, 7d, 30d, YTD")
        
        # Mock P&L data
        base_balance = 125430.50
        realized_pnl = 8765.43
        unrealized_pnl = 3456.78
        total_pnl = realized_pnl + unrealized_pnl
        pnl_percentage = (total_pnl / (base_balance - total_pnl)) * 100
        
        # Generate historical balance data
        historical_balance = []
        realized_pnl_history = []
        unrealized_pnl_history = []
        
        for i in range(data_points):
            timestamp = start_date + timedelta(hours=i * interval_hours)
            
            # Simulate balance growth with some volatility
            balance_variation = base_balance * (1 + (i / data_points) * 0.05 + (i % 3 - 1) * 0.01)
            realized_variation = realized_pnl * (i / data_points) * (1 + (i % 5 - 2) * 0.05)
            unrealized_variation = unrealized_pnl * (1 + (i % 7 - 3) * 0.1)
            
            historical_balance.append({
                "timestamp": timestamp.isoformat(),
                "balance": round(balance_variation, 2)
            })
            
            realized_pnl_history.append({
                "timestamp": timestamp.isoformat(),
                "value": round(realized_variation, 2)
            })
            
            unrealized_pnl_history.append({
                "timestamp": timestamp.isoformat(),
                "value": round(unrealized_variation, 2)
            })
        
        return {
            "userId": userId,
            "range": time_range,
            "total_balance": base_balance,
            "realized_pnl": realized_pnl,
            "unrealized_pnl": unrealized_pnl,
            "total_pnl": total_pnl,
            "pnl_percentage": pnl_percentage,
            "historical_balance": historical_balance,
            "realized_pnl_history": realized_pnl_history,
            "unrealized_pnl_history": unrealized_pnl_history,
            "staking_rewards": 1234.56,
            "staking_apr": 5.75,
            "last_updated": datetime.utcnow().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/v1/trades/summary")
async def get_trades_summary(userId: str, range: str = "24h"):
    """Get user's trading summary with volume breakdown"""
    try:
        # Calculate date range
        time_range = range  # Avoid using 'range' directly as it shadows builtin
        now = datetime.utcnow()
        if time_range == "24h":
            start_date = now - timedelta(hours=24)
            data_points = 24
        elif time_range == "7d":
            start_date = now - timedelta(days=7)
            data_points = 7
        elif time_range == "30d":
            start_date = now - timedelta(days=30)
            data_points = 30
        elif time_range == "YTD":
            start_date = datetime(now.year, 1, 1)
            data_points = (now - start_date).days + 1
        else:
            raise HTTPException(status_code=400, detail="Invalid range. Use: 24h, 7d, 30d, YTD")
        
        # Mock trade data
        assets = ["BTC", "ETH", "XRP", "ADA", "DOT", "LINK"]
        total_trades = 156
        buy_trades = 89
        sell_trades = 67
        total_volume_usd = 245678.90
        trading_fees_paid = 1234.56
        
        # Volume by asset
        volume_by_asset = []
        for i, asset in enumerate(assets):
            volume = total_volume_usd * (0.4 if i == 0 else 0.25 if i == 1 else 0.1 / (len(assets) - 2))
            volume_by_asset.append({
                "asset": asset,
                "volume_usd": round(volume, 2),
                "trades_count": int(total_trades * (0.4 if i == 0 else 0.25 if i == 1 else 0.1 / (len(assets) - 2))),
                "percentage": round((volume / total_volume_usd) * 100, 2)
            })
        
        # Trades by date
        trades_by_date = []
        for i in range(data_points):
            timestamp = start_date + timedelta(days=i if time_range != "24h" else 0, hours=i if time_range == "24h" else 0)
            volume = (total_volume_usd / data_points) * (1 + (i % 3 - 1) * 0.2)
            trades_count = int((total_trades / data_points) * (1 + (i % 5 - 2) * 0.3))
            
            trades_by_date.append({
                "timestamp": timestamp.isoformat(),
                "date": timestamp.strftime("%Y-%m-%d" if time_range != "24h" else "%Y-%m-%d %H:%M"),
                "volume_usd": round(volume, 2),
                "trades_count": max(1, trades_count),
                "buy_count": int(trades_count * 0.57),
                "sell_count": int(trades_count * 0.43)
            })
        
        return {
            "userId": userId,
            "range": time_range,
            "total_trades": total_trades,
            "buy_trades": buy_trades,
            "sell_trades": sell_trades,
            "total_volume_usd": total_volume_usd,
            "volume_by_asset": volume_by_asset,
            "trades_by_date": trades_by_date,
            "avg_trade_size": round(total_volume_usd / total_trades, 2),
            "largest_trade": 15678.90,
            "trading_fees_paid": trading_fees_paid,
            "last_updated": datetime.utcnow().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    global http_session
    http_session = aiohttp.ClientSession()
    logger.info("HTTP session initialized")

@app.on_event("shutdown")
async def shutdown_event():
    global http_session
    if http_session:
        await http_session.close()
    client.close()
    logger.info("Application shutdown complete")
