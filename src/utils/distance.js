// src/utils/distance.js:1

import { point } from "@turf/helpers";
import distance from "@turf/distance";

export function calculateDistance(user, restaurant) {
    const from = point([user.lng, user.lat]);
    const to = point([restaurant.lng, restaurant.lat]);

    return distance(from, to, { units: "kilometers" }).toFixed(2);
}
