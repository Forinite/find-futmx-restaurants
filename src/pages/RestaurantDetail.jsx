import React, { useState, useEffect } from 'react';
import '../assets/styles/home.css';

function RestaurantDetail({ restaurant, onBack }) {
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [restaurant.id]);

  const handleCall = () => {
    window.location.href = `tel:${restaurant.phone}`;
  };

  const handleDirections = () => {
    const encodedAddress = encodeURIComponent(restaurant.address);
    window.open(`https://maps.google.com/?q=${encodedAddress}`, '_blank');
  };

  return (
    <div className="restaurant-detail">
      <div className="detail-header">
        <button className="back-button" onClick={onBack}>←</button>
        <div className="header-image" style={{ backgroundImage: `url(${restaurant.images[0]})` }}>
          <div className="header-badges">
            <span className="cuisine-tag">{restaurant.cuisine}</span>
            {restaurant.isOpen && <span className="open-now-badge">Open Now</span>}
          </div>
          <div className="header-info">
            <h1>{restaurant.name}</h1>
            <div className="header-meta">
              <span className="rating-large">{restaurant.rating}</span>
              <span className="reviews">({restaurant.reviews})</span>
              <span className="price">{restaurant.price}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="detail-tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab ${activeTab === 'menu' ? 'active' : ''}`}
          onClick={() => setActiveTab('menu')}
        >
          Menu
        </button>
        <button 
          className={`tab ${activeTab === 'location' ? 'active' : ''}`}
          onClick={() => setActiveTab('location')}
        >
          Location
        </button>
        <button 
          className={`tab ${activeTab === 'contact' ? 'active' : ''}`}
          onClick={() => setActiveTab('contact')}
        >
          Contact
        </button>
      </div>

      <div className="detail-content">
        {activeTab === 'overview' && (
          <>
            <div className="section">
              <h2>About</h2>
              <p>{restaurant.about}</p>
            </div>
            
            <div className="section">
              <h2>Opening Hours</h2>
              <p>{restaurant.hours}</p>
            </div>

            <div className="section">
              <h2>Features</h2>
              <div className="features-grid">
                {restaurant.tags.map((tag, idx) => (
                  <span key={idx} className="feature-tag">{tag}</span>
                ))}
                <span className="feature-tag">Delivery</span>
                <span className="feature-tag">Takeout</span>
              </div>
            </div>
          </>
        )}

        {activeTab === 'menu' && (
          <div className="section">
            <h2>Menu</h2>
            <p>Menu items will be displayed here</p>
          </div>
        )}

        {activeTab === 'location' && (
          <div className="section">
            <h2>Location</h2>
            <p>{restaurant.address}</p>
            <p>{restaurant.distance} away</p>
            <div className="map-placeholder">
              <p>Map View</p>
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="section">
            <h2>Contact</h2>
            <p>Phone: {restaurant.phone}</p>
            <p>Email: info@{restaurant.name.toLowerCase().replace(' ', '')}.com</p>
          </div>
        )}
      </div>

      <div className="detail-actions">
        <button className="action-btn call" onClick={handleCall}>Call</button>
        <button className="action-btn directions" onClick={handleDirections}>Directions</button>
      </div>
    </div>
  );
}

export default RestaurantDetail;