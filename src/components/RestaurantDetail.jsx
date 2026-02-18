import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { restaurants } from "../data/restaurants";
import { calculateDistance } from "../utils/distance";
import SpecificMap from "./SpecificMap";
import "./RestaurantDetail.css";

export default function RestaurantDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [userLocation, setUserLocation] = useState(null);
    const [distanceKm, setDistanceKm] = useState(null);

    const restaurant = restaurants.find((r) => r.id === Number(id));

    // 1. Get User Location
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error) => console.error("Error getting location:", error)
            );
        }
    }, []);

    // 2. Calculate Distance
    useEffect(() => {
        if (userLocation && restaurant) {
            const dist = calculateDistance(userLocation, restaurant);
            setDistanceKm(dist);
        }
    }, [userLocation, restaurant]);

    if (!restaurant) return <div className="loading-state">Restaurant not found</div>;

    const handleCall = () => {
        if (restaurant.phone) window.location.href = `tel:${restaurant.phone}`;
    };

    const handleDirections = () => {
        const encodedAddress = encodeURIComponent(restaurant.address);
        window.open(`https://maps.google.com/?q=${encodedAddress}`, "_blank");
    };

    const heroImage = restaurant.images?.length > 0 ? restaurant.images[0] : null;

    return (
        <div className="restaurant-page">
            {/* --- Hero Section --- */}
            <div
                className="hero-section"
                style={heroImage ? { backgroundImage: `url(${heroImage})` } : { backgroundColor: '#333' }}
            >
                <div className="hero-overlay">
                    <button onClick={() => navigate(-1)} className="back-btn">
                        ← Back
                    </button>
                    <div className="hero-content">
                        <span className="hero-tag">{restaurant.cuisine}</span>
                        <h1>{restaurant.name}</h1>
                        <div className="hero-meta">
                            <span className="rating-badge">⭐ {restaurant.rating}</span>
                            <span>• {restaurant.reviews?.length || 0} reviews</span>
                            <span className={`status-badge ${restaurant.acceptOrders ? 'open' : 'closed'}`}>
                                {restaurant.acceptOrders ? 'Open Now' : 'Closed'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="content-container">
                {/* --- Left Column --- */}
                <div className="main-content">
                    {/* Key Details Bar */}
                    <div className="details-bar">
                        <div className="detail-item">
                            <span className="label">Distance</span>
                            <span className="value">
                                {distanceKm ? `${distanceKm} km` : "Calculating..."}
                            </span>
                        </div>
                        <div className="detail-item">
                            <span className="label">Preparation</span>
                            <span className="value">~20-30 min</span>
                        </div>
                        <div className="detail-item">
                            <span className="label">Delivery</span>
                            <span className="value">{restaurant.acceptOrders ? "Available" : "Unavailable"}</span>
                        </div>
                    </div>

                    <section className="section">
                        <h2>About</h2>
                        <p className="description">{restaurant.about || "No description available for this restaurant."}</p>
                        <div className="tags-container">
                            {restaurant.tags?.map((tag, idx) => (
                                <span key={idx} className="feature-tag">{tag}</span>
                            ))}
                        </div>
                    </section>

                    {/* Image Gallery */}
                    {restaurant.images?.length > 1 && (
                        <section className="section">
                            <h2>Gallery</h2>
                            <div className="gallery-grid">
                                {restaurant.images.slice(1).map((img, idx) => (
                                    <img key={idx} src={img} alt={`Gallery ${idx}`} className="gallery-img" />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Reviews */}
                    {restaurant.reviews?.length > 0 && (
                        <section className="section">
                            <h2>Reviews</h2>
                            <div className="reviews-list">
                                {restaurant.reviews.map((rev) => (
                                    <div key={rev.id} className="review-card">
                                        <div className="review-header">
                                            <strong>{rev.user}</strong>
                                            <span className="review-stars">⭐ {rev.rating}</span>
                                        </div>
                                        <p className="review-text">{rev.comment}</p>
                                        <small className="review-date">{rev.date}</small>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* --- Right Column: Sidebar --- */}
                <aside className="sidebar">
                    <div className="sticky-wrapper">

                        {/* Action Card */}
                        <div className="action-card">
                            <h3>Contact & Location</h3>

                            {/* Address Display */}
                            <p className="contact-text">
                                📍 {restaurant.address}
                            </p>

                            {/* NEW: Phone Number Display */}
                            {restaurant.phone && (
                                <p className="contact-text phone-highlight">
                                    📞 {restaurant.phone}
                                </p>
                            )}

                            <div className="map-preview">
                                <SpecificMap restaurant={restaurant} />
                            </div>

                            <div className="action-buttons">
                                <button onClick={handleDirections} className="btn btn-primary">
                                    Get Directions
                                </button>
                                {restaurant.phone && (
                                    <button onClick={handleCall} className="btn btn-outline">
                                        Call Now
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Hours Card */}
                        <div className="hours-card">
                            <h3>Opening Hours</h3>
                            {restaurant.openHours ? (
                                <ul className="hours-list">
                                    {Object.entries(restaurant.openHours).map(([day, times]) => (
                                        <li key={day} className="hour-row">
                                            <span className="day">{day}</span>
                                            <span className="time">{times.join(" - ")}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>Hours not provided.</p>
                            )}
                        </div>

                    </div>
                </aside>
            </div>
        </div>
    );
}