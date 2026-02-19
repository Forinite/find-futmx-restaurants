import React from 'react';
import '../assets/styles/home.css';

function FilterModal({ isOpen, onClose, filters, setFilters, onApplyFilters }) {
  if (!isOpen) return null;

  const handleCuisineChange = (cuisine) => {
    setFilters(prev => ({
      ...prev,
      cuisineType: cuisine
    }));
  };

  const handleRatingChange = (rating) => {
    setFilters(prev => ({
      ...prev,
      minRating: rating
    }));
  };

  const handleSortChange = (e) => {
    setFilters(prev => ({
      ...prev,
      sortBy: e.target.value
    }));
  };

  const handleClearAll = () => {
    setFilters({
      cuisineType: 'all',
      minRating: null,
      sortBy: 'recommended',
      openNow: false,
      delivery: false,
      outdoorSeating: false,
      reservations: false
    });
  };

  const handleApply = () => {
    onApplyFilters();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Filters</h2>
          <button className="clear-all" onClick={handleClearAll}>
            Clear All
          </button>
        </div>

        <div className="modal-body">
          {/* Cuisine Type */}
          <div className="filter-section">
            <h3>Cuisine Type</h3>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="cuisine"
                  checked={filters.cuisineType === 'all'}
                  onChange={() => handleCuisineChange('all')}
                />
                <span className="radio-custom"></span>
                All Cuisines
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="cuisine"
                  checked={filters.cuisineType === 'italian'}
                  onChange={() => handleCuisineChange('italian')}
                />
                <span className="radio-custom"></span>
                Italian
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="cuisine"
                  checked={filters.cuisineType === 'japanese'}
                  onChange={() => handleCuisineChange('japanese')}
                />
                <span className="radio-custom"></span>
                Japanese
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="cuisine"
                  checked={filters.cuisineType === 'indian'}
                  onChange={() => handleCuisineChange('indian')}
                />
                <span className="radio-custom"></span>
                Indian
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="cuisine"
                  checked={filters.cuisineType === 'french'}
                  onChange={() => handleCuisineChange('french')}
                />
                <span className="radio-custom"></span>
                French
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="cuisine"
                  checked={filters.cuisineType === 'chinese'}
                  onChange={() => handleCuisineChange('chinese')}
                />
                <span className="radio-custom"></span>
                Chinese
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="cuisine"
                  checked={filters.cuisineType === 'mexican'}
                  onChange={() => handleCuisineChange('mexican')}
                />
                <span className="radio-custom"></span>
                Mexican
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="cuisine"
                  checked={filters.cuisineType === 'american'}
                  onChange={() => handleCuisineChange('american')}
                />
                <span className="radio-custom"></span>
                American
              </label>
            </div>
          </div>

          {/* Rating */}
          <div className="filter-section">
            <h3>Rating</h3>
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.minRating === 4.5}
                  onChange={() => handleRatingChange(4.5)}
                />
                <span className="checkbox-custom"></span>
                <span className="stars">★★★★★</span> 4.5 & up
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.minRating === 4.0}
                  onChange={() => handleRatingChange(4.0)}
                />
                <span className="checkbox-custom"></span>
                <span className="stars">★★★★</span> 4.0 & up
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.minRating === 3.5}
                  onChange={() => handleRatingChange(3.5)}
                />
                <span className="checkbox-custom"></span>
                <span className="stars">★★★</span> 3.5 & up
              </label>
            </div>
          </div>

          {/* Availability */}
          <div className="filter-section">
            <h3>Availability</h3>
            <div className="toggle-group">
              <label className="toggle-label">
                <span>Open Now</span>
                <div className="toggle">
                  <input
                    type="checkbox"
                    checked={filters.openNow}
                    onChange={(e) => setFilters(prev => ({ ...prev, openNow: e.target.checked }))}
                  />
                  <span className="toggle-slider"></span>
                </div>
              </label>
            </div>
          </div>

          {/* Sort By */}
          <div className="filter-section">
            <h3>Sort By</h3>
            <div className="select-wrapper">
              <select
                value={filters.sortBy}
                onChange={handleSortChange}
                className="sort-select"
              >
                <option value="recommended">Recommended</option>
                <option value="highest-rated">Highest Rated</option>
                <option value="nearest">Nearest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="apply-btn" onClick={handleApply}>
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}

export default FilterModal;