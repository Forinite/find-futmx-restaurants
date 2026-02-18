import {Marker} from "react-leaflet";

export function RestaurantMarker({ restaurant, userLocation, onClick }) {
    const distance = calculateDistance(userLocation, restaurant);

    return (
        <>
            {/* Invisible marker just for the rings + positioning */}
            <Marker
                position={[restaurant.lat, restaurant.lng]}
                icon={L.divIcon({
                    className: '',                    // no default styling
                    html: '',                         // empty — we use children below
                    iconSize: [0, 0],                 // zero size — acts as anchor point
                    iconAnchor: [0, 0],
                    pane: 'restaurant-rings-pane',    // rings go in custom low pane
                })}
            >
                {/* Rings are positioned relative to this marker's location */}
                <div
                    className="pulse-rings-wrapper"
                >
                    <div className="pulse-ring outer" />
                    <div className="pulse-ring inner" />
                </div>
            </Marker>

            {/* Visible icon marker — on default markerPane (higher z-index) */}
            <Marker
                position={[restaurant.lat, restaurant.lng]}
                icon={L.divIcon({
                    className: 'restaurant-icon-wrapper',
                    html: `
            <img
              src="https://cdn-icons-png.flaticon.com/512/3075/3075977.png"
              alt="${restaurant.name}"
              style="width:35px; height:35px; display:block;"
            />
          `,
                    iconSize: [15, 15],
                    iconAnchor: [17.5, 17.5],   // center
                    popupAnchor: [0, -20],
                })}
                eventHandlers={{ click: () => onClick(restaurant) }}
            >
                <Popup>
                    <strong>{restaurant.name}</strong><br />
                    {distance} km away<br />
                    Click marker to show route
                </Popup>
            </Marker>
        </>
    );
}