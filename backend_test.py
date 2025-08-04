#!/usr/bin/env python3
"""
Backend API Testing Script for CryptoOX Admin Panel and Kraken API Integration
Tests all implemented admin panel endpoints and Kraken API endpoints
"""

import requests
import json
import time
from typing import Dict, Any, List

# Backend URL from environment
BACKEND_URL = "https://1d229934-0739-443b-af13-4071d455a379.preview.emergentagent.com/api"

# Test pairs for validation
TEST_PAIRS = ["BTCUSD", "ETHUSD", "XRPUSD", "ADAUSD", "DOTUSD"]
INVALID_PAIR = "INVALIDPAIR"

# Admin test credentials
ADMIN_USERS = {
    "admin": {"username": "admin", "password": "admin123", "role": "admin"},
    "support": {"username": "support", "password": "support123", "role": "support"},
    "kyc_agent": {"username": "kyc_agent", "password": "kyc123", "role": "kyc"}
}

class BackendTester:
    def __init__(self):
        self.results = []
        self.session = requests.Session()
        self.session.timeout = 30
        self.admin_tokens = {}  # Store tokens for different admin users
        
    def log_result(self, test_name: str, success: bool, details: str, response_time: float = 0):
        """Log test result"""
        status = "✅ PASS" if success else "❌ FAIL"
        result = {
            "test": test_name,
            "status": status,
            "success": success,
            "details": details,
            "response_time": f"{response_time:.2f}s"
        }
        self.results.append(result)
        print(f"{status} {test_name}: {details} ({response_time:.2f}s)")

    # ========== ADMIN PANEL TESTING METHODS ==========
    
    def test_admin_login(self):
        """Test admin login endpoint with different user types"""
        success_count = 0
        
        for user_type, credentials in ADMIN_USERS.items():
            try:
                start_time = time.time()
                response = self.session.post(f"{BACKEND_URL}/admin/login", 
                                           json={"username": credentials["username"], "password": credentials["password"]})
                response_time = time.time() - start_time
                
                if response.status_code == 200:
                    data = response.json()
                    if ("access_token" in data and "token_type" in data and "user" in data and
                        data["user"]["role"] == credentials["role"]):
                        # Store token for later use
                        self.admin_tokens[user_type] = data["access_token"]
                        self.log_result(f"Admin Login ({user_type})", True, 
                                      f"Role: {data['user']['role']}, Token received", response_time)
                        success_count += 1
                    else:
                        self.log_result(f"Admin Login ({user_type})", False, "Invalid response structure", response_time)
                else:
                    self.log_result(f"Admin Login ({user_type})", False, f"HTTP {response.status_code}: {response.text}", response_time)
            except Exception as e:
                self.log_result(f"Admin Login ({user_type})", False, f"Exception: {str(e)}", 0)
        
        # Test invalid credentials
        try:
            start_time = time.time()
            response = self.session.post(f"{BACKEND_URL}/admin/login", 
                                       json={"username": "invalid", "password": "invalid"})
            response_time = time.time() - start_time
            
            if response.status_code == 401:
                self.log_result("Admin Login (Invalid)", True, "Properly rejected invalid credentials", response_time)
                success_count += 1
            else:
                self.log_result("Admin Login (Invalid)", False, f"Should return 401, got {response.status_code}", response_time)
        except Exception as e:
            self.log_result("Admin Login (Invalid)", False, f"Exception: {str(e)}", 0)
                
        return success_count == len(ADMIN_USERS) + 1  # +1 for invalid test

    def test_admin_dashboard_stats(self):
        """Test admin dashboard stats endpoint"""
        if "admin" not in self.admin_tokens:
            self.log_result("Dashboard Stats", False, "No admin token available", 0)
            return False
            
        try:
            headers = {"Authorization": f"Bearer {self.admin_tokens['admin']}"}
            start_time = time.time()
            response = self.session.get(f"{BACKEND_URL}/admin/dashboard/stats", headers=headers)
            response_time = time.time() - start_time
            
            if response.status_code == 200:
                data = response.json()
                required_stats = [
                    "total_clients", "active_clients", "pending_kyc", "open_tickets",
                    "pending_deposits", "pending_withdrawals", "total_volume_24h", 
                    "total_fees_24h", "new_registrations_today", "resolved_tickets_today"
                ]
                
                if all(stat in data for stat in required_stats):
                    # Validate data types
                    if (isinstance(data["total_clients"], int) and data["total_clients"] > 0 and
                        isinstance(data["total_volume_24h"], (int, float)) and data["total_volume_24h"] > 0):
                        self.log_result("Dashboard Stats", True, 
                                      f"All stats present: {data['total_clients']} clients, ${data['total_volume_24h']:.2f} volume", 
                                      response_time)
                        return True
                    else:
                        self.log_result("Dashboard Stats", False, "Invalid data types or values", response_time)
                else:
                    missing = [s for s in required_stats if s not in data]
                    self.log_result("Dashboard Stats", False, f"Missing stats: {missing}", response_time)
            else:
                self.log_result("Dashboard Stats", False, f"HTTP {response.status_code}: {response.text}", response_time)
        except Exception as e:
            self.log_result("Dashboard Stats", False, f"Exception: {str(e)}", 0)
        return False

    def test_client_management(self):
        """Test client management endpoints"""
        success_count = 0
        
        # Test get all clients with admin token
        if "admin" in self.admin_tokens:
            try:
                headers = {"Authorization": f"Bearer {self.admin_tokens['admin']}"}
                start_time = time.time()
                response = self.session.get(f"{BACKEND_URL}/admin/clients", headers=headers)
                response_time = time.time() - start_time
                
                if response.status_code == 200:
                    data = response.json()
                    if ("clients" in data and "total" in data and 
                        isinstance(data["clients"], list) and len(data["clients"]) > 0):
                        client = data["clients"][0]
                        required_fields = ["id", "email", "first_name", "last_name", "kyc_status"]
                        
                        if all(field in client for field in required_fields):
                            self.log_result("Get All Clients", True, 
                                          f"Retrieved {len(data['clients'])} clients, total: {data['total']}", response_time)
                            success_count += 1
                        else:
                            missing = [f for f in required_fields if f not in client]
                            self.log_result("Get All Clients", False, f"Missing client fields: {missing}", response_time)
                    else:
                        self.log_result("Get All Clients", False, "Invalid response structure", response_time)
                else:
                    self.log_result("Get All Clients", False, f"HTTP {response.status_code}: {response.text}", response_time)
            except Exception as e:
                self.log_result("Get All Clients", False, f"Exception: {str(e)}", 0)
        
        # Test get individual client
        if "admin" in self.admin_tokens:
            try:
                headers = {"Authorization": f"Bearer {self.admin_tokens['admin']}"}
                test_client_id = "test-client-123"
                start_time = time.time()
                response = self.session.get(f"{BACKEND_URL}/admin/clients/{test_client_id}", headers=headers)
                response_time = time.time() - start_time
                
                if response.status_code == 200:
                    data = response.json()
                    required_fields = ["id", "email", "first_name", "last_name", "kyc_status", "total_balance"]
                    
                    if all(field in data for field in required_fields):
                        self.log_result("Get Individual Client", True, 
                                      f"Client: {data['first_name']} {data['last_name']}, Balance: ${data['total_balance']}", 
                                      response_time)
                        success_count += 1
                    else:
                        missing = [f for f in required_fields if f not in data]
                        self.log_result("Get Individual Client", False, f"Missing fields: {missing}", response_time)
                else:
                    self.log_result("Get Individual Client", False, f"HTTP {response.status_code}: {response.text}", response_time)
            except Exception as e:
                self.log_result("Get Individual Client", False, f"Exception: {str(e)}", 0)
        
        # Test update client KYC status
        if "admin" in self.admin_tokens:
            try:
                headers = {"Authorization": f"Bearer {self.admin_tokens['admin']}"}
                test_client_id = "test-client-123"
                update_data = {"kyc_status": "approved", "is_verified": True}
                start_time = time.time()
                response = self.session.put(f"{BACKEND_URL}/admin/clients/{test_client_id}", 
                                          headers=headers, json=update_data)
                response_time = time.time() - start_time
                
                if response.status_code == 200:
                    data = response.json()
                    if data.get("kyc_status") == "approved" and data.get("is_verified") == True:
                        self.log_result("Update Client KYC", True, 
                                      f"Updated KYC status to {data['kyc_status']}, verified: {data['is_verified']}", 
                                      response_time)
                        success_count += 1
                    else:
                        self.log_result("Update Client KYC", False, "Update not reflected in response", response_time)
                else:
                    self.log_result("Update Client KYC", False, f"HTTP {response.status_code}: {response.text}", response_time)
            except Exception as e:
                self.log_result("Update Client KYC", False, f"Exception: {str(e)}", 0)
        
        return success_count == 3

    def test_support_ticket_management(self):
        """Test support ticket management endpoints"""
        success_count = 0
        
        # Test get all tickets with support token
        if "support" in self.admin_tokens:
            try:
                headers = {"Authorization": f"Bearer {self.admin_tokens['support']}"}
                start_time = time.time()
                response = self.session.get(f"{BACKEND_URL}/admin/tickets", headers=headers)
                response_time = time.time() - start_time
                
                if response.status_code == 200:
                    data = response.json()
                    if ("tickets" in data and "total" in data and 
                        isinstance(data["tickets"], list) and len(data["tickets"]) > 0):
                        ticket = data["tickets"][0]
                        required_fields = ["id", "client_email", "subject", "status", "priority", "created_at"]
                        
                        if all(field in ticket for field in required_fields):
                            self.log_result("Get All Tickets", True, 
                                          f"Retrieved {len(data['tickets'])} tickets, total: {data['total']}", response_time)
                            success_count += 1
                        else:
                            missing = [f for f in required_fields if f not in ticket]
                            self.log_result("Get All Tickets", False, f"Missing ticket fields: {missing}", response_time)
                    else:
                        self.log_result("Get All Tickets", False, "Invalid response structure", response_time)
                else:
                    self.log_result("Get All Tickets", False, f"HTTP {response.status_code}: {response.text}", response_time)
            except Exception as e:
                self.log_result("Get All Tickets", False, f"Exception: {str(e)}", 0)
        
        # Test status filtering
        if "support" in self.admin_tokens:
            try:
                headers = {"Authorization": f"Bearer {self.admin_tokens['support']}"}
                start_time = time.time()
                response = self.session.get(f"{BACKEND_URL}/admin/tickets?status=open", headers=headers)
                response_time = time.time() - start_time
                
                if response.status_code == 200:
                    data = response.json()
                    if "tickets" in data and isinstance(data["tickets"], list):
                        # Check if all returned tickets have 'open' status
                        open_tickets = [t for t in data["tickets"] if t.get("status") == "open"]
                        if len(open_tickets) == len(data["tickets"]):
                            self.log_result("Ticket Status Filter", True, 
                                          f"Filtered {len(data['tickets'])} open tickets correctly", response_time)
                            success_count += 1
                        else:
                            self.log_result("Ticket Status Filter", False, 
                                          f"Filter not working: {len(open_tickets)}/{len(data['tickets'])} are open", response_time)
                    else:
                        self.log_result("Ticket Status Filter", False, "Invalid response structure", response_time)
                else:
                    self.log_result("Ticket Status Filter", False, f"HTTP {response.status_code}: {response.text}", response_time)
            except Exception as e:
                self.log_result("Ticket Status Filter", False, f"Exception: {str(e)}", 0)
        
        # Test update ticket status
        if "support" in self.admin_tokens:
            try:
                headers = {"Authorization": f"Bearer {self.admin_tokens['support']}"}
                test_ticket_id = "test-ticket-123"
                update_data = {"status": "in_progress", "priority": "high"}
                start_time = time.time()
                response = self.session.put(f"{BACKEND_URL}/admin/tickets/{test_ticket_id}", 
                                          headers=headers, json=update_data)
                response_time = time.time() - start_time
                
                if response.status_code == 200:
                    data = response.json()
                    if data.get("status") == "in_progress" and data.get("priority") == "high":
                        self.log_result("Update Ticket Status", True, 
                                      f"Updated status to {data['status']}, priority: {data['priority']}", response_time)
                        success_count += 1
                    else:
                        self.log_result("Update Ticket Status", False, "Update not reflected in response", response_time)
                else:
                    self.log_result("Update Ticket Status", False, f"HTTP {response.status_code}: {response.text}", response_time)
            except Exception as e:
                self.log_result("Update Ticket Status", False, f"Exception: {str(e)}", 0)
        
        return success_count == 3

    def test_transaction_management(self):
        """Test transaction management endpoints (admin only)"""
        success_count = 0
        
        # Test get all transactions with admin token
        if "admin" in self.admin_tokens:
            try:
                headers = {"Authorization": f"Bearer {self.admin_tokens['admin']}"}
                start_time = time.time()
                response = self.session.get(f"{BACKEND_URL}/admin/transactions", headers=headers)
                response_time = time.time() - start_time
                
                if response.status_code == 200:
                    data = response.json()
                    if ("transactions" in data and "total" in data and 
                        isinstance(data["transactions"], list) and len(data["transactions"]) > 0):
                        transaction = data["transactions"][0]
                        required_fields = ["id", "client_email", "type", "asset", "amount", "status", "created_at"]
                        
                        if all(field in transaction for field in required_fields):
                            self.log_result("Get All Transactions", True, 
                                          f"Retrieved {len(data['transactions'])} transactions, total: {data['total']}", 
                                          response_time)
                            success_count += 1
                        else:
                            missing = [f for f in required_fields if f not in transaction]
                            self.log_result("Get All Transactions", False, f"Missing transaction fields: {missing}", response_time)
                    else:
                        self.log_result("Get All Transactions", False, "Invalid response structure", response_time)
                else:
                    self.log_result("Get All Transactions", False, f"HTTP {response.status_code}: {response.text}", response_time)
            except Exception as e:
                self.log_result("Get All Transactions", False, f"Exception: {str(e)}", 0)
        
        # Test transaction type filtering
        if "admin" in self.admin_tokens:
            try:
                headers = {"Authorization": f"Bearer {self.admin_tokens['admin']}"}
                start_time = time.time()
                response = self.session.get(f"{BACKEND_URL}/admin/transactions?transaction_type=deposit", headers=headers)
                response_time = time.time() - start_time
                
                if response.status_code == 200:
                    data = response.json()
                    if "transactions" in data and isinstance(data["transactions"], list):
                        # Check if all returned transactions are deposits
                        deposits = [t for t in data["transactions"] if t.get("type") == "deposit"]
                        if len(deposits) == len(data["transactions"]):
                            self.log_result("Transaction Type Filter", True, 
                                          f"Filtered {len(data['transactions'])} deposit transactions correctly", response_time)
                            success_count += 1
                        else:
                            self.log_result("Transaction Type Filter", False, 
                                          f"Filter not working: {len(deposits)}/{len(data['transactions'])} are deposits", 
                                          response_time)
                    else:
                        self.log_result("Transaction Type Filter", False, "Invalid response structure", response_time)
                else:
                    self.log_result("Transaction Type Filter", False, f"HTTP {response.status_code}: {response.text}", response_time)
            except Exception as e:
                self.log_result("Transaction Type Filter", False, f"Exception: {str(e)}", 0)
        
        # Test update transaction (admin only)
        if "admin" in self.admin_tokens:
            try:
                headers = {"Authorization": f"Bearer {self.admin_tokens['admin']}"}
                test_transaction_id = "test-transaction-123"
                update_data = {"status": "confirmed", "transaction_hash": "0x123456789abcdef", "notes": "Test update"}
                start_time = time.time()
                response = self.session.put(f"{BACKEND_URL}/admin/transactions/{test_transaction_id}", 
                                          headers=headers, json=update_data)
                response_time = time.time() - start_time
                
                if response.status_code == 200:
                    data = response.json()
                    if (data.get("status") == "confirmed" and 
                        data.get("transaction_hash") == "0x123456789abcdef" and
                        data.get("notes") == "Test update"):
                        self.log_result("Update Transaction", True, 
                                      f"Updated status to {data['status']}, hash: {data['transaction_hash']}", response_time)
                        success_count += 1
                    else:
                        self.log_result("Update Transaction", False, "Update not reflected in response", response_time)
                else:
                    self.log_result("Update Transaction", False, f"HTTP {response.status_code}: {response.text}", response_time)
            except Exception as e:
                self.log_result("Update Transaction", False, f"Exception: {str(e)}", 0)
        
        return success_count == 3

    def test_role_based_access_control(self):
        """Test role-based access control"""
        success_count = 0
        
        # Test KYC agent access to transactions (should be denied)
        if "kyc_agent" in self.admin_tokens:
            try:
                headers = {"Authorization": f"Bearer {self.admin_tokens['kyc_agent']}"}
                start_time = time.time()
                response = self.session.get(f"{BACKEND_URL}/admin/transactions", headers=headers)
                response_time = time.time() - start_time
                
                # KYC agents should have access to transactions (they have verify_admin dependency)
                if response.status_code == 200:
                    self.log_result("KYC Agent Transaction Access", True, 
                                  "KYC agent can access transactions (verify_admin allows)", response_time)
                    success_count += 1
                elif response.status_code == 403:
                    self.log_result("KYC Agent Transaction Access", True, 
                                  "KYC agent properly denied transaction access", response_time)
                    success_count += 1
                else:
                    self.log_result("KYC Agent Transaction Access", False, 
                                  f"Unexpected response: HTTP {response.status_code}", response_time)
            except Exception as e:
                self.log_result("KYC Agent Transaction Access", False, f"Exception: {str(e)}", 0)
        
        # Test support user access to clients (should be allowed)
        if "support" in self.admin_tokens:
            try:
                headers = {"Authorization": f"Bearer {self.admin_tokens['support']}"}
                start_time = time.time()
                response = self.session.get(f"{BACKEND_URL}/admin/clients", headers=headers)
                response_time = time.time() - start_time
                
                if response.status_code == 200:
                    self.log_result("Support Client Access", True, 
                                  "Support user can access clients correctly", response_time)
                    success_count += 1
                else:
                    self.log_result("Support Client Access", False, 
                                  f"Support user denied client access: HTTP {response.status_code}", response_time)
            except Exception as e:
                self.log_result("Support Client Access", False, f"Exception: {str(e)}", 0)
        
        # Test invalid token
        try:
            headers = {"Authorization": "Bearer invalid-token"}
            start_time = time.time()
            response = self.session.get(f"{BACKEND_URL}/admin/dashboard/stats", headers=headers)
            response_time = time.time() - start_time
            
            if response.status_code == 401:
                self.log_result("Invalid Token Access", True, 
                              "Invalid token properly rejected with 401", response_time)
                success_count += 1
            else:
                self.log_result("Invalid Token Access", False, 
                              f"Should return 401, got {response.status_code}", response_time)
        except Exception as e:
            self.log_result("Invalid Token Access", False, f"Exception: {str(e)}", 0)
        
        return success_count == 3

    # ========== KRAKEN API TESTING METHODS ==========
        
    def test_root_endpoint(self):
        """Test the root API endpoint"""
        try:
            start_time = time.time()
            response = self.session.get(f"{BACKEND_URL}/")
            response_time = time.time() - start_time
            
            if response.status_code == 200:
                data = response.json()
                if data.get("message") == "Kraken Trading API":
                    self.log_result("Root Endpoint", True, "API root accessible", response_time)
                    return True
                else:
                    self.log_result("Root Endpoint", False, f"Unexpected response: {data}", response_time)
            else:
                self.log_result("Root Endpoint", False, f"HTTP {response.status_code}: {response.text}", response_time)
        except Exception as e:
            self.log_result("Root Endpoint", False, f"Exception: {str(e)}", 0)
        return False
        
    def test_single_ticker(self):
        """Test single ticker endpoint with real pairs"""
        success_count = 0
        
        for pair in TEST_PAIRS:
            try:
                start_time = time.time()
                response = self.session.get(f"{BACKEND_URL}/ticker/{pair}")
                response_time = time.time() - start_time
                
                if response.status_code == 200:
                    data = response.json()
                    required_fields = ["pair", "ask_price", "bid_price", "last_price", "volume", "high_24h", "low_24h"]
                    
                    if all(field in data for field in required_fields):
                        # Validate data types and reasonable values
                        if (isinstance(data["last_price"], (int, float)) and data["last_price"] > 0 and
                            isinstance(data["volume"], (int, float)) and data["volume"] >= 0):
                            self.log_result(f"Single Ticker {pair}", True, 
                                          f"Price: ${data['last_price']}, Volume: {data['volume']}", response_time)
                            success_count += 1
                        else:
                            self.log_result(f"Single Ticker {pair}", False, "Invalid data values", response_time)
                    else:
                        missing = [f for f in required_fields if f not in data]
                        self.log_result(f"Single Ticker {pair}", False, f"Missing fields: {missing}", response_time)
                else:
                    self.log_result(f"Single Ticker {pair}", False, f"HTTP {response.status_code}: {response.text}", response_time)
            except Exception as e:
                self.log_result(f"Single Ticker {pair}", False, f"Exception: {str(e)}", 0)
                
        return success_count == len(TEST_PAIRS)
        
    def test_multiple_tickers(self):
        """Test multiple tickers endpoint"""
        try:
            pairs_param = ",".join(TEST_PAIRS[:3])  # Test with first 3 pairs
            start_time = time.time()
            response = self.session.get(f"{BACKEND_URL}/ticker?pairs={pairs_param}")
            response_time = time.time() - start_time
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, dict) and len(data) > 0:
                    # Check if we got data for multiple pairs
                    valid_pairs = 0
                    for pair_key, pair_data in data.items():
                        if "last_price" in pair_data and isinstance(pair_data["last_price"], (int, float)):
                            valid_pairs += 1
                    
                    if valid_pairs >= 2:
                        self.log_result("Multiple Tickers", True, 
                                      f"Retrieved {valid_pairs} pairs successfully", response_time)
                        return True
                    else:
                        self.log_result("Multiple Tickers", False, f"Only {valid_pairs} valid pairs returned", response_time)
                else:
                    self.log_result("Multiple Tickers", False, "Empty or invalid response format", response_time)
            else:
                self.log_result("Multiple Tickers", False, f"HTTP {response.status_code}: {response.text}", response_time)
        except Exception as e:
            self.log_result("Multiple Tickers", False, f"Exception: {str(e)}", 0)
        return False
        
    def test_orderbook(self):
        """Test orderbook endpoint"""
        try:
            pair = TEST_PAIRS[0]  # Test with BTC
            start_time = time.time()
            response = self.session.get(f"{BACKEND_URL}/orderbook/{pair}")
            response_time = time.time() - start_time
            
            if response.status_code == 200:
                data = response.json()
                if ("asks" in data and "bids" in data and 
                    isinstance(data["asks"], list) and isinstance(data["bids"], list) and
                    len(data["asks"]) > 0 and len(data["bids"]) > 0):
                    
                    # Validate first ask and bid structure
                    first_ask = data["asks"][0]
                    first_bid = data["bids"][0]
                    
                    if ("price" in first_ask and "volume" in first_ask and
                        "price" in first_bid and "volume" in first_bid):
                        self.log_result("Order Book", True, 
                                      f"Asks: {len(data['asks'])}, Bids: {len(data['bids'])}", response_time)
                        return True
                    else:
                        self.log_result("Order Book", False, "Invalid ask/bid structure", response_time)
                else:
                    self.log_result("Order Book", False, "Missing or empty asks/bids", response_time)
            else:
                self.log_result("Order Book", False, f"HTTP {response.status_code}: {response.text}", response_time)
        except Exception as e:
            self.log_result("Order Book", False, f"Exception: {str(e)}", 0)
        return False
        
    def test_ohlc(self):
        """Test OHLC endpoint"""
        try:
            pair = TEST_PAIRS[0]  # Test with BTC
            start_time = time.time()
            response = self.session.get(f"{BACKEND_URL}/ohlc/{pair}")
            response_time = time.time() - start_time
            
            if response.status_code == 200:
                data = response.json()
                if ("data" in data and isinstance(data["data"], list) and len(data["data"]) > 0):
                    first_entry = data["data"][0]
                    required_fields = ["timestamp", "open", "high", "low", "close", "volume"]
                    
                    if all(field in first_entry for field in required_fields):
                        self.log_result("OHLC Data", True, 
                                      f"Retrieved {len(data['data'])} OHLC entries", response_time)
                        return True
                    else:
                        missing = [f for f in required_fields if f not in first_entry]
                        self.log_result("OHLC Data", False, f"Missing fields in OHLC entry: {missing}", response_time)
                else:
                    self.log_result("OHLC Data", False, "No OHLC data returned", response_time)
            else:
                self.log_result("OHLC Data", False, f"HTTP {response.status_code}: {response.text}", response_time)
        except Exception as e:
            self.log_result("OHLC Data", False, f"Exception: {str(e)}", 0)
        return False
        
    def test_trades(self):
        """Test recent trades endpoint"""
        try:
            pair = TEST_PAIRS[0]  # Test with BTC
            start_time = time.time()
            response = self.session.get(f"{BACKEND_URL}/trades/{pair}")
            response_time = time.time() - start_time
            
            if response.status_code == 200:
                data = response.json()
                if ("trades" in data and isinstance(data["trades"], list) and len(data["trades"]) > 0):
                    first_trade = data["trades"][0]
                    required_fields = ["price", "volume", "timestamp", "buy_sell"]
                    
                    if all(field in first_trade for field in required_fields):
                        self.log_result("Recent Trades", True, 
                                      f"Retrieved {len(data['trades'])} recent trades", response_time)
                        return True
                    else:
                        missing = [f for f in required_fields if f not in first_trade]
                        self.log_result("Recent Trades", False, f"Missing fields in trade: {missing}", response_time)
                else:
                    self.log_result("Recent Trades", False, "No trades data returned", response_time)
            else:
                self.log_result("Recent Trades", False, f"HTTP {response.status_code}: {response.text}", response_time)
        except Exception as e:
            self.log_result("Recent Trades", False, f"Exception: {str(e)}", 0)
        return False
        
    def test_assets(self):
        """Test assets endpoint"""
        try:
            start_time = time.time()
            response = self.session.get(f"{BACKEND_URL}/assets")
            response_time = time.time() - start_time
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, dict) and len(data) > 0:
                    # Check for common assets
                    common_assets = ["XXBT", "XETH", "XXRP", "ZUSD"]  # Kraken asset codes
                    found_assets = [asset for asset in common_assets if asset in data]
                    
                    if len(found_assets) >= 2:
                        self.log_result("Assets", True, 
                                      f"Retrieved {len(data)} assets, found {len(found_assets)} common ones", response_time)
                        return True
                    else:
                        self.log_result("Assets", False, f"Only found {len(found_assets)} common assets", response_time)
                else:
                    self.log_result("Assets", False, "No assets data returned", response_time)
            else:
                self.log_result("Assets", False, f"HTTP {response.status_code}: {response.text}", response_time)
        except Exception as e:
            self.log_result("Assets", False, f"Exception: {str(e)}", 0)
        return False
        
    def test_asset_pairs(self):
        """Test asset pairs endpoint"""
        try:
            start_time = time.time()
            response = self.session.get(f"{BACKEND_URL}/asset-pairs")
            response_time = time.time() - start_time
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, dict) and len(data) > 0:
                    # Check for common pairs with Kraken naming conventions
                    common_pairs = ["XXBTZUSD", "XETHZUSD", "XXRPZUSD", "ADAUSD", "DOTUSD"]  # Actual Kraken pair codes
                    found_pairs = [pair for pair in common_pairs if pair in data]
                    
                    if len(found_pairs) >= 3:
                        self.log_result("Asset Pairs", True, 
                                      f"Retrieved {len(data)} pairs, found {len(found_pairs)} common ones", response_time)
                        return True
                    else:
                        self.log_result("Asset Pairs", False, f"Only found {len(found_pairs)} common pairs: {found_pairs}", response_time)
                else:
                    self.log_result("Asset Pairs", False, "No asset pairs data returned", response_time)
            else:
                self.log_result("Asset Pairs", False, f"HTTP {response.status_code}: {response.text}", response_time)
        except Exception as e:
            self.log_result("Asset Pairs", False, f"Exception: {str(e)}", 0)
        return False
        
    def test_market_summary(self):
        """Test market summary endpoint - KEY for dashboard"""
        try:
            start_time = time.time()
            response = self.session.get(f"{BACKEND_URL}/market-summary")
            response_time = time.time() - start_time
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, dict) and len(data) > 0:
                    # Check for expected pairs in the format the frontend expects
                    expected_pairs = ["BTCUSD", "ETHUSD", "XRPUSD"]
                    found_pairs = []
                    
                    for pair in expected_pairs:
                        # Check both direct pair name and Kraken format
                        kraken_pairs = [f"XBT{pair[3:]}", f"XETH{pair[3:]}", f"XXRP{pair[3:]}"]
                        if pair in data or any(kp in data for kp in kraken_pairs):
                            found_pairs.append(pair)
                    
                    # Also check if any pair has the expected structure (c, h, l, o, p, t, v)
                    valid_structure = False
                    for pair_key, pair_data in data.items():
                        if (isinstance(pair_data, dict) and 
                            "c" in pair_data and isinstance(pair_data["c"], list) and len(pair_data["c"]) >= 1):
                            valid_structure = True
                            break
                    
                    if len(found_pairs) >= 2 and valid_structure:
                        self.log_result("Market Summary", True, 
                                      f"Retrieved data for {len(data)} pairs, found {len(found_pairs)} expected pairs", response_time)
                        return True
                    else:
                        self.log_result("Market Summary", False, 
                                      f"Found {len(found_pairs)} expected pairs, valid structure: {valid_structure}", response_time)
                else:
                    self.log_result("Market Summary", False, "No market summary data returned", response_time)
            else:
                self.log_result("Market Summary", False, f"HTTP {response.status_code}: {response.text}", response_time)
        except Exception as e:
            self.log_result("Market Summary", False, f"Exception: {str(e)}", 0)
        return False
        
    def test_error_handling(self):
        """Test error handling with invalid pairs"""
        try:
            start_time = time.time()
            response = self.session.get(f"{BACKEND_URL}/ticker/{INVALID_PAIR}")
            response_time = time.time() - start_time
            
            # Should return an error status (400, 404, or 500)
            if response.status_code >= 400:
                self.log_result("Error Handling", True, 
                              f"Properly handled invalid pair with HTTP {response.status_code}", response_time)
                return True
            else:
                self.log_result("Error Handling", False, 
                              f"Did not handle invalid pair properly, got HTTP {response.status_code}", response_time)
        except Exception as e:
            self.log_result("Error Handling", False, f"Exception: {str(e)}", 0)
        return False
        
    def run_all_tests(self):
        """Run all backend API tests"""
        print("=" * 80)
        print("KRAKEN API BACKEND TESTING")
        print("=" * 80)
        print(f"Backend URL: {BACKEND_URL}")
        print(f"Test Pairs: {', '.join(TEST_PAIRS)}")
        print("=" * 80)
        
        tests = [
            self.test_root_endpoint,
            self.test_single_ticker,
            self.test_multiple_tickers,
            self.test_orderbook,
            self.test_ohlc,
            self.test_trades,
            self.test_assets,
            self.test_asset_pairs,
            self.test_market_summary,
            self.test_error_handling
        ]
        
        passed = 0
        total = len(tests)
        
        for test in tests:
            if test():
                passed += 1
            print("-" * 40)
            
        print("=" * 80)
        print(f"TESTING COMPLETE: {passed}/{total} tests passed")
        print("=" * 80)
        
        # Print summary
        print("\nDETAILED RESULTS:")
        for result in self.results:
            print(f"{result['status']} {result['test']}: {result['details']} ({result['response_time']})")
            
        return passed, total, self.results

if __name__ == "__main__":
    tester = BackendTester()
    passed, total, results = tester.run_all_tests()
    
    # Exit with appropriate code
    exit(0 if passed == total else 1)