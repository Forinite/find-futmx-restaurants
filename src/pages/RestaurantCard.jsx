import React, { useState } from 'react';
import '../assets/styles/home.css';

function RestaurantCard({ restaurant, onClick }) {
  const [currentImage, setCurrentImage] = useState(0);

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImage((prev) => (prev + 1) % restaurant.images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImage((prev) => (prev - 1 + restaurant.images.length) % restaurant.images.length);
  };

  const handleViewDetails = () => {
    window.scrollTo(0, 0);
    onClick();
  };

  return (
    <div className="restaurant-card">
      <div className="card">
        <div className="card-img">
          <div className="image-carousel">
            <div 
              className="carousel-image" 
              style={{ backgroundImage: `url(${restaurant.images[currentImage]})` }}
            >
              <div className='row-1'>
                {restaurant.isOpen && <span className='open-badge'>Open</span>}
                <button className="carousel-nav prev" onClick={prevImage}>‹</button>
                <button className="carousel-nav next" onClick={nextImage}>›</button>
              </div>
              <div className='row-2'>
                <span className='cuisine-badge'>{restaurant.cuisine}</span>
                <span className='price-badge'>{restaurant.price}</span>
              </div>
            </div>
            <div className="carousel-dots">
              {restaurant.images.map((_, idx) => (
                <span 
                  key={idx} 
                  className={`dot ${idx === currentImage ? 'active' : ''}`}
                />
              ))}
            </div>
          </div>
        </div>
        
        <div className="card-info">
          <div className="info-header">
            <h3 className='restaurant-name'>{restaurant.name}</h3>
            <span className='rating'>{restaurant.rating}</span>
          </div>
          
          <div className="info-location">
            <span className='address'>{restaurant.address}</span>
            <span className='dot'>•</span>
            <span className='distance'>{restaurant.distance}</span>
          </div>
          
          <div className="info-tags">
            {restaurant.tags.map((tag, idx) => (
              <span key={idx} className={`tag ${tag.toLowerCase().replace(' ', '-')}`}>
                {tag}
              </span>
            ))}
            <span className='tag time-tag'>{restaurant.deliveryTime}</span>
          </div>
          
          <div className="info-footer">
            <button className='view-details' onClick={handleViewDetails}>View Details</button>
            <div className="image-placeholders">
              {restaurant.images.slice(1, 3).map((img, idx) => (
                <div 
                  key={idx} 
                  className='placeholder'
                  style={{ backgroundImage: `url(${img})` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RestaurantCard;