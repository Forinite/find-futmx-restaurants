import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { calculateDistance } from "../utils/distance"; // Import your utility
import "./BottomDrawer.css";

export default function BottomDrawer({ restaurants }) {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [userLocation, setUserLocation] = useState(null);

    // Physics & DOM refs
    const drawerRef = useRef(null);
    const contentRef = useRef(null);
    const startY = useRef(0);
    const startHeight = useRef(0);
    const isDragging = useRef(false);

    // Constants for drawer heights
    const COLLAPSED_HEIGHT = 160; // Visible peek amount
    const EXPANDED_HEIGHT = window.innerHeight * 0.85;

    // 1. Get User Location
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                (err) => console.error(err)
            );
        }
    }, []);

    // 2. Calculate Distance & Sort by Nearest
    const sortedRestaurants = useMemo(() => {
        if (!userLocation) return restaurants;

        return restaurants.map((r) => {
            const dist = calculateDistance(userLocation, r);
            return { ...r, distanceCalculated: dist };
        }).sort((a, b) => parseFloat(a.distanceCalculated) - parseFloat(b.distanceCalculated));
    }, [userLocation, restaurants]);


    // --- Touch Handlers ---

    const handleTouchStart = (e) => {
        isDragging.current = true;
        startY.current = e.touches[0].clientY;
        startHeight.current = drawerRef.current.getBoundingClientRect().height;

        // Disable transition while dragging for instant feedback
        drawerRef.current.style.transition = "none";
    };

    const handleTouchMove = (e) => {
        if (!isDragging.current) return;

        const currentY = e.touches[0].clientY;
        const deltaY = startY.current - currentY; // Dragging up is positive delta
        let newHeight = startHeight.current + deltaY;

        // Clamping logic
        if (newHeight < COLLAPSED_HEIGHT) newHeight = COLLAPSED_HEIGHT;
        if (newHeight > EXPANDED_HEIGHT) newHeight = EXPANDED_HEIGHT;

        drawerRef.current.style.height = `${newHeight}px`;
    };

    const handleTouchEnd = () => {
        isDragging.current = false;
        drawerRef.current.style.transition = "height 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)";

        const currentHeight = drawerRef.current.getBoundingClientRect().height;
        const threshold = (EXPANDED_HEIGHT - COLLAPSED_HEIGHT) / 3 + COLLAPSED_HEIGHT;

        if (currentHeight > threshold) {
            drawerRef.current.style.height = `${EXPANDED_HEIGHT}px`;
            setIsOpen(true);
            // Enable scrolling inside the content when expanded
            contentRef.current.style.overflowY = "auto";
        } else {
            drawerRef.current.style.height = `${COLLAPSED_HEIGHT}px`;
            setIsOpen(false);
            // Disable scrolling when collapsed to prevent fighting with drag
            contentRef.current.style.overflowY = "hidden";
            contentRef.current.scrollTop = 0;
        }
    };

    return (
        <div
            ref={drawerRef}
            className={`bottom-drawer ${isOpen ? "open" : ""}`}
            style={{ height: `${COLLAPSED_HEIGHT}px` }}
        >
            {/* Drag Handle Area */}
            <div
                className="drawer-header"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <div className="drawer-handle-bar" />
                {!isOpen && <p className="drawer-hint">{sortedRestaurants.length} places nearby</p>}
            </div>

            {/* Scrollable Content */}
            <div className="drawer-content" ref={contentRef}>
                {sortedRestaurants.map((r) => (
                    <div
                        key={r.id}
                        className="restaurant-card"
                        onClick={() => navigate(`/restaurant/${r.id}`)}
                    >
                        {/* Image Thumbnail */}
                        <div className="card-image-wrapper">
                            {/*{r.images && r.images.length > 0 ? (*/}
                            {/*    <img src={r.images[0]} alt={r.name} />*/}
                            {/*) : (*/}
                            {/*    <div className="placeholder-img" />*/}
                            {/*)}*/}
                            <div className="placeholder-img" />

                        </div>

                        {/* Info */}
                        <div className="card-info">
                            <div className="card-top">
                                <h3 className="card-title">{r.name}</h3>
                                <span className="card-rating">
                                    ⭐ {r.rating}
                                </span>
                            </div>

                            <p className="card-cuisine">{r.cuisine} • {r.price || "$$"}</p>

                            <div className="card-footer">
                                <span className="card-distance">
                                    📍 {r.distanceCalculated ? `${r.distanceCalculated} km` : "..."}
                                </span>
                                <span className={`card-status ${r.acceptOrders ? "open" : "closed"}`}>
                                    {r.acceptOrders ? "Open" : "Closed"}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}