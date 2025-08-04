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
    if token_data["role"] not in ["admin", "support", "kyc"]:
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

# Kraken API Endpoints
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
