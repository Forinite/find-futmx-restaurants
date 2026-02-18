import React from "react";
import "./FilterBar.css";

export default function FilterBar({
                                      minRating,
                                      setMinRating,
                                      maxDistance,
                                      setMaxDistance,
                                      showOpenNow,
                                      setShowOpenNow,
                                  }) {
    const ratingOptions = [0, 3, 4, 4.5];
    const distanceOptions = [50, 1, 2, 3];

    const formatRating = (value) =>
        value === 0 ? "Rating: All" : `Rating: ${value}+`;

    const formatDistance = (value) =>
        value === 50 ? "Distance: Any" : `Distance: ${value} km`;

    return (
        <div className="filter-bar">
            {/* Rating */}
            <div className="select-wrapper">
                <select
                    value={minRating}
                    onChange={(e) => setMinRating(Number(e.target.value))}
                >
                    {ratingOptions.map((rating) => (
                        <option key={rating} value={rating}>
                            {formatRating(rating)}
                        </option>
                    ))}
                </select>
            </div>

            {/* Distance */}
            <div className="select-wrapper">
                <select
                    value={maxDistance}
                    onChange={(e) => setMaxDistance(Number(e.target.value))}
                >
                    {distanceOptions.map((distance) => (
                        <option key={distance} value={distance}>
                            {formatDistance(distance)}
                        </option>
                    ))}
                </select>
            </div>

            {/* Open Now */}
            <button
                className={`filter-button ${showOpenNow ? "active" : ""}`}
                onClick={() => setShowOpenNow(!showOpenNow)}
            >
                Open Now
            </button>
        </div>
    );
}
