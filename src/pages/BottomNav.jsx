import React from 'react';
import '../assets/styles/home.css';

function BottomNav({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'search', label: 'Search', icon: '🔍' },
    { id: 'map', label: 'Map', icon: '🗺️' },
    { id: 'favorites', label: 'Favorites', icon: '❤️' },
    { id: 'profile', label: 'Profile', icon: '👤' }
  ];

  return (
    <nav className="bottom-nav">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => setActiveTab(tab.id)}
        >
          <span className="nav-icon">{tab.icon}</span>
          <span className="nav-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}

export default BottomNav;