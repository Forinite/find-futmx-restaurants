import React, { useState, useEffect } from 'react';
import '../assets/styles/home.css';
import BottomNav from './BottomNav';
import RestaurantCard from './RestaurantCard';
import RestaurantDetail from './RestaurantDetail';
import FilterModal from './FilterModal';
import { restaurants } from '../data/restaurants';

function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    cuisineType: 'all',
    minRating: null,
    sortBy: 'recommended',
    openNow: false,
    delivery: false,
    outdoorSeating: false,
    reservations: false
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRestaurants, setFilteredRestaurants] = useState(restaurants);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    applyFilters();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [filters, searchQuery]);

  const applyFilters = () => {
    let result = [...restaurants];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(r => 
        r.name.toLowerCase().includes(query) ||
        r.cuisine.toLowerCase().includes(query) ||
        r.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Cuisine filter
    if (filters.cuisineType !== 'all') {
      result = result.filter(r => 
        r.cuisine.toLowerCase() === filters.cuisineType.toLowerCase()
      );
    }

    // Rating filter
    if (filters.minRating) {
      result = result.filter(r => r.rating >= filters.minRating);
    }

    // Open Now filter
    if (filters.openNow) {
      result = result.filter(r => r.isOpen);
    }

    // Delivery filter
    if (filters.delivery) {
      result = result.filter(r => r.tags.includes('Delivery'));
    }

    // Outdoor Seating filter
    if (filters.outdoorSeating) {
      result = result.filter(r => r.tags.includes('Outdoor Seating'));
    }

    // Reservations filter
    if (filters.reservations) {
      result = result.filter(r => r.tags.includes('Reservations'));
    }

    // Sort
    switch (filters.sortBy) {
      case 'highest-rated':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'nearest':
        result.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
        break;
      case 'price-low':
        result.sort((a, b) => a.price.length - b.price.length);
        break;
      case 'price-high':
        result.sort((a, b) => b.price.length - a.price.length);
        break;
      default:
        // Recommended - keep default order
        break;
    }

    setFilteredRestaurants(result);
  };

  const handleFilterToggle = (filter) => {
    setFilters(prev => ({
      ...prev,
      [filter]: !prev[filter]
    }));
  };

  const handleRestaurantClick = (restaurant) => {
    setScrollPosition(window.scrollY);
    setSelectedRestaurant(restaurant);
  };

  const handleBackToHome = () => {
    setSelectedRestaurant(null);
    setTimeout(() => {
      window.scrollTo(0, scrollPosition);
    }, 0);
  };

  const handleApplyFilters = () => {
    applyFilters();
  };

  if (selectedRestaurant) {
    return (
      <>
        <RestaurantDetail 
          restaurant={selectedRestaurant} 
          onBack={handleBackToHome}
        />
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </>
    );
  }

  return (
    <>
      <header className={`home-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="logo">
          <div className="logo-icon"></div>
          <h1>FoodFinder</h1>
        </div>
      </header>
      
      <section className='home-main'>
        <div className='home-nav'>
          <h2>Discover Your Next <span className='h2-span'>Favorite Restaurant</span></h2>
          <p>Explore the best local restaurants, browse their menus, and find your perfect dining experience</p>

          <div className="box">
            <div className="input-box input-box-search">
              <input 
                type="search" 
                placeholder="Search restaurants, cuisines, or dishes..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="input-box btn-span">All Cuisines</button>
            <button className='search'>Search</button>
          </div>

          <div className="box-2">
            <button 
              className={`box-2-btn ${filters.openNow ? 'active' : ''}`}
              onClick={() => handleFilterToggle('openNow')}
            >
              Open Now
            </button>
            <button 
              className={`box-2-btn ${filters.delivery ? 'active' : ''}`}
              onClick={() => handleFilterToggle('delivery')}
            >
              Delivery
            </button>
            <button 
              className={`box-2-btn ${filters.outdoorSeating ? 'active' : ''}`}
              onClick={() => handleFilterToggle('outdoorSeating')}
            >
              Outdoor Seating
            </button>
            <button 
              className={`box-2-btn ${filters.reservations ? 'active' : ''}`}
              onClick={() => handleFilterToggle('reservations')}
            >
              Reservations
            </button>
          </div>
        </div>
        
        <section className="restaurant-cont">
          <div className="restaurant-nav">
            <div>
              <h2>Restaurants Near You</h2>
              <p className="restaurant-count">{filteredRestaurants.length} restaurants found</p>
            </div>
            <button 
              className="filter-btn"
              onClick={() => setIsFilterModalOpen(true)}
            >
              Filters
            </button>
          </div>
          
          <div className="restaurant-list">
            {filteredRestaurants.map(restaurant => (
              <RestaurantCard 
                key={restaurant.id} 
                restaurant={restaurant}
                onClick={() => handleRestaurantClick(restaurant)}
              />
            ))}
          </div>
        </section>
      </section>

      <FilterModal 
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={filters}
        setFilters={setFilters}
        onApplyFilters={handleApplyFilters}
      />

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </>
  );
}

export default Home;