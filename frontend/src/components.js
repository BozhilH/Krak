import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Bell,
  User,
  Settings,
  Menu,
  X,
  ChevronDown,
  Star,
  Plus,
  Minus,
  RefreshCw
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Area, AreaChart } from 'recharts';

// Header Component
const Header = ({ currentView, setCurrentView }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'trade', label: 'Trade', icon: TrendingUp },
    { id: 'markets', label: 'Markets', icon: BarChart3 },
    { id: 'portfolio', label: 'Portfolio', icon: Wallet }
  ];

  return (
    <header className="bg-gray-800 border-b border-gray-700">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">K</span>
                </div>
                <span className="ml-2 text-xl font-bold text-white">Kraken</span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentView === item.id
                      ? 'bg-teal-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-white">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-white">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-white">
              <User className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-white">
              <Settings className="w-5 h-5" />
            </button>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-gray-400 hover:text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentView(item.id);
                      setIsMenuOpen(false);
                    }}
                    className={`flex items-center w-full px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      currentView === item.id
                        ? 'bg-teal-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

// Dashboard Component
const Dashboard = ({ marketData, loading, setCurrentView, setSelectedPair }) => {
  const mockPortfolio = {
    totalValue: 125430.50,
    dailyChange: 2.45,
    dailyChangeAmount: 3012.40
  };

  const topPairs = Object.keys(marketData).slice(0, 6);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl mb-8">
        <div 
          className="absolute inset-0 bg-gradient-to-r from-teal-900 via-cyan-900 to-blue-900"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1639768939489-025b90ba9f23?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwxfHxjcnlwdG9jdXJyZW5jeSUyMHRyYWRpbmd8ZW58MHx8fGJsdWV8MTc1NDI5MzUwNXww&ixlib=rb-4.1.0&q=85')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-teal-900/80 to-cyan-900/80"></div>
        </div>
        <div className="relative p-8 text-white">
          <h1 className="text-4xl font-bold mb-2">Trade Crypto Like a Pro</h1>
          <p className="text-xl opacity-90 mb-6">Access 200+ cryptocurrencies with advanced trading tools</p>
          <div className="flex space-x-4">
            <button 
              onClick={() => setCurrentView('trade')}
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Start Trading
            </button>
            <button 
              onClick={() => setCurrentView('markets')}
              className="bg-transparent border-2 border-white/30 hover:border-white/50 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              View Markets
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Portfolio Overview */}
        <div className="lg:col-span-2">
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Portfolio Overview</h2>
              <button 
                onClick={() => setCurrentView('portfolio')}
                className="text-teal-400 hover:text-teal-300 text-sm font-medium"
              >
                View All
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center md:text-left">
                <p className="text-gray-400 text-sm">Total Balance</p>
                <p className="text-2xl font-bold">${mockPortfolio.totalValue.toLocaleString()}</p>
              </div>
              <div className="text-center md:text-left">
                <p className="text-gray-400 text-sm">24h Change</p>
                <p className={`text-xl font-semibold flex items-center justify-center md:justify-start ${
                  mockPortfolio.dailyChange >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {mockPortfolio.dailyChange >= 0 ? <ArrowUpRight className="w-5 h-5 mr-1" /> : <ArrowDownRight className="w-5 h-5 mr-1" />}
                  {Math.abs(mockPortfolio.dailyChange)}%
                </p>
              </div>
              <div className="text-center md:text-left">
                <p className="text-gray-400 text-sm">24h P&L</p>
                <p className={`text-xl font-semibold ${
                  mockPortfolio.dailyChangeAmount >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  ${Math.abs(mockPortfolio.dailyChangeAmount).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={generateMockChartData()}>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#14b8a6"
                    fill="url(#gradient)"
                    strokeWidth={2}
                  />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button 
                onClick={() => setCurrentView('trade')}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                Buy Crypto
              </button>
              <button 
                onClick={() => setCurrentView('trade')}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                Sell Crypto
              </button>
              <button 
                onClick={() => setCurrentView('portfolio')}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                View Portfolio
              </button>
            </div>
          </div>

          {/* Top Movers */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Top Movers</h3>
            <div className="space-y-3">
              {loading ? (
                <div className="text-center py-4">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto text-gray-400" />
                </div>
              ) : (
                topPairs.map((pair) => {
                  const data = marketData[pair];
                  if (!data) return null;
                  
                  const price = parseFloat(data.c[0]);
                  const openPrice = parseFloat(data.o);
                  const change = ((price - openPrice) / openPrice) * 100;
                  
                  return (
                    <div
                      key={pair}
                      className="flex items-center justify-between p-3 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors"
                      onClick={() => {
                        setSelectedPair(pair);
                        setCurrentView('trade');
                      }}
                    >
                      <div>
                        <p className="font-medium">{pair.replace('USD', '/USD')}</p>
                        <p className="text-sm text-gray-400">${price.toLocaleString()}</p>
                      </div>
                      <div className={`text-right ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        <div className="flex items-center">
                          {change >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                          <span className="font-medium">{Math.abs(change).toFixed(2)}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Trading Interface Component
const TradingInterface = ({ selectedPair, marketData, loading, setSelectedPair }) => {
  const [orderType, setOrderType] = useState('market');
  const [side, setSide] = useState('buy');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');

  const currentData = marketData[selectedPair];
  const currentPrice = currentData ? parseFloat(currentData.c[0]) : 0;

  return (
    <div className="p-4 sm:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Trading Pair Selection */}
        <div className="lg:col-span-4">
          <div className="bg-gray-800 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold">{selectedPair.replace('USD', '/USD')}</h1>
                {currentData && (
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl font-semibold">${currentPrice.toLocaleString()}</span>
                    <span className={`flex items-center ${
                      parseFloat(currentData.c[0]) >= parseFloat(currentData.o) ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {parseFloat(currentData.c[0]) >= parseFloat(currentData.o) ? 
                        <TrendingUp className="w-5 h-5 mr-1" /> : 
                        <TrendingDown className="w-5 h-5 mr-1" />
                      }
                      {(((parseFloat(currentData.c[0]) - parseFloat(currentData.o)) / parseFloat(currentData.o)) * 100).toFixed(2)}%
                    </span>
                  </div>
                )}
              </div>
              <div className="flex space-x-2">
                {Object.keys(marketData).slice(0, 6).map((pair) => (
                  <button
                    key={pair}
                    onClick={() => setSelectedPair(pair)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedPair === pair 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {pair.replace('USD', '')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Price Chart */}
        <div className="lg:col-span-3">
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Price Chart</h2>
              <div className="flex space-x-2">
                {['1h', '24h', '7d', '30d', '1y'].map((timeframe) => (
                  <button
                    key={timeframe}
                    className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
                  >
                    {timeframe}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={generateMockChartData(50)}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#14b8a6"
                    strokeWidth={2}
                    dot={false}
                  />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Order Book */}
          <OrderBook selectedPair={selectedPair} />
        </div>

        {/* Trading Form */}
        <div>
          <TradingForm 
            selectedPair={selectedPair}
            currentPrice={currentPrice}
            orderType={orderType}
            setOrderType={setOrderType}
            side={side}
            setSide={setSide}
            amount={amount}
            setAmount={setAmount}
            price={price}
            setPrice={setPrice}
          />
        </div>
      </div>
    </div>
  );
};

// Order Book Component
const OrderBook = ({ selectedPair }) => {
  const mockOrderBook = {
    asks: [
      { price: 45120, size: 0.5234, total: 0.5234 },
      { price: 45115, size: 1.2341, total: 1.7575 },
      { price: 45110, size: 0.8765, total: 2.634 },
      { price: 45105, size: 2.1234, total: 4.7574 },
      { price: 45100, size: 0.6543, total: 5.4117 }
    ],
    bids: [
      { price: 45095, size: 1.2341, total: 1.2341 },
      { price: 45090, size: 0.8765, total: 2.1106 },
      { price: 45085, size: 2.1234, total: 4.234 },
      { price: 45080, size: 0.6543, total: 4.8883 },
      { price: 45075, size: 1.5432, total: 6.4315 }
    ]
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Order Book</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Asks */}
        <div>
          <h4 className="text-red-400 font-medium mb-2">Asks</h4>
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-400 mb-2">
              <span>Price</span>
              <span>Size</span>
            </div>
            {mockOrderBook.asks.reverse().map((ask, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-red-400">${ask.price.toLocaleString()}</span>
                <span>{ask.size.toFixed(4)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bids */}
        <div>
          <h4 className="text-green-400 font-medium mb-2">Bids</h4>
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-400 mb-2">
              <span>Price</span>
              <span>Size</span>
            </div>
            {mockOrderBook.bids.map((bid, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-green-400">${bid.price.toLocaleString()}</span>
                <span>{bid.size.toFixed(4)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Trading Form Component
const TradingForm = ({ 
  selectedPair, 
  currentPrice, 
  orderType, 
  setOrderType, 
  side, 
  setSide, 
  amount, 
  setAmount, 
  price, 
  setPrice 
}) => {
  const [balance] = useState({
    USD: 10000,
    BTC: 0.5,
    ETH: 2.3,
    XRP: 1000
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`${side.toUpperCase()} order submitted for ${amount} ${selectedPair.replace('USD', '')} at ${orderType === 'market' ? 'market price' : '$' + price}`);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Place Order</h3>
      
      {/* Order Type Selection */}
      <div className="flex bg-gray-700 rounded-lg p-1 mb-4">
        <button
          onClick={() => setOrderType('market')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            orderType === 'market' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:text-white'
          }`}
        >
          Market
        </button>
        <button
          onClick={() => setOrderType('limit')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            orderType === 'limit' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:text-white'
          }`}
        >
          Limit
        </button>
      </div>

      {/* Buy/Sell Toggle */}
      <div className="flex bg-gray-700 rounded-lg p-1 mb-4">
        <button
          onClick={() => setSide('buy')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            side === 'buy' ? 'bg-green-600 text-white' : 'text-gray-300 hover:text-white'
          }`}
        >
          Buy
        </button>
        <button
          onClick={() => setSide('sell')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            side === 'sell' ? 'bg-red-600 text-white' : 'text-gray-300 hover:text-white'
          }`}
        >
          Sell
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Price Input (only for limit orders) */}
        {orderType === 'limit' && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Price (USD)
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder={currentPrice.toFixed(2)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        )}

        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Amount ({selectedPair.replace('USD', '')})
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Quick Amount Buttons */}
        <div className="flex space-x-2">
          {['25%', '50%', '75%', '100%'].map((percent) => (
            <button
              key={percent}
              type="button"
              onClick={() => {
                const percentage = parseInt(percent) / 100;
                const availableBalance = side === 'buy' ? balance.USD / currentPrice : balance[selectedPair.replace('USD', '')] || 0;
                setAmount((availableBalance * percentage).toFixed(6));
              }}
              className="flex-1 py-1 px-2 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
            >
              {percent}
            </button>
          ))}
        </div>

        {/* Total */}
        <div className="bg-gray-700 rounded-lg p-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Total:</span>
            <span className="font-medium">
              ${amount && currentPrice ? (parseFloat(amount) * currentPrice).toFixed(2) : '0.00'}
            </span>
          </div>
        </div>

        {/* Balance */}
        <div className="text-sm text-gray-400">
          Available: {side === 'buy' ? `$${balance.USD.toLocaleString()}` : `${balance[selectedPair.replace('USD', '')] || 0} ${selectedPair.replace('USD', '')}`}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
            side === 'buy'
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
        >
          {side === 'buy' ? 'Buy' : 'Sell'} {selectedPair.replace('USD', '')}
        </button>
      </form>
    </div>
  );
};

// Market Data Component
const MarketData = ({ marketData, loading, setSelectedPair, setCurrentView }) => {
  const [sortBy, setSortBy] = useState('volume');
  const [sortOrder, setSortOrder] = useState('desc');

  const sortedPairs = Object.entries(marketData).sort((a, b) => {
    const [pairA, dataA] = a;
    const [pairB, dataB] = b;
    
    let valueA, valueB;
    
    switch (sortBy) {
      case 'price':
        valueA = parseFloat(dataA.c[0]);
        valueB = parseFloat(dataB.c[0]);
        break;
      case 'change':
        valueA = ((parseFloat(dataA.c[0]) - parseFloat(dataA.o)) / parseFloat(dataA.o)) * 100;
        valueB = ((parseFloat(dataB.c[0]) - parseFloat(dataB.o)) / parseFloat(dataB.o)) * 100;
        break;
      case 'volume':
        valueA = parseFloat(dataA.v[1]);
        valueB = parseFloat(dataB.v[1]);
        break;
      default:
        valueA = parseFloat(dataA.v[1]);
        valueB = parseFloat(dataB.v[1]);
    }
    
    return sortOrder === 'desc' ? valueB - valueA : valueA - valueB;
  });

  return (
    <div className="p-4 sm:p-6">
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Market Data</h1>
          <div className="flex items-center space-x-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
            >
              <option value="volume">Sort by Volume</option>
              <option value="price">Sort by Price</option>
              <option value="change">Sort by Change</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              {sortOrder === 'desc' ? '↓' : '↑'}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 font-medium text-gray-300">Pair</th>
                <th className="text-right py-3 px-4 font-medium text-gray-300">Price</th>
                <th className="text-right py-3 px-4 font-medium text-gray-300">24h Change</th>
                <th className="text-right py-3 px-4 font-medium text-gray-300">24h High</th>
                <th className="text-right py-3 px-4 font-medium text-gray-300">24h Low</th>
                <th className="text-right py-3 px-4 font-medium text-gray-300">Volume</th>
                <th className="text-center py-3 px-4 font-medium text-gray-300">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-8">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-gray-400" />
                  </td>
                </tr>
              ) : (
                sortedPairs.map(([pair, data]) => {
                  const price = parseFloat(data.c[0]);
                  const openPrice = parseFloat(data.o);
                  const change = ((price - openPrice) / openPrice) * 100;
                  const high = parseFloat(data.h[1]);
                  const low = parseFloat(data.l[1]);
                  const volume = parseFloat(data.v[1]);

                  return (
                    <tr
                      key={pair}
                      className="border-b border-gray-700 hover:bg-gray-700 cursor-pointer transition-colors"
                      onClick={() => {
                        setSelectedPair(pair);
                        setCurrentView('trade');
                      }}
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <div>
                            <p className="font-medium">{pair.replace('USD', '/USD')}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right font-medium">
                        ${price.toLocaleString()}
                      </td>
                      <td className={`py-4 px-4 text-right font-medium ${
                        change >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        <div className="flex items-center justify-end">
                          {change >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                          {Math.abs(change).toFixed(2)}%
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right text-gray-300">
                        ${high.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-right text-gray-300">
                        ${low.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-right text-gray-300">
                        {volume.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPair(pair);
                            setCurrentView('trade');
                          }}
                          className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                          Trade
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Portfolio Component
const Portfolio = ({ marketData }) => {
  const mockHoldings = [
    { symbol: 'BTC', amount: 0.5234, value: 23567.80, change: 2.34 },
    { symbol: 'ETH', amount: 2.3456, value: 6567.20, change: -1.23 },
    { symbol: 'XRP', amount: 1000, value: 650.00, change: 5.67 },
    { symbol: 'ADA', amount: 500, value: 325.00, change: 1.89 }
  ];

  const totalValue = mockHoldings.reduce((sum, holding) => sum + holding.value, 0);

  return (
    <div className="p-4 sm:p-6">
      <div className="bg-gray-800 rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Portfolio</h1>
        
        {/* Portfolio Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-700 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Total Portfolio Value</p>
            <p className="text-2xl font-bold">${totalValue.toLocaleString()}</p>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <p className="text-gray-400 text-sm">24h Change</p>
            <p className="text-2xl font-bold text-green-400">+2.45%</p>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Best Performer</p>
            <p className="text-2xl font-bold text-green-400">XRP (+5.67%)</p>
          </div>
        </div>

        {/* Holdings Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 font-medium text-gray-300">Asset</th>
                <th className="text-right py-3 px-4 font-medium text-gray-300">Amount</th>
                <th className="text-right py-3 px-4 font-medium text-gray-300">Value</th>
                <th className="text-right py-3 px-4 font-medium text-gray-300">24h Change</th>
                <th className="text-right py-3 px-4 font-medium text-gray-300">Allocation</th>
              </tr>
            </thead>
            <tbody>
              {mockHoldings.map((holding) => (
                <tr key={holding.symbol} className="border-b border-gray-700 hover:bg-gray-700">
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white font-bold text-xs">{holding.symbol[0]}</span>
                      </div>
                      <div>
                        <p className="font-medium">{holding.symbol}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">{holding.amount}</td>
                  <td className="py-4 px-4 text-right font-medium">${holding.value.toLocaleString()}</td>
                  <td className={`py-4 px-4 text-right font-medium ${
                    holding.change >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {holding.change >= 0 ? '+' : ''}{holding.change}%
                  </td>
                  <td className="py-4 px-4 text-right">
                    {((holding.value / totalValue) * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Utility function to generate mock chart data
const generateMockChartData = (points = 24) => {
  const data = [];
  const basePrice = 45000;
  let currentPrice = basePrice;
  
  for (let i = 0; i < points; i++) {
    const change = (Math.random() - 0.5) * 1000;
    currentPrice += change;
    
    data.push({
      time: i < 10 ? `0${i}:00` : `${i}:00`,
      value: Math.max(currentPrice, 30000)
    });
  }
  
  return data;
};

const Components = {
  Header,
  Dashboard,
  TradingInterface,
  MarketData,
  Portfolio,
  OrderBook,
  TradingForm
};

export default Components;