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
  TrendingUpIcon,
  Users,
  MessageSquare,
  DollarSign,
  FileText,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
  Edit,
  Trash2,
  Download,
  Upload,
  Lock,
  Key,
  Database,
  MapPin,
  Navigation,
  Smartphone,
  Wifi,
  Battery,
  Signal
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Area, AreaChart } from 'recharts';

// ATM Locator Component
const ATMLocator = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedATM, setSelectedATM] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  
  // Mock ATM data with locations
  const [atmData] = useState([
    {
      id: 'atm_001',
      name: 'CryptoOX ATM - Downtown Mall',
      address: '123 Main Street, New York, NY 10001',
      coordinates: { lat: 40.7128, lng: -74.0060 },
      status: 'online',
      supported_coins: ['BTC', 'ETH', 'XRP'],
      fees: { buy: 5.5, sell: 4.5 },
      cash_available: 75000,
      last_maintenance: '2025-01-10T10:00:00Z',
      daily_volume: 125000,
      rating: 4.8,
      reviews: 124,
      hours: '24/7',
      features: ['contactless', 'cash_deposit', 'receipt_printing']
    },
    {
      id: 'atm_002', 
      name: 'CryptoOX ATM - Financial District',
      address: '456 Wall Street, New York, NY 10005',
      coordinates: { lat: 40.7074, lng: -74.0113 },
      status: 'online',
      supported_coins: ['BTC', 'ETH', 'XRP'],
      fees: { buy: 5.0, sell: 4.0 },
      cash_available: 92000,
      last_maintenance: '2025-01-09T14:30:00Z',
      daily_volume: 189000,
      rating: 4.9,
      reviews: 256,
      hours: '6:00 AM - 10:00 PM',
      features: ['contactless', 'cash_deposit', 'receipt_printing', 'multilingual']
    },
    {
      id: 'atm_003',
      name: 'CryptoOX ATM - Times Square',
      address: '789 Broadway, New York, NY 10019',
      coordinates: { lat: 40.7580, lng: -73.9855 },
      status: 'maintenance',
      supported_coins: ['BTC', 'ETH', 'XRP'],
      fees: { buy: 6.0, sell: 5.0 },
      cash_available: 0,
      last_maintenance: '2025-01-10T08:00:00Z',
      daily_volume: 0,
      rating: 4.6,
      reviews: 89,
      hours: '24/7',
      features: ['contactless', 'receipt_printing']
    },
    {
      id: 'atm_004',
      name: 'CryptoOX ATM - Central Park West',
      address: '321 Central Park West, New York, NY 10025',
      coordinates: { lat: 40.7829, lng: -73.9654 },
      status: 'online',
      supported_coins: ['BTC', 'ETH', 'XRP'],
      fees: { buy: 5.2, sell: 4.2 },
      cash_available: 68000,
      last_maintenance: '2025-01-08T12:00:00Z',
      daily_volume: 98000,
      rating: 4.7,
      reviews: 178,
      hours: '24/7',
      features: ['contactless', 'cash_deposit', 'receipt_printing']
    },
    {
      id: 'atm_005',
      name: 'CryptoOX ATM - Brooklyn Bridge',
      address: '654 Brooklyn Bridge Blvd, Brooklyn, NY 11201',
      coordinates: { lat: 40.6892, lng: -73.9956 },
      status: 'low_cash',
      supported_coins: ['BTC', 'ETH'],
      fees: { buy: 5.8, sell: 4.8 },
      cash_available: 15000,
      last_maintenance: '2025-01-07T16:00:00Z',
      daily_volume: 67000,
      rating: 4.5,
      reviews: 92,
      hours: '8:00 AM - 8:00 PM',
      features: ['contactless', 'receipt_printing']
    }
  ]);

  const [filteredATMs, setFilteredATMs] = useState(atmData);

  useEffect(() => {
    // Get user location (mock for now)
    setUserLocation({ lat: 40.7128, lng: -74.0060 });
    
    // Filter ATMs based on search
    if (searchQuery) {
      const filtered = atmData.filter(atm =>
        atm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        atm.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredATMs(filtered);
    } else {
      setFilteredATMs(atmData);
    }
  }, [searchQuery]);

  const calculateDistance = (atm) => {
    if (!userLocation) return 0;
    // Simple distance calculation (mock)
    const lat1 = userLocation.lat;
    const lon1 = userLocation.lng;
    const lat2 = atm.coordinates.lat;
    const lon2 = atm.coordinates.lng;
    
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c;
    
    return Math.round(d * 10) / 10;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'text-green-400';
      case 'maintenance': return 'text-red-400';
      case 'low_cash': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'online': return 'bg-green-600';
      case 'maintenance': return 'bg-red-600';
      case 'low_cash': return 'bg-yellow-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold text-white mb-2">ATM Locator</h1>
          <p className="text-gray-400 text-sm mb-4">Find the nearest CryptoOX ATM</p>
          
          {/* Search and View Toggle */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by location or address..."
                className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div className="flex bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-1 rounded text-sm font-medium transition-colors ${
                  viewMode === 'list' ? 'bg-teal-600 text-white' : 'text-gray-300'
                }`}
              >
                List
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-4 py-1 rounded text-sm font-medium transition-colors ${
                  viewMode === 'map' ? 'bg-teal-600 text-white' : 'text-gray-300'
                }`}
              >
                Map
              </button>
            </div>
          </div>
          
          {/* Stats */}
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              <span className="text-gray-300">{atmData.filter(a => a.status === 'online').length} Online</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
              <span className="text-gray-300">{atmData.filter(a => a.status === 'low_cash').length} Low Cash</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
              <span className="text-gray-300">{atmData.filter(a => a.status === 'maintenance').length} Maintenance</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        {viewMode === 'map' && (
          // Simple map placeholder
          <div className="bg-gray-800 rounded-lg h-64 mb-6 flex items-center justify-center border-2 border-dashed border-gray-600">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-400">Interactive Map View</p>
              <p className="text-gray-500 text-sm">Showing {filteredATMs.length} ATMs</p>
            </div>
          </div>
        )}

        {/* ATM List */}
        <div className="space-y-4">
          {filteredATMs.map((atm) => (
            <div key={atm.id} className="bg-gray-800 rounded-lg p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-white">{atm.name}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium text-white ${getStatusBadge(atm.status)}`}>
                      {atm.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-2 flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {atm.address}
                  </p>
                  <p className="text-gray-400 text-sm mb-2">
                    <Clock className="w-4 h-4 mr-1 inline" />
                    {atm.hours}
                  </p>
                  <div className="flex items-center text-sm text-gray-400 mb-3">
                    <Navigation className="w-4 h-4 mr-1" />
                    <span>{calculateDistance(atm)} km away</span>
                    <span className="mx-2">•</span>
                    <Star className="w-4 h-4 mr-1 text-yellow-400" />
                    <span>{atm.rating} ({atm.reviews} reviews)</span>
                  </div>
                </div>
                
                <div className="text-right sm:ml-4">
                  <div className="text-sm text-gray-400 mb-1">Daily Volume</div>
                  <div className="text-lg font-semibold text-white">${atm.daily_volume.toLocaleString()}</div>
                </div>
              </div>

              {/* Supported Coins */}
              <div className="mb-4">
                <div className="text-sm text-gray-400 mb-2">Supported Cryptocurrencies</div>
                <div className="flex flex-wrap gap-2">
                  {atm.supported_coins.map(coin => (
                    <span key={coin} className="px-2 py-1 bg-gray-700 text-teal-400 rounded text-xs font-medium">
                      {coin}
                    </span>
                  ))}
                </div>
              </div>

              {/* Fees and Cash */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                <div>
                  <div className="text-xs text-gray-400">Buy Fee</div>
                  <div className="text-sm font-semibold text-white">{atm.fees.buy}%</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">Sell Fee</div>
                  <div className="text-sm font-semibold text-white">{atm.fees.sell}%</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">Cash Available</div>
                  <div className={`text-sm font-semibold ${atm.cash_available > 50000 ? 'text-green-400' : atm.cash_available > 20000 ? 'text-yellow-400' : 'text-red-400'}`}>
                    ${atm.cash_available.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">Last Service</div>
                  <div className="text-sm text-gray-300">
                    {new Date(atm.last_maintenance).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="mb-4">
                <div className="text-sm text-gray-400 mb-2">Features</div>
                <div className="flex flex-wrap gap-2">
                  {atm.features.map(feature => (
                    <span key={feature} className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">
                      {feature.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-2">
                <button 
                  onClick={() => setSelectedATM(atm)}
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Get Directions
                </button>
                <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                  View Details
                </button>
                {atm.status === 'online' && (
                  <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                    Use ATM
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredATMs.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No ATMs Found</h3>
            <p className="text-gray-400">Try adjusting your search criteria or check back later.</p>
          </div>
        )}
      </div>

      {/* Selected ATM Modal */}
      {selectedATM && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Directions</h3>
              <button 
                onClick={() => setSelectedATM(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mb-4">
              <p className="text-white font-medium">{selectedATM.name}</p>
              <p className="text-gray-400 text-sm">{selectedATM.address}</p>
              <p className="text-teal-400 text-sm mt-2">{calculateDistance(selectedATM)} km away</p>
            </div>
            <div className="flex gap-3">
              <button 
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-lg text-sm font-medium"
                onClick={() => {
                  // Mock opening directions
                  alert(`Opening directions to ${selectedATM.name}...`);
                  setSelectedATM(null);
                }}
              >
                Open in Maps
              </button>
              <button 
                onClick={() => setSelectedATM(null)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Admin Login Component
const AdminLogin = ({ onLogin }) => {
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
      const response = await fetch(`${backendUrl}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData)
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('admin_token', data.access_token);
        localStorage.setItem('admin_user', JSON.stringify(data.user));
        onLogin(data);
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Login failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">C</span>
          </div>
          <h1 className="text-2xl font-bold text-white">CryptoOX Admin</h1>
          <p className="text-gray-400">Sign in to admin panel</p>
        </div>

        {error && (
          <div className="bg-red-600/20 border border-red-600/30 rounded p-3 mb-4">
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
            <input
              type="text"
              value={loginData.username}
              onChange={(e) => setLoginData(prev => ({ ...prev, username: e.target.value }))}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter your username"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <input
              type="password"
              value={loginData.password}
              onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-6 border-t border-gray-700 pt-4">
          <p className="text-gray-400 text-sm">Demo Accounts:</p>
          <div className="mt-2 space-y-1 text-xs">
            <p className="text-gray-300">Admin: <code>admin</code> / <code>admin123</code></p>
            <p className="text-gray-300">Support: <code>support</code> / <code>support123</code></p>
            <p className="text-gray-300">KYC Agent: <code>kyc_agent</code> / <code>kyc123</code></p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Admin Header Component
const AdminHeader = ({ user, currentView, setCurrentView, onLogout }) => {
  return (
    <header className="bg-gray-800 border-b border-gray-700">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">C</span>
                </div>
                <span className="ml-2 text-xl font-bold text-white">CryptoOX Admin</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user.username[0].toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-white font-medium">{user.username}</p>
                <p className="text-gray-400 text-sm capitalize">{user.role}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

// Admin Sidebar Component
const AdminSidebar = ({ user, currentView, setCurrentView }) => {
  const adminMenuItems = [
    { id: 'admin-dashboard', label: 'Dashboard', icon: BarChart3, roles: ['admin', 'support', 'kyc'] },
    { id: 'admin-clients', label: 'Clients', icon: Users, roles: ['admin', 'support', 'kyc'] },
    { id: 'admin-tickets', label: 'Support Tickets', icon: MessageSquare, roles: ['admin', 'support'] },
    { id: 'admin-kyc', label: 'KYC Management', icon: Shield, roles: ['admin', 'support', 'kyc'] },
    { id: 'admin-deposits', label: 'Deposits', icon: ArrowDownRight, roles: ['admin'] },
    { id: 'admin-withdrawals', label: 'Withdrawals', icon: ArrowUpRight, roles: ['admin'] },
    { id: 'admin-transactions', label: 'All Transactions', icon: Activity, roles: ['admin'] },
    { id: 'admin-users', label: 'Admin Users', icon: UserCircle, roles: ['admin'] }
  ];

  const filteredMenuItems = adminMenuItems.filter(item => item.roles.includes(user.role));

  return (
    <div className="w-64 bg-gray-800 border-r border-gray-700 min-h-screen">
      <nav className="mt-8 px-4">
        <div className="space-y-1">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`flex items-center w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentView === item.id
                    ? 'bg-teal-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 mr-3" />
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

// Admin Dashboard Component
const AdminDashboard = ({ user }) => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
      const token = localStorage.getItem('admin_token');
      
      const response = await fetch(`${backendUrl}/api/admin/dashboard/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-gray-400">Welcome back, {user.username}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Clients</p>
              <p className="text-2xl font-bold text-white">{stats.total_clients?.toLocaleString()}</p>
              <p className="text-green-400 text-sm">+{stats.new_registrations_today} today</p>
            </div>
            <Users className="w-8 h-8 text-teal-400" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Open Tickets</p>
              <p className="text-2xl font-bold text-white">{stats.open_tickets}</p>
              <p className="text-blue-400 text-sm">{stats.resolved_tickets_today} resolved today</p>
            </div>
            <MessageSquare className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pending KYC</p>
              <p className="text-2xl font-bold text-white">{stats.pending_kyc}</p>
              <p className="text-yellow-400 text-sm">Requires review</p>
            </div>
            <Shield className="w-8 h-8 text-yellow-400" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">24h Volume</p>
              <p className="text-2xl font-bold text-white">${stats.total_volume_24h?.toLocaleString()}</p>
              <p className="text-green-400 text-sm">+${stats.total_fees_24h?.toLocaleString()} fees</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-400" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Pending Transactions</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-700 rounded">
              <div className="flex items-center">
                <ArrowDownRight className="w-4 h-4 text-green-400 mr-2" />
                <div>
                  <p className="text-white font-medium">Deposits</p>
                  <p className="text-gray-400 text-sm">{stats.pending_deposits} pending</p>
                </div>
              </div>
              <span className="text-yellow-400">Review needed</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-700 rounded">
              <div className="flex items-center">
                <ArrowUpRight className="w-4 h-4 text-red-400 mr-2" />
                <div>
                  <p className="text-white font-medium">Withdrawals</p>
                  <p className="text-gray-400 text-sm">{stats.pending_withdrawals} pending</p>
                </div>
              </div>
              <span className="text-red-400">Action required</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Trading Engine</span>
              <span className="flex items-center text-green-400">
                <CheckCircle className="w-4 h-4 mr-1" />
                Online
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">API Services</span>
              <span className="flex items-center text-green-400">
                <CheckCircle className="w-4 h-4 mr-1" />
                Operational
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">KYC System</span>
              <span className="flex items-center text-yellow-400">
                <AlertCircle className="w-4 h-4 mr-1" />
                Maintenance
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Payment Gateway</span>
              <span className="flex items-center text-green-400">
                <CheckCircle className="w-4 h-4 mr-1" />
                Connected
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Client Management Component
const AdminClients = ({ user }) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
      const token = localStorage.getItem('admin_token');
      
      const response = await fetch(`${backendUrl}/api/admin/clients`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setClients(data.clients);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
    setLoading(false);
  };

  const updateClientKYC = async (clientId, kycStatus) => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
      const token = localStorage.getItem('admin_token');
      
      await fetch(`${backendUrl}/api/admin/clients/${clientId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ kyc_status: kycStatus })
      });
      
      fetchClients(); // Refresh the list
    } catch (error) {
      console.error('Error updating client:', error);
    }
  };

  const filteredClients = clients.filter(client =>
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.last_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Client Management</h1>
        <p className="text-gray-400">Manage client accounts and KYC status</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search clients by email, name..."
            className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-300">Client</th>
                <th className="text-left py-3 px-4 font-medium text-gray-300">Email</th>
                <th className="text-left py-3 px-4 font-medium text-gray-300">Country</th>
                <th className="text-left py-3 px-4 font-medium text-gray-300">KYC Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-300">Balance</th>
                <th className="text-left py-3 px-4 font-medium text-gray-300">Last Activity</th>
                <th className="text-left py-3 px-4 font-medium text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr key={client.id} className="border-t border-gray-700 hover:bg-gray-700">
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white font-semibold text-xs">
                          {client.first_name[0]}{client.last_name[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-white">{client.first_name} {client.last_name}</p>
                        <p className="text-sm text-gray-400">ID: {client.id.substring(0, 8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-300">{client.email}</td>
                  <td className="py-4 px-4 text-gray-300">{client.country}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      client.kyc_status === 'approved' ? 'bg-green-600 text-white' :
                      client.kyc_status === 'pending' ? 'bg-yellow-600 text-white' :
                      client.kyc_status === 'requires_review' ? 'bg-orange-600 text-white' :
                      'bg-red-600 text-white'
                    }`}>
                      {client.kyc_status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-medium text-white">${client.total_balance.toLocaleString()}</td>
                  <td className="py-4 px-4 text-gray-300">
                    {new Date(client.last_activity).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-2">
                      {user.role === 'admin' || user.role === 'kyc' ? (
                        <>
                          {client.kyc_status === 'pending' && (
                            <button
                              onClick={() => updateClientKYC(client.id, 'approved')}
                              className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs"
                            >
                              Approve
                            </button>
                          )}
                          {client.kyc_status === 'requires_review' && (
                            <button
                              onClick={() => updateClientKYC(client.id, 'approved')}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs"
                            >
                              Review
                            </button>
                          )}
                        </>
                      ) : null}
                      <button className="bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded text-xs">
                        View
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

// Support Tickets Component
const AdminTickets = ({ user }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchTickets();
  }, [statusFilter]);

  const fetchTickets = async () => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
      const token = localStorage.getItem('admin_token');
      
      const url = `${backendUrl}/api/admin/tickets${statusFilter ? `?status=${statusFilter}` : ''}`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTickets(data.tickets);
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
    setLoading(false);
  };

  const updateTicket = async (ticketId, status) => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
      const token = localStorage.getItem('admin_token');
      
      await fetch(`${backendUrl}/api/admin/tickets/${ticketId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, assigned_to: user.username })
      });
      
      fetchTickets(); // Refresh the list
    } catch (error) {
      console.error('Error updating ticket:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Support Tickets</h1>
        <p className="text-gray-400">Manage customer support requests</p>
      </div>

      {/* Filter Buttons */}
      <div className="mb-6 flex space-x-2">
        <button
          onClick={() => setStatusFilter('')}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            statusFilter === '' ? 'bg-teal-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          All
        </button>
        {['open', 'in_progress', 'resolved', 'closed'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
              statusFilter === status ? 'bg-teal-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {status.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
        {tickets.map((ticket) => (
          <div key={ticket.id} className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">{ticket.subject}</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <span>From: {ticket.client_email}</span>
                  <span>Category: {ticket.category}</span>
                  <span>Created: {new Date(ticket.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  ticket.priority === 'urgent' ? 'bg-red-600 text-white' :
                  ticket.priority === 'high' ? 'bg-orange-600 text-white' :
                  ticket.priority === 'medium' ? 'bg-yellow-600 text-white' :
                  'bg-gray-600 text-white'
                }`}>
                  {ticket.priority}
                </span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  ticket.status === 'open' ? 'bg-green-600 text-white' :
                  ticket.status === 'in_progress' ? 'bg-blue-600 text-white' :
                  ticket.status === 'resolved' ? 'bg-purple-600 text-white' :
                  'bg-gray-600 text-white'
                }`}>
                  {ticket.status.replace('_', ' ')}
                </span>
              </div>
            </div>

            <p className="text-gray-300 mb-4">{ticket.message}</p>

            {ticket.assigned_to && (
              <p className="text-sm text-gray-400 mb-4">
                Assigned to: <span className="text-teal-400">{ticket.assigned_to}</span>
              </p>
            )}

            <div className="flex space-x-2">
              {ticket.status === 'open' && (
                <button
                  onClick={() => updateTicket(ticket.id, 'in_progress')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                >
                  Start Working
                </button>
              )}
              {ticket.status === 'in_progress' && (
                <button
                  onClick={() => updateTicket(ticket.id, 'resolved')}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                >
                  Mark Resolved
                </button>
              )}
              <button className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm">
                Add Note
              </button>
              <button className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 rounded text-sm">
                Reply
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Sum-Sub KYC Dashboard Component
const AdminKYCDashboard = ({ user }) => {
  const [kycData, setKycData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKYCDashboard();
  }, []);

  const fetchKYCDashboard = async () => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
      const token = localStorage.getItem('admin_token');
      
      const response = await fetch(`${backendUrl}/api/admin/sumsub/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setKycData(data);
      }
    } catch (error) {
      console.error('Error fetching KYC dashboard:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">KYC Verification Dashboard</h1>
        <p className="text-gray-400">Sum-Sub integration for identity verification</p>
      </div>

      {/* KYC Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Applications</p>
              <p className="text-2xl font-bold text-white">{kycData.total_applications}</p>
            </div>
            <Users className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pending Review</p>
              <p className="text-2xl font-bold text-white">{kycData.pending_review}</p>
              <p className="text-yellow-400 text-sm">Requires attention</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-400" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Approved</p>
              <p className="text-2xl font-bold text-white">{kycData.approved}</p>
              <p className="text-green-400 text-sm">Verified users</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Rejected</p>
              <p className="text-2xl font-bold text-white">{kycData.rejected}</p>
              <p className="text-red-400 text-sm">Failed verification</p>
            </div>
            <XCircle className="w-8 h-8 text-red-400" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">On Hold</p>
              <p className="text-2xl font-bold text-white">{kycData.on_hold}</p>
              <p className="text-orange-400 text-sm">Additional info needed</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-orange-400" />
          </div>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Applications</h3>
          <div className="space-y-4">
            {kycData.recent_applications?.map((app) => (
              <div key={app.applicant_id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {app.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-white">{app.name}</p>
                    <p className="text-sm text-gray-400">{app.email}</p>
                    <p className="text-sm text-gray-400">{app.country} • {app.level}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    app.status === 'approved' ? 'bg-green-600 text-white' :
                    app.status === 'pending_review' ? 'bg-yellow-600 text-white' :
                    app.status === 'rejected' ? 'bg-red-600 text-white' :
                    'bg-orange-600 text-white'
                  }`}>
                    {app.status.replace('_', ' ')}
                  </span>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(app.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Verification Levels</h3>
          <div className="space-y-4">
            {kycData.verification_levels?.map((level) => (
              <div key={level.name} className="p-4 bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-white">{level.name}</h4>
                  <span className="text-teal-400 font-semibold">{level.count}</span>
                </div>
                <p className="text-sm text-gray-400">{level.description}</p>
              </div>
            ))}
            
            <div className="mt-6">
              <h4 className="font-medium text-white mb-3">Processing Time</h4>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Average Time</span>
                  <span className="text-teal-400 font-semibold">{kycData.avg_processing_time_hours}h</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Country Distribution */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Applications by Country</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(kycData.country_distribution || {}).map(([country, count]) => (
            <div key={country} className="text-center p-3 bg-gray-700 rounded-lg">
              <p className="font-medium text-white">{country}</p>
              <p className="text-2xl font-bold text-teal-400">{count}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Sum-Sub Applicants Management Component
const AdminKYCApplicants = ({ user }) => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchApplicants();
  }, [statusFilter, levelFilter]);

  const fetchApplicants = async () => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
      const token = localStorage.getItem('admin_token');
      
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (levelFilter) params.append('level', levelFilter);
      
      const response = await fetch(`${backendUrl}/api/admin/sumsub/applicants?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setApplicants(data.applicants);
      }
    } catch (error) {
      console.error('Error fetching applicants:', error);
    }
    setLoading(false);
  };

  const handleApproval = async (applicantId) => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
      const token = localStorage.getItem('admin_token');
      
      const response = await fetch(`${backendUrl}/api/admin/sumsub/applicants/${applicantId}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        fetchApplicants(); // Refresh list
      }
    } catch (error) {
      console.error('Error approving applicant:', error);
    }
  };

  const handleRejection = async (applicantId, reason) => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
      const token = localStorage.getItem('admin_token');
      
      const response = await fetch(`${backendUrl}/api/admin/sumsub/applicants/${applicantId}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          rejection_reason: reason,
          rejection_comment: 'Rejected from admin panel'
        })
      });

      if (response.ok) {
        fetchApplicants(); // Refresh list
      }
    } catch (error) {
      console.error('Error rejecting applicant:', error);
    }
  };

  const filteredApplicants = applicants.filter(applicant =>
    applicant.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    applicant.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    applicant.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">KYC Applicants</h1>
        <p className="text-gray-400">Manage Sum-Sub verification applications</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search applicants..."
            className="bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="">All Statuses</option>
          <option value="pending_review">Pending Review</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="on_hold">On Hold</option>
          <option value="in_progress">In Progress</option>
        </select>

        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="">All Levels</option>
          <option value="basic-kyc">Basic KYC</option>
          <option value="enhanced-kyc">Enhanced KYC</option>
          <option value="corporate-kyc">Corporate KYC</option>
        </select>

        <button
          onClick={fetchApplicants}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </button>
      </div>

      {/* Applicants Table */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-300">Applicant</th>
                <th className="text-left py-3 px-4 font-medium text-gray-300">Email</th>
                <th className="text-left py-3 px-4 font-medium text-gray-300">Country</th>
                <th className="text-left py-3 px-4 font-medium text-gray-300">Level</th>
                <th className="text-left py-3 px-4 font-medium text-gray-300">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-300">Risk Score</th>
                <th className="text-left py-3 px-4 font-medium text-gray-300">Created</th>
                <th className="text-left py-3 px-4 font-medium text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplicants.map((applicant) => (
                <tr key={applicant.applicant_id} className="border-t border-gray-700 hover:bg-gray-700">
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white font-semibold text-xs">
                          {applicant.first_name[0]}{applicant.last_name[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-white">{applicant.first_name} {applicant.last_name}</p>
                        <p className="text-sm text-gray-400">ID: {applicant.applicant_id.substring(0, 8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-300">{applicant.email}</td>
                  <td className="py-4 px-4 text-gray-300">{applicant.country}</td>
                  <td className="py-4 px-4">
                    <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded">
                      {applicant.level}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      applicant.status === 'approved' ? 'bg-green-600 text-white' :
                      applicant.status === 'pending_review' ? 'bg-yellow-600 text-white' :
                      applicant.status === 'rejected' ? 'bg-red-600 text-white' :
                      applicant.status === 'on_hold' ? 'bg-orange-600 text-white' :
                      'bg-blue-600 text-white'
                    }`}>
                      {applicant.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`font-medium ${
                      applicant.risk_score <= 0.3 ? 'text-green-400' :
                      applicant.risk_score <= 0.7 ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>
                      {applicant.risk_score}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-300">
                    {new Date(applicant.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-2">
                      {applicant.status === 'pending_review' && user.role === 'admin' && (
                        <>
                          <button
                            onClick={() => handleApproval(applicant.applicant_id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejection(applicant.applicant_id, 'Manual review rejection')}
                            className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      <button className="bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded text-xs">
                        View
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

// Sum-Sub Applicant Detail Component
const AdminKYCApplicantDetail = ({ applicantId, onBack }) => {
  const [applicant, setApplicant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplicantDetail();
  }, [applicantId]);

  const fetchApplicantDetail = async () => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
      const token = localStorage.getItem('admin_token');
      
      const response = await fetch(`${backendUrl}/api/admin/sumsub/applicants/${applicantId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setApplicant(data);
      }
    } catch (error) {
      console.error('Error fetching applicant detail:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  if (!applicant) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-gray-400">Applicant not found</p>
          <button
            onClick={onBack}
            className="mt-4 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center">
        <button
          onClick={onBack}
          className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg mr-4"
        >
          <X className="w-4 h-4" />
        </button>
        <h1 className="text-2xl font-bold text-white">KYC Application Detail</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Information */}
        <div className="lg:col-span-2">
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                <p className="text-white">
                  {applicant.info.first_name} {applicant.info.middle_name} {applicant.info.last_name}
                </p>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Email</label>
                <p className="text-white">{applicant.info.email}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Phone</label>
                <p className="text-white">{applicant.info.phone}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Date of Birth</label>
                <p className="text-white">{applicant.info.date_of_birth}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Country</label>
                <p className="text-white">{applicant.info.country}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Nationality</label>
                <p className="text-white">{applicant.info.nationality}</p>
              </div>
            </div>

            {applicant.info.addresses && applicant.info.addresses.length > 0 && (
              <div className="mt-6">
                <label className="block text-sm text-gray-400 mb-2">Address</label>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <p className="text-white">
                    {applicant.info.addresses[0].street}<br/>
                    {applicant.info.addresses[0].city}, {applicant.info.addresses[0].state} {applicant.info.addresses[0].postal_code}<br/>
                    {applicant.info.addresses[0].country}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Documents */}
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Submitted Documents</h3>
            <div className="space-y-4">
              {applicant.documents.map((doc) => (
                <div key={doc.document_id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium text-white">{doc.document_type.replace('_', ' ')}</p>
                    <p className="text-sm text-gray-400">
                      {doc.country} • {doc.image_ids.length} image(s)
                    </p>
                    <p className="text-sm text-gray-400">
                      Uploaded: {new Date(doc.uploaded_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    doc.status === 'approved' ? 'bg-green-600 text-white' :
                    doc.status === 'rejected' ? 'bg-red-600 text-white' :
                    'bg-yellow-600 text-white'
                  }`}>
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Verification Steps */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Verification Progress</h3>
            <div className="space-y-4">
              {applicant.verification_steps.map((step, index) => (
                <div key={index} className="flex items-center">
                  <div className={`w-4 h-4 rounded-full mr-4 ${
                    step.status === 'completed' ? 'bg-green-500' :
                    step.status === 'in_progress' ? 'bg-yellow-500' :
                    'bg-gray-500'
                  }`}></div>
                  <div>
                    <p className="text-white font-medium">{step.step.replace('_', ' ')}</p>
                    <p className="text-sm text-gray-400">
                      {step.status === 'completed' && step.completed_at ? 
                        `Completed: ${new Date(step.completed_at).toLocaleString()}` :
                        `Status: ${step.status}`
                      }
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Status & Actions */}
        <div className="space-y-6">
          {/* Current Status */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Status</h3>
            <div className="space-y-4">
              <div>
                <span className={`px-3 py-2 rounded text-sm font-medium ${
                  applicant.status === 'approved' ? 'bg-green-600 text-white' :
                  applicant.status === 'pending_review' ? 'bg-yellow-600 text-white' :
                  applicant.status === 'rejected' ? 'bg-red-600 text-white' :
                  'bg-orange-600 text-white'
                }`}>
                  {applicant.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-400">Level</p>
                <p className="text-white">{applicant.level}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Created</p>
                <p className="text-white">{new Date(applicant.created_at).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Last Update</p>
                <p className="text-white">{new Date(applicant.updated_at).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Risk Assessment */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Risk Assessment</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-400 mb-2">Overall Score</p>
                <div className="bg-gray-700 rounded-lg p-3">
                  <span className={`text-lg font-bold ${
                    applicant.risk_assessment.overall_score <= 0.3 ? 'text-green-400' :
                    applicant.risk_assessment.overall_score <= 0.7 ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {applicant.risk_assessment.overall_score}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-400 mb-2">Risk Factors</p>
                <div className="space-y-2">
                  {applicant.risk_assessment.factors.map((factor, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-700 rounded">
                      <span className="text-white text-sm">{factor.factor.replace('_', ' ')}</span>
                      <span className={`text-sm font-medium ${
                        factor.status === 'pass' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {factor.score}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* AML Results */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">AML Screening</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-white">Sanctions Match</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  applicant.aml_results.sanctions_match ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
                }`}>
                  {applicant.aml_results.sanctions_match ? 'MATCH' : 'CLEAR'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white">PEP Match</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  applicant.aml_results.pep_match ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
                }`}>
                  {applicant.aml_results.pep_match ? 'MATCH' : 'CLEAR'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white">Adverse Media</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  applicant.aml_results.adverse_media ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
                }`}>
                  {applicant.aml_results.adverse_media ? 'FOUND' : 'CLEAR'}
                </span>
              </div>
              <div className="pt-2 border-t border-gray-700">
                <p className="text-sm text-gray-400">
                  Screened: {new Date(applicant.aml_results.screening_date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Manual KYC Management Component (for transactions under 250 EUR)
const ManualKYCManagement = ({ user }) => {
  const [manualKycRequests, setManualKycRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchManualKycRequests();
  }, [statusFilter]);

  const fetchManualKycRequests = async () => {
    try {
      // Mock data for manual KYC requests (transactions under 250 EUR)
      // In production, this would fetch from your backend
      const mockRequests = [
        {
          id: 'manual_001',
          client_id: 'user_12345',
          client_email: 'john.doe@example.com',
          client_name: 'John Doe',
          transaction_amount: 150.00,
          transaction_currency: 'EUR',
          transaction_type: 'withdrawal',
          transaction_id: 'txn_001',
          status: 'pending_review',
          submitted_at: '2025-08-04T10:30:00Z',
          documents: [
            { type: 'government_id', filename: 'passport.jpg', uploaded_at: '2025-08-04T10:30:00Z' },
            { type: 'selfie', filename: 'selfie.jpg', uploaded_at: '2025-08-04T10:31:00Z' }
          ],
          notes: 'Initial verification for first withdrawal'
        },
        {
          id: 'manual_002',
          client_id: 'user_12346',
          client_email: 'maria.garcia@example.com',
          client_name: 'Maria Garcia',
          transaction_amount: 200.00,
          transaction_currency: 'EUR',
          transaction_type: 'deposit',
          transaction_id: 'txn_002',
          status: 'approved',
          submitted_at: '2025-08-04T09:15:00Z',
          approved_at: '2025-08-04T10:00:00Z',
          approved_by: 'admin',
          documents: [
            { type: 'government_id', filename: 'drivers_license.jpg', uploaded_at: '2025-08-04T09:15:00Z' }
          ],
          notes: 'Standard verification passed'
        }
      ];

      // Add more mock data
      for (let i = 3; i <= 15; i++) {
        mockRequests.push({
          id: `manual_${i.toString().padStart(3, '0')}`,
          client_id: `user_${12344 + i}`,
          client_email: `user${i}@example.com`,
          client_name: `User ${i}`,
          transaction_amount: Math.random() * 200 + 50, // Random amount under 250
          transaction_currency: 'EUR',
          transaction_type: ['withdrawal', 'deposit'][Math.floor(Math.random() * 2)],
          transaction_id: `txn_${i.toString().padStart(3, '0')}`,
          status: ['pending_review', 'approved', 'rejected', 'requires_documents'][Math.floor(Math.random() * 4)],
          submitted_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          documents: [
            { type: 'government_id', filename: `id_${i}.jpg`, uploaded_at: new Date().toISOString() }
          ],
          notes: `Manual KYC for user ${i}`
        });
      }

      // Filter by status if specified
      let filteredRequests = mockRequests;
      if (statusFilter) {
        filteredRequests = mockRequests.filter(req => req.status === statusFilter);
      }

      setManualKycRequests(filteredRequests);
    } catch (error) {
      console.error('Error fetching manual KYC requests:', error);
    }
    setLoading(false);
  };

  const handleApproval = async (requestId) => {
    try {
      // In production, this would call your backend API
      setManualKycRequests(prev => prev.map(req => 
        req.id === requestId 
          ? { ...req, status: 'approved', approved_at: new Date().toISOString(), approved_by: user.username }
          : req
      ));
      alert('Manual KYC request approved successfully!');
    } catch (error) {
      console.error('Error approving manual KYC:', error);
    }
  };

  const handleRejection = async (requestId, reason) => {
    try {
      // In production, this would call your backend API
      setManualKycRequests(prev => prev.map(req => 
        req.id === requestId 
          ? { ...req, status: 'rejected', rejected_at: new Date().toISOString(), rejected_by: user.username, rejection_reason: reason }
          : req
      ));
      alert('Manual KYC request rejected successfully!');
    } catch (error) {
      console.error('Error rejecting manual KYC:', error);
    }
  };

  const handleRequestDocuments = async (requestId, documents) => {
    try {
      // In production, this would call your backend API
      setManualKycRequests(prev => prev.map(req => 
        req.id === requestId 
          ? { ...req, status: 'requires_documents', documents_requested: documents, requested_at: new Date().toISOString() }
          : req
      ));
      alert('Additional documents requested successfully!');
    } catch (error) {
      console.error('Error requesting documents:', error);
    }
  };

  const filteredRequests = manualKycRequests.filter(req =>
    req.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.client_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Manual KYC Management</h1>
        <p className="text-gray-400">Verification requests for transactions under €250</p>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div>
              <input
                type="text"
                placeholder="Search by name, email, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 w-64"
              />
            </div>
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
              >
                <option value="">All Status</option>
                <option value="pending_review">Pending Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="requires_documents">Requires Documents</option>
              </select>
            </div>
          </div>
          <div className="text-sm text-gray-400">
            Showing {filteredRequests.length} of {manualKycRequests.length} requests
          </div>
        </div>
      </div>

      {/* Manual KYC Requests Table */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="text-left p-4 font-medium text-gray-300">Request ID</th>
                <th className="text-left p-4 font-medium text-gray-300">Client</th>
                <th className="text-left p-4 font-medium text-gray-300">Transaction</th>
                <th className="text-left p-4 font-medium text-gray-300">Amount</th>
                <th className="text-left p-4 font-medium text-gray-300">Status</th>
                <th className="text-left p-4 font-medium text-gray-300">Submitted</th>
                <th className="text-left p-4 font-medium text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-700">
                  <td className="p-4">
                    <div className="font-mono text-sm text-white">{request.id}</div>
                  </td>
                  <td className="p-4">
                    <div>
                      <div className="font-medium text-white">{request.client_name}</div>
                      <div className="text-sm text-gray-400">{request.client_email}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <div className="text-white">{request.transaction_type}</div>
                      <div className="text-sm text-gray-400 font-mono">{request.transaction_id}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-white">
                      €{request.transaction_amount.toFixed(2)}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      request.status === 'approved' ? 'bg-green-600 text-white' :
                      request.status === 'pending_review' ? 'bg-yellow-600 text-white' :
                      request.status === 'rejected' ? 'bg-red-600 text-white' :
                      request.status === 'requires_documents' ? 'bg-orange-600 text-white' :
                      'bg-gray-600 text-white'
                    }`}>
                      {request.status.replace(/_/g, ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-400">
                    {new Date(request.submitted_at).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      {request.status === 'pending_review' && (
                        <>
                          <button
                            onClick={() => handleApproval(request.id)}
                            className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejection(request.id, 'Manual review failed')}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleRequestDocuments(request.id, ['additional_proof'])}
                            className="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded text-sm"
                          >
                            Request Docs
                          </button>
                        </>
                      )}
                      <button className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm">
                        View Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredRequests.length === 0 && (
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No Manual KYC Requests</h3>
          <p className="text-gray-400">No verification requests found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

// KYC Main View Component (Router for KYC sections)
const AdminKYCManagement = ({ user }) => {
  const [kycView, setKycView] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gray-900">
      {/* KYC Navigation Tabs */}
      <div className="border-b border-gray-700 bg-gray-800">
        <div className="px-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setKycView('dashboard')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                kycView === 'dashboard'
                  ? 'border-teal-500 text-teal-400'
                  : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-300'
              }`}
            >
              KYC Dashboard
            </button>
            <button
              onClick={() => setKycView('manual')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                kycView === 'manual'
                  ? 'border-teal-500 text-teal-400'
                  : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-300'
              }`}
            >
              Manual KYC (&lt;€250)
            </button>
            <button
              onClick={() => setKycView('sumsub')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                kycView === 'sumsub'
                  ? 'border-teal-500 text-teal-400'
                  : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-300'
              }`}
            >
              Sum-Sub Integration
            </button>
            <button
              onClick={() => setKycView('applicants')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                kycView === 'applicants'
                  ? 'border-teal-500 text-teal-400'
                  : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-300'
              }`}
            >
              All Applicants
            </button>
          </nav>
        </div>
      </div>

      {/* KYC Content */}
      <div className="flex-1">
        {kycView === 'dashboard' && <AdminKYCDashboard user={user} />}
        {kycView === 'manual' && <ManualKYCManagement user={user} />}
        {kycView === 'sumsub' && <AdminKYCDashboard user={user} />}
        {kycView === 'applicants' && <AdminKYCApplicants user={user} />}
      </div>
    </div>
  );
};

// Admin Main Component
const AdminPanel = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('admin-dashboard');

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('admin_token');
    const userData = localStorage.getItem('admin_user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (loginData) => {
    setUser(loginData.user);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setUser(null);
    setIsLoggedIn(false);
    setCurrentView('admin-dashboard');
  };

  if (!isLoggedIn) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      <AdminSidebar user={user} currentView={currentView} setCurrentView={setCurrentView} />
      
      <div className="flex-1 flex flex-col">
        <AdminHeader user={user} currentView={currentView} setCurrentView={setCurrentView} onLogout={handleLogout} />
        
        <main className="flex-1">
          {currentView === 'admin-dashboard' && <AdminDashboard user={user} />}
          {currentView === 'admin-clients' && <AdminClients user={user} />}
          {currentView === 'admin-tickets' && <AdminTickets user={user} />}
          {currentView === 'admin-kyc' && <AdminKYCManagement user={user} />}
          {/* Add more admin views here */}
        </main>
      </div>
    </div>
  );
};

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
                    <span className="text-white font-bold text-xl">C</span>
                  </div>
                  <span className="ml-2 text-xl font-bold text-white">CryptoOX</span>
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
    const interval = setInterval(fetchOrderBook, 3000); // Update every 3 seconds for real-time data
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

// Footer Component
const Footer = ({ setCurrentView }) => {
  return (
    <footer className="bg-gray-800 border-t border-gray-700 py-8 mt-auto">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="ml-2 text-lg font-bold text-white">CryptoOX</span>
            </div>
            <p className="text-gray-400 text-sm">
              The next generation cryptocurrency trading platform. Trade 200+ digital assets with advanced tools and security.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-white font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => setCurrentView('trade')} className="text-gray-400 hover:text-white transition-colors">Trade</button></li>
              <li><button onClick={() => setCurrentView('markets')} className="text-gray-400 hover:text-white transition-colors">Markets</button></li>
              <li><button onClick={() => setCurrentView('portfolio')} className="text-gray-400 hover:text-white transition-colors">Portfolio</button></li>
              <li><button onClick={() => setCurrentView('wallet')} className="text-gray-400 hover:text-white transition-colors">Wallet</button></li>
            </ul>
          </div>

          {/* Support */}
          <div className="col-span-1">
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => setCurrentView('support')} className="text-gray-400 hover:text-white transition-colors">Help Center</button></li>
              <li><button onClick={() => setCurrentView('security')} className="text-gray-400 hover:text-white transition-colors">Security</button></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API Documentation</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">System Status</a></li>
            </ul>
          </div>

          {/* Company */}
          <div className="col-span-1">
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => setCurrentView('about')} className="text-gray-400 hover:text-white transition-colors">About Us</button></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 CryptoOX. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">GitHub</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// About Us Component
const AboutUs = () => {
  return (
    <div className="p-4 sm:p-6">
      <div className="bg-gray-800 rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-6">About CryptoOX</h1>

        {/* Company Overview */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Our Mission</h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            CryptoOX is a cutting-edge cryptocurrency trading platform designed to democratize access to digital assets. 
            We provide institutional-grade trading tools, advanced security measures, and an intuitive user experience 
            for both beginners and professional traders.
          </p>
        </div>

        {/* Key Features */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Why Choose CryptoOX?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <Shield className="w-6 h-6 text-teal-400 mr-2" />
                <h3 className="text-lg font-semibold text-white">Bank-Level Security</h3>
              </div>
              <p className="text-gray-300 text-sm">
                Multi-factor authentication, cold storage, and advanced encryption protect your assets 24/7.
              </p>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <TrendingUp className="w-6 h-6 text-teal-400 mr-2" />
                <h3 className="text-lg font-semibold text-white">Advanced Trading</h3>
              </div>
              <p className="text-gray-300 text-sm">
                Professional charts, real-time data, and sophisticated order types for optimal trading.
              </p>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <Globe className="w-6 h-6 text-teal-400 mr-2" />
                <h3 className="text-lg font-semibold text-white">Global Access</h3>
              </div>
              <p className="text-gray-300 text-sm">
                Trade 200+ cryptocurrencies with multiple fiat currencies and payment methods worldwide.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gray-700 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-white mb-6">Contact Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Corporate Office */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Corporate Headquarters</h3>
              <div className="space-y-3 text-gray-300">
                <div className="flex items-start">
                  <div className="w-5 h-5 text-teal-400 mr-3 mt-0.5">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">CryptoOX Inc.</p>
                    <p>123 Blockchain Avenue</p>
                    <p>Crypto City, CC 10001</p>
                    <p>United States</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-teal-400 mr-3" />
                  <a href="mailto:contact@cryptoox.com" className="text-teal-400 hover:text-teal-300">
                    contact@cryptoox.com
                  </a>
                </div>

                <div className="flex items-center">
                  <div className="w-5 h-5 text-teal-400 mr-3">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </div>
                  <a href="tel:+1-555-CRYPTO-1" className="text-teal-400 hover:text-teal-300">
                    +1 (555) CRYPTO-1
                  </a>
                </div>
              </div>
            </div>

            {/* Support & Business Hours */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Customer Support</h3>
              <div className="space-y-3 text-gray-300">
                <div>
                  <p className="font-medium text-white">24/7 Live Support</p>
                  <p className="text-sm">Available through our platform chat system</p>
                </div>

                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-teal-400 mr-3" />
                  <a href="mailto:support@cryptoox.com" className="text-teal-400 hover:text-teal-300">
                    support@cryptoox.com
                  </a>
                </div>

                <div>
                  <p className="font-medium text-white">Business Inquiries</p>
                  <a href="mailto:business@cryptoox.com" className="text-teal-400 hover:text-teal-300">
                    business@cryptoox.com
                  </a>
                </div>

                <div>
                  <p className="font-medium text-white">Press & Media</p>
                  <a href="mailto:press@cryptoox.com" className="text-teal-400 hover:text-teal-300">
                    press@cryptoox.com
                  </a>
                </div>

                <div>
                  <p className="font-medium text-white">Emergency Security Issues</p>
                  <a href="mailto:security@cryptoox.com" className="text-teal-400 hover:text-teal-300 text-sm">
                    security@cryptoox.com
                  </a>
                  <p className="text-sm text-yellow-400">Report security vulnerabilities responsibly</p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Contact Methods */}
          <div className="border-t border-gray-600 mt-8 pt-6">
            <h3 className="text-lg font-semibold text-white mb-4">Connect With Us</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-600 rounded-lg">
                <div className="text-teal-400 mb-2">
                  <svg className="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </div>
                <p className="text-white font-medium">Twitter</p>
                <a href="#" className="text-teal-400 text-sm hover:text-teal-300">@CryptoOX</a>
              </div>

              <div className="text-center p-4 bg-gray-600 rounded-lg">
                <div className="text-teal-400 mb-2">
                  <svg className="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </div>
                <p className="text-white font-medium">LinkedIn</p>
                <a href="#" className="text-teal-400 text-sm hover:text-teal-300">CryptoOX Official</a>
              </div>

              <div className="text-center p-4 bg-gray-600 rounded-lg">
                <div className="text-teal-400 mb-2">
                  <svg className="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.221.085.343-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.742 2.852c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.624 0 11.99-5.367 11.99-11.989C24.007 5.367 18.641.001 12.017.001z"/>
                  </svg>
                </div>
                <p className="text-white font-medium">Discord</p>
                <a href="#" className="text-teal-400 text-sm hover:text-teal-300">Join Community</a>
              </div>
            </div>
          </div>
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
  TradingForm,
  ProfileSettings,
  WalletPage,
  SecurityPage,
  SupportPage,
  DepositPage,
  WithdrawPage,
  Footer,
  AboutUs,
  AdminPanel,
  AdminLogin,
  AdminHeader,
  AdminSidebar,
  AdminDashboard,
  AdminClients,
  AdminTickets,
  AdminKYCDashboard,
  AdminKYCApplicants,
  AdminKYCApplicantDetail,
  ManualKYCManagement,
  AdminKYCManagement
};

export default Components;