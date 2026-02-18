// src/components/SpecificMap.jsx:1

import { useEffect, useState } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    Polyline,
    useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icons
delete (L.Icon.Default.prototype)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Optional custom icon (reuse yours if you want)
const restaurantIcon = L.divIcon({
    className: "restaurant-marker-container",
    html: `
    <div class="pulse-ring outer"></div>
    <div class="pulse-ring inner"></div>
    <img 
      src="https://cdn-icons-png.flaticon.com/512/3075/3075977.png" 
      alt="restaurant" 
      style="width:35px; height:35px; position:relative; z-index:9990;"
    />
  `,
    iconSize: [60, 60],
    iconAnchor: [30, 30],
    popupAnchor: [0, -20],
});

function FitBounds({ points }) {
    const map = useMap();

    useEffect(() => {
        if (points.length > 0) {
            map.fitBounds(points, { padding: [50, 50] });
        }
    }, [points, map]);

    return null;
}


export default function SpecificMap({ restaurant }) {
    const [userLocation, setUserLocation] = useState(null);

    const [routeCoords, setRouteCoords] = useState([]);

    // Get user location
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setUserLocation({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                });
            },
            (err) => {
                console.error(err);
                alert("Location permission denied.");
            },
            { enableHighAccuracy: true }
        );
    }, []);

    // Fetch route automatically
    useEffect(() => {
        async function fetchRoute() {
            if (!userLocation) return;

            const url = `https://router.project-osrm.org/route/v1/driving/${userLocation.lng},${userLocation.lat};${restaurant.lng},${restaurant.lat}?overview=full&geometries=geojson`;

            const response = await fetch(url);
            const data = await response.json();

            const coordinates = data.routes[0].geometry.coordinates.map(
                (coord) => [coord[1], coord[0]]
            );

            setRouteCoords(coordinates);
        }

        fetchRoute();
    }, [userLocation, restaurant]);

    if (!userLocation) return <p>Getting your location...</p>;

    const allPoints = [
        [userLocation.lat, userLocation.lng],
        [restaurant.lat, restaurant.lng],
        ...routeCoords,
    ];

    return (
        <MapContainer
            center={[userLocation.lat, userLocation.lng]}
            zoom={14}
            style={{ height: "100%", width: "100%" }}
        >
            <TileLayer
                attribution="© OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <FitBounds points={allPoints} />

            {/* User Marker */}
            <Marker position={[userLocation.lat, userLocation.lng]}>
                <Popup>You are here</Popup>
            </Marker>

            {/* Restaurant Marker */}
            <Marker
                position={[restaurant.lat, restaurant.lng]}
                icon={restaurantIcon}
            >
                <Popup>
                    <strong>{restaurant.name}</strong>
                </Popup>
            </Marker>

            {/* Route visible by default */}
            {routeCoords.length > 0 && (
                <Polyline positions={routeCoords} color="red" />
            )}
        </MapContainer>
    );
}
