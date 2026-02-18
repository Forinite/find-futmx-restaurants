// src/components/MapComponent.jsx:1

import { useEffect, useState } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    Polyline,
    useMap
} from "react-leaflet";
import L from "leaflet";
import { restaurants } from "../data/restaurants";
import { calculateDistance } from "../utils/distance";
import "leaflet/dist/leaflet.css";

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});



const restaurantIcon = L.divIcon({
    className: "restaurant-marker-container",   // we'll style this in CSS
    html: `
    <div class="pulse-ring outer"></div>
    <div class="pulse-ring inner"></div>
    <img 
      src="https://cdn-icons-png.flaticon.com/512/3075/3075977.png" 
      alt="restaurant" 
      style="width:35px; height:35px; position:relative; z-index:9990;"
    />
  `,
    iconSize: [60, 60],     // bigger container to fit rings
    iconAnchor: [30, 30],   // center the icon (half of iconSize)
    popupAnchor: [0, -20],  // optional: adjust popup position
});

function RecenterMap({ position }) {
    const map = useMap();
    map.setView(position, 14);
    return null;
}

export default function MapComponent() {
    const [userLocation, setUserLocation] = useState(null);
    const [routeCoords, setRouteCoords] = useState([]);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const userCoords = {
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                };
                console.log("📍 Your current coordinates:", userCoords);
                console.log("Lat:", userCoords.lat.toFixed(6));
                console.log("Lng:", userCoords.lng.toFixed(6));
                setUserLocation(userCoords);
            },
            (err) => {
                console.error("Geolocation error:", err.message);
                alert("Location permission denied: " + err.message);
            },
            { enableHighAccuracy: true }   // optional: try to get more precise location
        );
    }, []);

    async function fetchRoute(destination) {
        if (!userLocation) return;

        const url = `https://router.project-osrm.org/route/v1/driving/${userLocation.lng},${userLocation.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`;

        const response = await fetch(url);
        const data = await response.json();

        const coordinates = data.routes[0].geometry.coordinates.map(
            (coord) => [coord[1], coord[0]]
        );

        setRouteCoords(coordinates);
    }

    if (!userLocation) return <p>Getting your location...</p>;

    return (
        <MapContainer
            center={[userLocation.lat, userLocation.lng]}
            zoom={14}
            style={{ height: "100%", width: "100%" , position: "relative"}}
        >

            {/*<div style={{position: "absolute", top: 1, left:20, width: "0px", height: "0px", zIndex: 1000}}>*/}
            {/*    <div style={{width: "200px", height: "50px", backgroundColor: "white", border: 'blue solid 1px', borderRadius: "5px"}}>*/}

            {/*        <div>*/}
            {/*            <p style={{fontSize: '9px'}}>{' Closest Restaurant: '}</p>*/}
            {/*        </div>*/}
            {/*        <p style={{color: 'blue'}}> {'BilkeBab'}</p>*/}
            {/*    </div>*/}
            {/*</div>*/}
            <TileLayer
                attribution='© OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <RecenterMap position={[userLocation.lat, userLocation.lng]} />

            {/* User Marker */}
            <Marker position={[userLocation.lat, userLocation.lng]}>
                <Popup>You are here</Popup>
            </Marker>


            {/* Restaurant Markers */}
            {restaurants.map((restaurant) => {
                const distance = calculateDistance(userLocation, restaurant);

                return (
                    <Marker
                        key={restaurant.id}
                        position={[restaurant.lat, restaurant.lng]}
                        icon={restaurantIcon}
                        eventHandlers={{
                            click: () => fetchRoute(restaurant),
                        }}
                    >
                        <Popup >
                            <strong>{restaurant.name}</strong>
                            <br />
                            {distance} km away
                            <br />
                            Click marker to show route
                        </Popup>
                    </Marker>
                );
            })}

            {/* Route Line */}
            {routeCoords.length > 0 && (
                <Polyline positions={routeCoords} color="red" />
            )}
        </MapContainer>
    );
}

