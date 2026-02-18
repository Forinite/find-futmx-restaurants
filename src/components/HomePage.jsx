//src/components/HomePage.jsx:1
import React, { useEffect, useState } from "react";
import MapComponent from "./MapComponent";
import FilterBar from "./FilterBar";
import BottomDrawer from "./BottomDrawer";
import { restaurants } from "../data/restaurants";
import { calculateDistance } from "../utils/distance";
import { isRestaurantOpen } from "../utils/timeUtils";

const HomePage = () => {
    const [userLocation, setUserLocation] = useState(null);
    const [filteredRestaurants, setFilteredRestaurants] = useState([]);

    const [minRating, setMinRating] = useState(0);
    const [maxDistance, setMaxDistance] = useState(50);
    const [showOpenNow, setShowOpenNow] = useState(false);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((pos) => {
            setUserLocation({
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
            });
        });
    }, []);

    useEffect(() => {
        if (!userLocation) return;

        const results = restaurants
            .map((r) => {
                const distance = calculateDistance(userLocation, r);
                return { ...r, distance: Number(distance) };
            })
            .filter((r) => r.rating >= minRating)
            .filter((r) => r.distance <= maxDistance)
            .filter((r) => (showOpenNow ? isRestaurantOpen(r) : true))
            .sort((a, b) => a.distance - b.distance);

        setFilteredRestaurants(results);
    }, [userLocation, minRating, maxDistance, showOpenNow]);

    return (
        <div style={{ height: "100vh", width: "100%", position: "relative" }}>
            <FilterBar
                minRating={minRating}
                setMinRating={setMinRating}
                maxDistance={maxDistance}
                setMaxDistance={setMaxDistance}
                showOpenNow={showOpenNow}
                setShowOpenNow={setShowOpenNow}
            />

            <MapComponent
                userLocation={userLocation}
                restaurants={filteredRestaurants}
            />

            <BottomDrawer restaurants={filteredRestaurants} />
        </div>
    );
};

export default HomePage;
