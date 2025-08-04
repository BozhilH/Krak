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
  RefreshCw,
  LogOut,
  UserCircle,
  Shield,
  Eye,
  EyeOff,
  Moon,
  Sun,
  Globe,
  Volume2,
  Mail,
  Check,
  AlertTriangle,
  TrendingUpIcon
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Area, AreaChart } from 'recharts';
// Search Component
const SearchDropdown = ({ isOpen, onClose, setSelectedPair, setCurrentView, marketData }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const allPairs = [
    { symbol: 'BTCUSD', name: 'Bitcoin', description: 'Bitcoin to US Dollar' },
    { symbol: 'ETHUSD', name: 'Ethereum', description: 'Ethereum to US Dollar' },
    { symbol: 'XRPUSD', name: 'XRP', description: 'XRP to US Dollar' },
    { symbol: 'ADAUSD', name: 'Cardano', description: 'Cardano to US Dollar' },
    { symbol: 'DOTUSD', name: 'Polkadot', description: 'Polkadot to US Dollar' },
    { symbol: 'LINKUSD', name: 'Chainlink', description: 'Chainlink to US Dollar' },
    { symbol: 'LTCUSD', name: 'Litecoin', description: 'Litecoin to US Dollar' },
    { symbol: 'BCHUSD', name: 'Bitcoin Cash', description: 'Bitcoin Cash to US Dollar' }
  ];

  useEffect(() => {
    if (searchQuery) {
      const filtered = allPairs.filter(pair =>
        pair.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pair.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered.slice(0, 5));
    } else {
      setSearchResults(allPairs.slice(0, 5));
    }
  }, [searchQuery]);

  const handlePairSelect = (pair) => {
    setSelectedPair(pair.symbol);
    setCurrentView('trade');
    onClose();
    setSearchQuery('');
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-16 right-4 w-80 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-50">
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cryptocurrencies..."
            className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
            autoFocus
          />
        </div>
      </div>
      
      <div className="max-h-60 overflow-y-auto">
        {searchResults.map((pair) => {
          const data = marketData[pair.symbol];
          const price = data ? parseFloat(data.c[0]) : 0;
          
          return (
            <div
              key={pair.symbol}
              onClick={() => handlePairSelect(pair)}
              className="px-4 py-3 hover:bg-gray-700 cursor-pointer border-t border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">{pair.symbol}</p>
                  <p className="text-sm text-gray-400">{pair.name}</p>
                </div>
                {price > 0 && (
                  <div className="text-right">
                    <p className="font-medium text-white">${price.toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Notifications Component
const NotificationsDropdown = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'price_alert',
      title: 'Price Alert: BTC/USD',
      message: 'Bitcoin has reached $115,000',
      timestamp: '2 minutes ago',
      read: false,
      icon: TrendingUp
    },
    {
      id: 2,
      type: 'trade',
      title: 'Trade Executed',
      message: 'Successfully bought 0.1 BTC at $114,500',
      timestamp: '1 hour ago',
      read: false,
      icon: Check
    },
    {
      id: 3,
      type: 'system',
      title: 'System Maintenance',
      message: 'Scheduled maintenance tonight 2-4 AM UTC',
      timestamp: '3 hours ago',
      read: true,
      icon: AlertTriangle
    },
    {
      id: 4,
      type: 'market',
      title: 'Market Update',
      message: 'Ethereum showing strong bullish momentum',
      timestamp: '6 hours ago',
      read: true,
      icon: TrendingUpIcon
    }
  ]);

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="absolute top-16 right-4 w-80 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-50">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-white">Notifications</h3>
          {unreadCount > 0 && (
            <span className="bg-teal-600 text-white text-xs px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        {notifications.length > 0 && (
          <button
            onClick={clearAll}
            className="text-sm text-teal-400 hover:text-teal-300 mt-2"
          >
            Clear all
          </button>
        )}
      </div>
      
      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No notifications</p>
          </div>
        ) : (
          notifications.map((notification) => {
            const Icon = notification.icon;
            return (
              <div
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                className={`p-4 border-b border-gray-700 cursor-pointer hover:bg-gray-700 ${
                  !notification.read ? 'bg-gray-750' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${
                    notification.type === 'price_alert' ? 'bg-green-600' :
                    notification.type === 'trade' ? 'bg-blue-600' :
                    notification.type === 'system' ? 'bg-yellow-600' :
                    'bg-purple-600'
                  }`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white text-sm">{notification.title}</p>
                    <p className="text-gray-400 text-sm">{notification.message}</p>
                    <p className="text-gray-500 text-xs mt-1">{notification.timestamp}</p>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-teal-500 rounded-full mt-2"></div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

// User Profile Component
const UserDropdown = ({ isOpen, onClose, setCurrentView }) => {
  const [user] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: null,
    accountType: 'Pro Trader',
    balance: '$125,430.50',
    verified: true
  });

  const handleNavigation = (view) => {
    setCurrentView(view);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-16 right-4 w-64 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-50">
      {/* User Info */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-lg">
              {user.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div>
            <p className="font-semibold text-white">{user.name}</p>
            <p className="text-sm text-gray-400">{user.accountType}</p>
            {user.verified && (
              <div className="flex items-center mt-1">
                <Shield className="w-3 h-3 text-green-400 mr-1" />
                <span className="text-xs text-green-400">Verified</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Account Balance */}
      <div className="p-4 border-b border-gray-700">
        <div className="text-center">
          <p className="text-sm text-gray-400">Total Balance</p>
          <p className="text-xl font-bold text-white">{user.balance}</p>
        </div>
      </div>

      {/* Menu Items */}
      <div className="py-2">
        <button 
          onClick={() => handleNavigation('profile')}
          className="w-full px-4 py-3 text-left hover:bg-gray-700 flex items-center space-x-3"
        >
          <UserCircle className="w-5 h-5 text-gray-400" />
          <span className="text-white">Profile Settings</span>
        </button>
        <button 
          onClick={() => handleNavigation('wallet')}
          className="w-full px-4 py-3 text-left hover:bg-gray-700 flex items-center space-x-3"
        >
          <Wallet className="w-5 h-5 text-gray-400" />
          <span className="text-white">Wallet</span>
        </button>
        <button 
          onClick={() => handleNavigation('security')}
          className="w-full px-4 py-3 text-left hover:bg-gray-700 flex items-center space-x-3"
        >
          <Shield className="w-5 h-5 text-gray-400" />
          <span className="text-white">Security</span>
        </button>
        <button 
          onClick={() => handleNavigation('support')}
          className="w-full px-4 py-3 text-left hover:bg-gray-700 flex items-center space-x-3"
        >
          <Mail className="w-5 h-5 text-gray-400" />
          <span className="text-white">Support</span>
        </button>
        <button 
          onClick={() => handleNavigation('deposit')}
          className="w-full px-4 py-3 text-left hover:bg-gray-700 flex items-center space-x-3"
        >
          <Plus className="w-5 h-5 text-gray-400" />
          <span className="text-white">Deposit</span>
        </button>
        <button 
          onClick={() => handleNavigation('withdraw')}
          className="w-full px-4 py-3 text-left hover:bg-gray-700 flex items-center space-x-3"
        >
          <Minus className="w-5 h-5 text-gray-400" />
          <span className="text-white">Withdraw</span>
        </button>
        <div className="border-t border-gray-700 mt-2">
          <button className="w-full px-4 py-3 text-left hover:bg-gray-700 flex items-center space-x-3 text-red-400">
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Settings Component  
const SettingsDropdown = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState({
    darkMode: true,
    notifications: true,
    soundEffects: false,
    language: 'English',
    currency: 'USD',
    priceAlerts: true
  });

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-16 right-4 w-72 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-50">
      <div className="p-4 border-b border-gray-700">
        <h3 className="font-semibold text-white">Settings</h3>
      </div>
      
      <div className="py-2">
        {/* Theme Setting */}
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {settings.darkMode ? <Moon className="w-5 h-5 text-gray-400" /> : <Sun className="w-5 h-5 text-gray-400" />}
            <span className="text-white">Dark Mode</span>
          </div>
          <button
            onClick={() => toggleSetting('darkMode')}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              settings.darkMode ? 'bg-teal-600' : 'bg-gray-600'
            }`}
          >
            <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${
              settings.darkMode ? 'translate-x-6' : 'translate-x-0.5'
            }`}></div>
          </button>
        </div>

        {/* Notifications Setting */}
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bell className="w-5 h-5 text-gray-400" />
            <span className="text-white">Notifications</span>
          </div>
          <button
            onClick={() => toggleSetting('notifications')}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              settings.notifications ? 'bg-teal-600' : 'bg-gray-600'
            }`}
          >
            <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${
              settings.notifications ? 'translate-x-6' : 'translate-x-0.5'
            }`}></div>
          </button>
        </div>

        {/* Sound Effects Setting */}
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Volume2 className="w-5 h-5 text-gray-400" />
            <span className="text-white">Sound Effects</span>
          </div>
          <button
            onClick={() => toggleSetting('soundEffects')}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              settings.soundEffects ? 'bg-teal-600' : 'bg-gray-600'
            }`}
          >
            <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${
              settings.soundEffects ? 'translate-x-6' : 'translate-x-0.5'
            }`}></div>
          </button>
        </div>

        {/* Price Alerts Setting */}
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-gray-400" />
            <span className="text-white">Price Alerts</span>
          </div>
          <button
            onClick={() => toggleSetting('priceAlerts')}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              settings.priceAlerts ? 'bg-teal-600' : 'bg-gray-600'
            }`}
          >
            <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${
              settings.priceAlerts ? 'translate-x-6' : 'translate-x-0.5'
            }`}></div>
          </button>
        </div>

        <div className="border-t border-gray-700 mt-2">
          {/* Language Setting */}
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Globe className="w-5 h-5 text-gray-400" />
              <span className="text-white">Language</span>
            </div>
            <select
              value={settings.language}
              onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
              className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm"
            >
              <option value="English">English</option>
              <option value="Spanish">Español</option>
              <option value="French">Français</option>
              <option value="German">Deutsch</option>
              <option value="Chinese">中文</option>
            </select>
          </div>

          {/* Currency Setting */}
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="w-5 h-5 text-gray-400 text-center font-bold">$</span>
              <span className="text-white">Currency</span>
            </div>
            <select
              value={settings.currency}
              onChange={(e) => setSettings(prev => ({ ...prev, currency: e.target.value }))}
              className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="JPY">JPY</option>
              <option value="CAD">CAD</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

// Header Component
const Header = ({ currentView, setCurrentView, setSelectedPair, marketData }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'trade', label: 'Trade', icon: TrendingUp },
    { id: 'markets', label: 'Markets', icon: BarChart3 },
    { id: 'portfolio', label: 'Portfolio', icon: Wallet }
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.header-dropdown')) {
        setActiveDropdown(null);
      }
    };
    
    if (activeDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [activeDropdown]);

  const toggleDropdown = (dropdownName) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  return (
    <>
      <header className="bg-gray-800 border-b border-gray-700 relative">
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
            <div className="flex items-center space-x-2 relative">
              {/* Search */}
              <div className="header-dropdown relative">
                <button 
                  className={`p-2 rounded-lg transition-colors ${
                    activeDropdown === 'search' ? 'bg-gray-700 text-teal-400' : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                  onClick={() => toggleDropdown('search')}
                >
                  <Search className="w-5 h-5" />
                </button>
                <SearchDropdown
                  isOpen={activeDropdown === 'search'}
                  onClose={() => setActiveDropdown(null)}
                  setSelectedPair={setSelectedPair}
                  setCurrentView={setCurrentView}
                  marketData={marketData}
                />
              </div>

              {/* Notifications */}
              <div className="header-dropdown relative">
                <button 
                  className={`p-2 rounded-lg transition-colors relative ${
                    activeDropdown === 'notifications' ? 'bg-gray-700 text-teal-400' : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                  onClick={() => toggleDropdown('notifications')}
                >
                  <Bell className="w-5 h-5" />
                  {/* Notification badge */}
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">2</span>
                  </span>
                </button>
                <NotificationsDropdown
                  isOpen={activeDropdown === 'notifications'}
                  onClose={() => setActiveDropdown(null)}
                />
              </div>

              {/* User */}
              <div className="header-dropdown relative">
                <button 
                  className={`p-2 rounded-lg transition-colors ${
                    activeDropdown === 'user' ? 'bg-gray-700 text-teal-400' : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                  onClick={() => toggleDropdown('user')}
                >
                  <User className="w-5 h-5" />
                </button>
                <UserDropdown
                  isOpen={activeDropdown === 'user'}
                  onClose={() => setActiveDropdown(null)}
                  setCurrentView={setCurrentView}
                />
              </div>

              {/* Settings */}
              <div className="header-dropdown relative">
                <button 
                  className={`p-2 rounded-lg transition-colors ${
                    activeDropdown === 'settings' ? 'bg-gray-700 text-teal-400' : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                  onClick={() => toggleDropdown('settings')}
                >
                  <Settings className="w-5 h-5" />
                </button>
                <SettingsDropdown
                  isOpen={activeDropdown === 'settings'}
                  onClose={() => setActiveDropdown(null)}
                />
              </div>

              {/* Mobile menu button */}
              <button
                className="md:hidden p-2 text-gray-400 hover:text-white ml-2"
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

      {/* Overlay for mobile dropdowns */}
      {activeDropdown && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-20 z-40 md:hidden"
          onClick={() => setActiveDropdown(null)}
        />
      )}
    </>
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
                className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
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
  const [chartData, setChartData] = useState([]);
  const [chartLoading, setChartLoading] = useState(true);

  const currentData = marketData[selectedPair];
  const currentPrice = currentData ? parseFloat(currentData.c[0]) : 0;

  useEffect(() => {
    fetchChartData();
  }, [selectedPair]);

  const fetchChartData = async () => {
    try {
      setChartLoading(true);
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
      const response = await fetch(`${backendUrl}/api/ohlc/${selectedPair}?interval=60`);
      
      if (response.ok) {
        const data = await response.json();
        // Transform OHLC data to simple chart format
        const transformedData = data.data.slice(-24).map((entry, index) => ({
          time: new Date(entry.timestamp * 1000).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          value: entry.close
        }));
        setChartData(transformedData);
      } else {
        // Fallback to mock data
        setChartData(generateMockChartData(24));
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
      setChartData(generateMockChartData(24));
    }
    setChartLoading(false);
  };

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
                        ? 'bg-teal-600 text-white' 
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
                    onClick={() => fetchChartData()} // For now, just refresh with same data
                  >
                    {timeframe}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="h-96">
              {chartLoading ? (
                <div className="flex items-center justify-center h-full">
                  <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
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
              )}
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
  const [orderBook, setOrderBook] = useState({ asks: [], bids: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderBook();
    const interval = setInterval(fetchOrderBook, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, [selectedPair]);

  const fetchOrderBook = async () => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
      const response = await fetch(`${backendUrl}/api/orderbook/${selectedPair}?count=10`);
      
      if (response.ok) {
        const data = await response.json();
        setOrderBook({
          asks: data.asks.slice(0, 5),
          bids: data.bids.slice(0, 5)
        });
      } else {
        // Fallback to mock data
        setOrderBook({
          asks: [
            { price: 45120, volume: 0.5234, timestamp: Date.now() },
            { price: 45115, volume: 1.2341, timestamp: Date.now() },
            { price: 45110, volume: 0.8765, timestamp: Date.now() },
            { price: 45105, volume: 2.1234, timestamp: Date.now() },
            { price: 45100, volume: 0.6543, timestamp: Date.now() }
          ],
          bids: [
            { price: 45095, volume: 1.2341, timestamp: Date.now() },
            { price: 45090, volume: 0.8765, timestamp: Date.now() },
            { price: 45085, volume: 2.1234, timestamp: Date.now() },
            { price: 45080, volume: 0.6543, timestamp: Date.now() },
            { price: 45075, volume: 1.5432, timestamp: Date.now() }
          ]
        });
      }
    } catch (error) {
      console.error('Error fetching order book:', error);
      // Use mock data as fallback
      setOrderBook({
        asks: [
          { price: 45120, volume: 0.5234, timestamp: Date.now() },
          { price: 45115, volume: 1.2341, timestamp: Date.now() },
          { price: 45110, volume: 0.8765, timestamp: Date.now() },
          { price: 45105, volume: 2.1234, timestamp: Date.now() },
          { price: 45100, volume: 0.6543, timestamp: Date.now() }
        ],
        bids: [
          { price: 45095, volume: 1.2341, timestamp: Date.now() },
          { price: 45090, volume: 0.8765, timestamp: Date.now() },
          { price: 45085, volume: 2.1234, timestamp: Date.now() },
          { price: 45080, volume: 0.6543, timestamp: Date.now() },
          { price: 45075, volume: 1.5432, timestamp: Date.now() }
        ]
      });
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Order Book</h3>
        <div className="text-center py-8">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-gray-400" />
        </div>
      </div>
    );
  }

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
            {orderBook.asks.reverse().map((ask, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-red-400">${ask.price.toLocaleString()}</span>
                <span>{ask.volume.toFixed(4)}</span>
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
            {orderBook.bids.map((bid, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-green-400">${bid.price.toLocaleString()}</span>
                <span>{bid.volume.toFixed(4)}</span>
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
            orderType === 'market' ? 'bg-teal-600 text-white' : 'text-gray-300 hover:text-white'
          }`}
        >
          Market
        </button>
        <button
          onClick={() => setOrderType('limit')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            orderType === 'limit' ? 'bg-teal-600 text-white' : 'text-gray-300 hover:text-white'
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

// Profile Settings Component
const ProfileSettings = () => {
  const [user, setUser] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1990-05-15',
    country: 'United States',
    address: '123 Main Street',
    city: 'New York',
    postalCode: '10001',
    twoFactorEnabled: true,
    emailNotifications: true,
    smsNotifications: false
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to backend
    console.log('Profile updated:', user);
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Profile Settings</h1>
          <button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
              <input
                type="text"
                value={user.firstName}
                onChange={(e) => setUser(prev => ({ ...prev, firstName: e.target.value }))}
                disabled={!isEditing}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
              <input
                type="text"
                value={user.lastName}
                onChange={(e) => setUser(prev => ({ ...prev, lastName: e.target.value }))}
                disabled={!isEditing}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={user.email}
                onChange={(e) => setUser(prev => ({ ...prev, email: e.target.value }))}
                disabled={!isEditing}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
              <input
                type="tel"
                value={user.phone}
                onChange={(e) => setUser(prev => ({ ...prev, phone: e.target.value }))}
                disabled={!isEditing}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white disabled:opacity-50"
              />
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Address</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Country</label>
              <select
                value={user.country}
                onChange={(e) => setUser(prev => ({ ...prev, country: e.target.value }))}
                disabled={!isEditing}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white disabled:opacity-50"
              >
                <option value="United States">United States</option>
                <option value="Canada">Canada</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Germany">Germany</option>
                <option value="France">France</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Address</label>
              <input
                type="text"
                value={user.address}
                onChange={(e) => setUser(prev => ({ ...prev, address: e.target.value }))}
                disabled={!isEditing}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white disabled:opacity-50"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">City</label>
                <input
                  type="text"
                  value={user.city}
                  onChange={(e) => setUser(prev => ({ ...prev, city: e.target.value }))}
                  disabled={!isEditing}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Postal Code</label>
                <input
                  type="text"
                  value={user.postalCode}
                  onChange={(e) => setUser(prev => ({ ...prev, postalCode: e.target.value }))}
                  disabled={!isEditing}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white disabled:opacity-50"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="mt-8 border-t border-gray-700 pt-6">
          <h3 className="text-lg font-semibold text-white mb-4">Notification Preferences</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between">
              <span className="text-white">Email Notifications</span>
              <button
                onClick={() => setUser(prev => ({ ...prev, emailNotifications: !prev.emailNotifications }))}
                disabled={!isEditing}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  user.emailNotifications ? 'bg-teal-600' : 'bg-gray-600'
                } ${!isEditing ? 'opacity-50' : ''}`}
              >
                <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${
                  user.emailNotifications ? 'translate-x-6' : 'translate-x-0.5'
                }`}></div>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white">SMS Notifications</span>
              <button
                onClick={() => setUser(prev => ({ ...prev, smsNotifications: !prev.smsNotifications }))}
                disabled={!isEditing}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  user.smsNotifications ? 'bg-teal-600' : 'bg-gray-600'
                } ${!isEditing ? 'opacity-50' : ''}`}
              >
                <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${
                  user.smsNotifications ? 'translate-x-6' : 'translate-x-0.5'
                }`}></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Wallet Component
const WalletPage = () => {
  const [walletData] = useState({
    totalBalance: 125430.50,
    availableBalance: 98750.25,
    balances: [
      { symbol: 'BTC', amount: 0.5234, value: 59856.78, usdValue: 59856.78 },
      { symbol: 'ETH', amount: 15.2341, value: 54089.23, usdValue: 54089.23 },
      { symbol: 'XRP', amount: 3500, value: 10542.15, usdValue: 10542.15 },
      { symbol: 'USD', amount: 942.34, value: 942.34, usdValue: 942.34 }
    ]
  });

  return (
    <div className="p-4 sm:p-6">
      <div className="bg-gray-800 rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Wallet</h1>

        {/* Wallet Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-700 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Total Balance</p>
            <p className="text-2xl font-bold text-white">${walletData.totalBalance.toLocaleString()}</p>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Available Balance</p>
            <p className="text-2xl font-bold text-green-400">${walletData.availableBalance.toLocaleString()}</p>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <p className="text-gray-400 text-sm">In Orders</p>
            <p className="text-2xl font-bold text-yellow-400">${(walletData.totalBalance - walletData.availableBalance).toLocaleString()}</p>
          </div>
        </div>

        {/* Asset Balances */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 font-medium text-gray-300">Asset</th>
                <th className="text-right py-3 px-4 font-medium text-gray-300">Amount</th>
                <th className="text-right py-3 px-4 font-medium text-gray-300">USD Value</th>
                <th className="text-center py-3 px-4 font-medium text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {walletData.balances.map((balance) => (
                <tr key={balance.symbol} className="border-b border-gray-700 hover:bg-gray-700">
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white font-bold text-xs">{balance.symbol[0]}</span>
                      </div>
                      <div>
                        <p className="font-medium text-white">{balance.symbol}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right text-white">{balance.amount.toLocaleString()}</td>
                  <td className="py-4 px-4 text-right font-medium text-white">${balance.usdValue.toLocaleString()}</td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex justify-center space-x-2">
                      <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm">
                        Deposit
                      </button>
                      <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm">
                        Withdraw
                      </button>
                    </div>
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

// Security Component
const SecurityPage = () => {
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    emailAuth: true,
    smsAuth: false,
    apiAccess: false,
    loginNotifications: true
  });

  const [sessions] = useState([
    { id: 1, device: 'Chrome on Windows', location: 'New York, US', lastActive: '2 minutes ago', current: true },
    { id: 2, device: 'Safari on iPhone', location: 'New York, US', lastActive: '1 hour ago', current: false },
    { id: 3, device: 'Firefox on Mac', location: 'California, US', lastActive: '2 days ago', current: false }
  ]);

  const toggleSetting = (key) => {
    setSecuritySettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="bg-gray-800 rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Security Settings</h1>

        {/* Two-Factor Authentication */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Two-Factor Authentication</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
              <div>
                <p className="font-medium text-white">Authenticator App (2FA)</p>
                <p className="text-sm text-gray-400">Use Google Authenticator or similar apps</p>
              </div>
              <button
                onClick={() => toggleSetting('twoFactorAuth')}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  securitySettings.twoFactorAuth ? 'bg-teal-600' : 'bg-gray-600'
                }`}
              >
                <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${
                  securitySettings.twoFactorAuth ? 'translate-x-6' : 'translate-x-0.5'
                }`}></div>
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
              <div>
                <p className="font-medium text-white">Email Authentication</p>
                <p className="text-sm text-gray-400">Receive login codes via email</p>
              </div>
              <button
                onClick={() => toggleSetting('emailAuth')}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  securitySettings.emailAuth ? 'bg-teal-600' : 'bg-gray-600'
                }`}
              >
                <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${
                  securitySettings.emailAuth ? 'translate-x-6' : 'translate-x-0.5'
                }`}></div>
              </button>
            </div>
          </div>
        </div>

        {/* API Access */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">API Access</h3>
          <div className="p-4 bg-gray-700 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">API Trading Enabled</p>
                <p className="text-sm text-gray-400">Allow API access for trading</p>
              </div>
              <button
                onClick={() => toggleSetting('apiAccess')}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  securitySettings.apiAccess ? 'bg-teal-600' : 'bg-gray-600'
                }`}
              >
                <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${
                  securitySettings.apiAccess ? 'translate-x-6' : 'translate-x-0.5'
                }`}></div>
              </button>
            </div>
            {securitySettings.apiAccess && (
              <div className="mt-4 p-3 bg-gray-600 rounded">
                <p className="text-sm text-gray-300">API Key: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx</p>
                <button className="text-teal-400 text-sm mt-2">Regenerate API Key</button>
              </div>
            )}
          </div>
        </div>

        {/* Active Sessions */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Active Sessions</h3>
          <div className="space-y-3">
            {sessions.map((session) => (
              <div key={session.id} className="p-4 bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center">
                      <p className="font-medium text-white">{session.device}</p>
                      {session.current && (
                        <span className="ml-2 px-2 py-1 bg-green-600 text-white text-xs rounded">Current</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400">{session.location} • {session.lastActive}</p>
                  </div>
                  {!session.current && (
                    <button className="text-red-400 text-sm hover:text-red-300">
                      Terminate
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Support Component  
const SupportPage = () => {
  const [activeTab, setActiveTab] = useState('help');
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: 'technical',
    message: '',
    priority: 'medium'
  });

  const faqItems = [
    {
      question: 'How do I deposit cryptocurrency?',
      answer: 'Navigate to Wallet > Deposit, select your cryptocurrency, and follow the instructions to get your deposit address.'
    },
    {
      question: 'What are the trading fees?',
      answer: 'Trading fees range from 0.16% to 0.26% depending on your 30-day trading volume and whether you are a maker or taker.'
    },
    {
      question: 'How long do withdrawals take?',
      answer: 'Cryptocurrency withdrawals typically process within 30 minutes. Fiat withdrawals may take 1-5 business days depending on the method.'
    },
    {
      question: 'Is my account secure?',
      answer: 'Yes, we use industry-standard security measures including 2FA, cold storage for funds, and regular security audits.'
    }
  ];

  const handleSubmitTicket = (e) => {
    e.preventDefault();
    console.log('Ticket submitted:', ticketForm);
    // Here you would submit to backend
    alert('Support ticket submitted successfully!');
    setTicketForm({ subject: '', category: 'technical', message: '', priority: 'medium' });
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="bg-gray-800 rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Support Center</h1>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6">
          <button
            onClick={() => setActiveTab('help')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'help' ? 'bg-teal-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            Help Center
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'contact' ? 'bg-teal-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            Contact Support
          </button>
        </div>

        {activeTab === 'help' && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Frequently Asked Questions</h3>
            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <div key={index} className="bg-gray-700 rounded-lg p-4">
                  <h4 className="font-medium text-white mb-2">{item.question}</h4>
                  <p className="text-gray-300 text-sm">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <form onSubmit={handleSubmitTicket} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
              <input
                type="text"
                value={ticketForm.subject}
                onChange={(e) => setTicketForm(prev => ({ ...prev, subject: e.target.value }))}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <select
                  value={ticketForm.category}
                  onChange={(e) => setTicketForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                >
                  <option value="technical">Technical Issue</option>
                  <option value="trading">Trading Question</option>
                  <option value="account">Account Issue</option>
                  <option value="security">Security Concern</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
                <select
                  value={ticketForm.priority}
                  onChange={(e) => setTicketForm(prev => ({ ...prev, priority: e.target.value }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
              <textarea
                value={ticketForm.message}
                onChange={(e) => setTicketForm(prev => ({ ...prev, message: e.target.value }))}
                rows={6}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                placeholder="Please describe your issue in detail..."
                required
              />
            </div>

            <button
              type="submit"
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Submit Ticket
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

// Deposit Component
const DepositPage = () => {
  const [selectedAsset, setSelectedAsset] = useState('BTC');
  const [depositMethod, setDepositMethod] = useState('crypto');

  const cryptoAssets = [
    { symbol: 'BTC', name: 'Bitcoin', network: 'Bitcoin', fee: '0.0005 BTC' },
    { symbol: 'ETH', name: 'Ethereum', network: 'Ethereum', fee: '0.003 ETH' },
    { symbol: 'XRP', name: 'XRP', network: 'XRP Ledger', fee: '0.2 XRP' },
    { symbol: 'ADA', name: 'Cardano', network: 'Cardano', fee: '0.17 ADA' }
  ];

  const fiatMethods = [
    { id: 'bank', name: 'Bank Transfer', fee: 'Free', time: '1-3 business days', min: '$10', max: '$100,000' },
    { id: 'card', name: 'Credit/Debit Card', fee: '3.99%', time: 'Instant', min: '$1', max: '$25,000' },
    { id: 'sepa', name: 'SEPA Instant', fee: '€0.35', time: 'Instant', min: '€1', max: '€100,000' },
    { id: 'easypay', name: 'EasyPay', fee: '2.5%', time: 'Instant', min: '$5', max: '$10,000' }
  ];

  return (
    <div className="p-4 sm:p-6">
      <div className="bg-gray-800 rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Deposit</h1>

        {/* Deposit Method Selection */}
        <div className="flex space-x-1 mb-6">
          <button
            onClick={() => setDepositMethod('crypto')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              depositMethod === 'crypto' ? 'bg-teal-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            Cryptocurrency
          </button>
          <button
            onClick={() => setDepositMethod('fiat')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              depositMethod === 'fiat' ? 'bg-teal-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            Fiat Currency
          </button>
        </div>

        {depositMethod === 'crypto' && (
          <div>
            {/* Asset Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">Select Cryptocurrency</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {cryptoAssets.map((asset) => (
                  <button
                    key={asset.symbol}
                    onClick={() => setSelectedAsset(asset.symbol)}
                    className={`p-4 rounded-lg border text-left transition-colors ${
                      selectedAsset === asset.symbol
                        ? 'border-teal-600 bg-teal-600/20 text-white'
                        : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white font-bold text-sm">{asset.symbol[0]}</span>
                      </div>
                      <div>
                        <p className="font-medium">{asset.name} ({asset.symbol})</p>
                        <p className="text-sm text-gray-400">Network: {asset.network}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Deposit Address */}
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="font-semibold text-white mb-3">Deposit Address</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-400">Network</label>
                  <p className="text-white">{cryptoAssets.find(a => a.symbol === selectedAsset)?.network}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Address</label>
                  <div className="flex items-center space-x-2 bg-gray-800 p-3 rounded">
                    <code className="text-green-400 text-sm flex-1">3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy</code>
                    <button className="text-teal-400 hover:text-teal-300 text-sm">Copy</button>
                  </div>
                </div>
                <div className="bg-yellow-600/20 border border-yellow-600/30 rounded p-3">
                  <p className="text-yellow-200 text-sm">
                    ⚠️ Only send {selectedAsset} to this address. Sending other cryptocurrencies may result in permanent loss.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {depositMethod === 'fiat' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Choose Payment Method</h3>
            {fiatMethods.map((method) => (
              <div key={method.id} className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-white">{method.name}</h4>
                    <p className="text-sm text-gray-400">Fee: {method.fee} • {method.time}</p>
                    <p className="text-sm text-gray-400">Limits: {method.min} - {method.max}</p>
                  </div>
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Withdraw Component
const WithdrawPage = () => {
  const [selectedAsset, setSelectedAsset] = useState('BTC');
  const [withdrawMethod, setWithdrawMethod] = useState('crypto');
  const [withdrawForm, setWithdrawForm] = useState({
    amount: '',
    address: '',
    memo: ''
  });

  const fiatWithdrawMethods = [
    { 
      id: 'sepa', 
      name: 'SEPA Instant', 
      fee: '€0.35', 
      time: 'Instant', 
      min: '€1', 
      max: '€100,000',
      description: 'Instant SEPA transfers to EU bank accounts'
    },
    { 
      id: 'easypay', 
      name: 'EasyPay', 
      fee: '2.5%', 
      time: 'Instant', 
      min: '$5', 
      max: '$10,000',
      description: 'Quick withdrawals via EasyPay network'
    },
    { 
      id: 'bank', 
      name: 'Bank Deposit', 
      fee: '$15', 
      time: '1-3 days', 
      min: '$10', 
      max: '$100,000',
      description: 'Direct bank transfer to your account'
    },
    { 
      id: 'card', 
      name: 'Credit/Debit Card', 
      fee: '3.99%', 
      time: 'Instant', 
      min: '$1', 
      max: '$25,000',
      description: 'Withdraw directly to your card'
    }
  ];

  const [selectedFiatMethod, setSelectedFiatMethod] = useState('sepa');

  const handleWithdraw = (e) => {
    e.preventDefault();
    console.log('Withdraw request:', { selectedAsset, withdrawMethod, withdrawForm, selectedFiatMethod });
    alert('Withdrawal request submitted successfully!');
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="bg-gray-800 rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Withdraw</h1>

        {/* Withdraw Method Selection */}
        <div className="flex space-x-1 mb-6">
          <button
            onClick={() => setWithdrawMethod('crypto')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              withdrawMethod === 'crypto' ? 'bg-teal-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            Cryptocurrency
          </button>
          <button
            onClick={() => setWithdrawMethod('fiat')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              withdrawMethod === 'fiat' ? 'bg-teal-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            Fiat Currency
          </button>
        </div>

        {withdrawMethod === 'crypto' && (
          <form onSubmit={handleWithdraw} className="space-y-6">
            {/* Asset Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Select Cryptocurrency</label>
              <select
                value={selectedAsset}
                onChange={(e) => setSelectedAsset(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
              >
                <option value="BTC">Bitcoin (BTC) - Available: 0.5234</option>
                <option value="ETH">Ethereum (ETH) - Available: 15.2341</option>
                <option value="XRP">XRP (XRP) - Available: 3500</option>
                <option value="ADA">Cardano (ADA) - Available: 1250</option>
              </select>
            </div>

            {/* Withdrawal Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Amount</label>
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  value={withdrawForm.amount}
                  onChange={(e) => setWithdrawForm(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 pr-16 text-white"
                  placeholder="0.00"
                  required
                />
                <div className="absolute right-3 top-2 text-gray-400">{selectedAsset}</div>
              </div>
              <p className="text-sm text-gray-400 mt-1">Fee: 0.0005 {selectedAsset}</p>
            </div>

            {/* Destination Address */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Destination Address</label>
              <input
                type="text"
                value={withdrawForm.address}
                onChange={(e) => setWithdrawForm(prev => ({ ...prev, address: e.target.value }))}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                placeholder="Enter destination address"
                required
              />
            </div>

            {/* Memo/Tag (optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Memo/Tag (Optional)</label>
              <input
                type="text"
                value={withdrawForm.memo}
                onChange={(e) => setWithdrawForm(prev => ({ ...prev, memo: e.target.value }))}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                placeholder="Enter memo or destination tag if required"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition-colors"
            >
              Withdraw {selectedAsset}
            </button>
          </form>
        )}

        {withdrawMethod === 'fiat' && (
          <div className="space-y-6">
            {/* Fiat Method Selection */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Select Withdrawal Method</h3>
              <div className="space-y-3">
                {fiatWithdrawMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedFiatMethod(method.id)}
                    className={`w-full p-4 rounded-lg border text-left transition-colors ${
                      selectedFiatMethod === method.id
                        ? 'border-teal-600 bg-teal-600/20 text-white'
                        : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-lg">{method.name}</h4>
                        <p className="text-sm text-gray-400">{method.description}</p>
                        <p className="text-sm text-gray-400 mt-1">
                          Fee: {method.fee} • {method.time} • {method.min} - {method.max}
                        </p>
                      </div>
                      {selectedFiatMethod === method.id && (
                        <div className="w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Withdrawal Form */}
            <form onSubmit={handleWithdraw} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Amount (USD)</label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                  placeholder="0.00"
                  required
                />
              </div>

              {selectedFiatMethod === 'sepa' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">IBAN</label>
                    <input
                      type="text"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                      placeholder="DE89 3704 0044 0532 0130 00"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Bank Name</label>
                    <input
                      type="text"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                      placeholder="Bank name"
                      required
                    />
                  </div>
                </>
              )}

              {selectedFiatMethod === 'bank' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Account Number</label>
                    <input
                      type="text"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                      placeholder="Account number"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Routing Number</label>
                    <input
                      type="text"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                      placeholder="Routing number"
                      required
                    />
                  </div>
                </>
              )}

              {selectedFiatMethod === 'card' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Card Number</label>
                  <input
                    type="text"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    placeholder="**** **** **** 1234"
                    required
                  />
                </div>
              )}

              {selectedFiatMethod === 'easypay' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">EasyPay ID</label>
                  <input
                    type="text"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    placeholder="Enter your EasyPay ID"
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition-colors"
              >
                Withdraw via {fiatWithdrawMethods.find(m => m.id === selectedFiatMethod)?.name}
              </button>
            </form>
          </div>
        )}
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
  TradingForm,
  ProfileSettings,
  WalletPage,
  SecurityPage,
  DepositPage,
  WithdrawPage
};

export default Components;