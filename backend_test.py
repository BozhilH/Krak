#!/usr/bin/env python3
"""
Backend API Testing Script for Kraken API Integration
Tests all implemented Kraken API endpoints with real cryptocurrency pairs
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

class BackendTester:
    def __init__(self):
        self.results = []
        self.session = requests.Session()
        self.session.timeout = 30
        
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
                    # Check for common pairs
                    common_pairs = ["XBTUSD", "ETHUSD", "XRPUSD"]  # Kraken pair codes
                    found_pairs = [pair for pair in common_pairs if pair in data]
                    
                    if len(found_pairs) >= 2:
                        self.log_result("Asset Pairs", True, 
                                      f"Retrieved {len(data)} pairs, found {len(found_pairs)} common ones", response_time)
                        return True
                    else:
                        self.log_result("Asset Pairs", False, f"Only found {len(found_pairs)} common pairs", response_time)
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