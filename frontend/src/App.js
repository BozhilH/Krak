import React, { useState, useEffect } from 'react';
import './App.css';

// Simple test component first
function SimpleTest() {
  return (
    <div className="p-8 bg-gray-900 text-white min-h-screen">
      <h1 className="text-4xl font-bold text-purple-400">Kraken Exchange Clone</h1>
      <p className="text-xl mt-4">Loading cryptocurrency exchange...</p>
    </div>
  );
}

function App() {
  return <SimpleTest />;
}

export default App;