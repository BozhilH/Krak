import React, { useState, useEffect } from 'react';
import './App.css';
import Components from './components';

const {
  Header,
  Dashboard,
  TradingInterface,
  MarketData,
  Portfolio,
  OrderBook,
  TradingForm
} = Components;

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedPair, setSelectedPair] = useState('BTCUSD');
  const [marketData, setMarketData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMarketData();
    const interval = setInterval(fetchMarketData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchMarketData = async () => {
    try {
      setLoading(true);
      // Use our backend market-summary endpoint
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
      const response = await fetch(`${backendUrl}/api/market-summary`);
      
      if (response.ok) {
        const data = await response.json();
        setMarketData(data);
      } else {
        throw new Error(`Backend API failed: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching market data from backend, falling back to direct Kraken API:', error);
      
      // Fallback to direct Kraken API calls if backend fails
      try {
        const pairs = ['BTCUSD', 'ETHUSD', 'XRPUSD', 'ADAUSD', 'DOTUSD', 'LINKUSD'];
        const responses = await Promise.all(
          pairs.map(pair => 
            fetch(`https://api.kraken.com/0/public/Ticker?pair=${pair}`)
              .then(res => res.json())
              .catch(() => null)
          )
        );

        const newMarketData = {};
        responses.forEach((response, index) => {
          if (response && response.result) {
            const pairKey = Object.keys(response.result)[0];
            if (pairKey) {
              newMarketData[pairs[index]] = response.result[pairKey];
            }
          }
        });

        setMarketData(newMarketData);
      } catch (fallbackError) {
        console.error('Fallback API also failed:', fallbackError);
        // Set mock data as last resort
        setMarketData({
          'BTCUSD': {
            c: ['45000.00', '1.50000000'],
            h: ['46500.00', '46500.00'],
            l: ['44000.00', '44000.00'],
            o: '44800.00',
            p: ['45200.00', '45150.00'],
            t: [150, 300],
            v: ['125.50000000', '200.75000000']
          },
          'ETHUSD': {
            c: ['2800.00', '5.25000000'],
            h: ['2950.00', '2950.00'],
            l: ['2700.00', '2700.00'],
            o: '2750.00',
            p: ['2825.00', '2810.00'],
            t: [200, 450],
            v: ['800.50000000', '1200.75000000']
          }
        });
      }
    }
    setLoading(false);
  };

  return (
    <div className="App bg-gray-900 text-white min-h-screen">
      <Header 
        currentView={currentView} 
        setCurrentView={setCurrentView}
        setSelectedPair={setSelectedPair}
        marketData={marketData}
      />
      
      <main className="min-h-screen">
        {currentView === 'dashboard' && (
          <Dashboard 
            marketData={marketData}
            loading={loading}
            setCurrentView={setCurrentView}
            setSelectedPair={setSelectedPair}
          />
        )}
        
        {currentView === 'trade' && (
          <TradingInterface 
            selectedPair={selectedPair}
            marketData={marketData}
            loading={loading}
            setSelectedPair={setSelectedPair}
          />
        )}
        
        {currentView === 'markets' && (
          <MarketData 
            marketData={marketData}
            loading={loading}
            setSelectedPair={setSelectedPair}
            setCurrentView={setCurrentView}
          />
        )}
        
        {currentView === 'portfolio' && (
          <Portfolio 
            marketData={marketData}
          />
        )}
      </main>
    </div>
  );
}

export default App;