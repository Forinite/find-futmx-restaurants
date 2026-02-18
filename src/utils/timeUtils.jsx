// src/utils/timeUtils.jsx:1

export function isRestaurantOpen(restaurant, selectedTime = null) {
    const now = selectedTime ? new Date(selectedTime) : new Date();

    const day = now.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
    const hours = restaurant.openHours[day];

    if (!hours) return false;

    const [open, close] = hours;

    const currentTime = now.toTimeString().slice(0, 5);

    return currentTime >= open && currentTime <= close;
}
