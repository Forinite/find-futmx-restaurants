// // src/App.jsx:1
//
// import MapComponent from "./components/MapComponent";
// import SpecificMap from "./components/SpecificMap.jsx";
// import {restaurants} from "./data/restaurants.js";
// import HomePage from "./components/HomePage.jsx";
//
// function App() {
//     return (
//         <div >
//             {/*<div style={{ height: "300px", width: "300px", overflow: "hidden" }}>*/}
//             {/*    <MapComponent />*/}
//             {/*</div>*/}
//             {/*<p>Specific</p>*/}
//             {/*<div style={{ height: "300px", width: "300px", overflow: "hidden" }}>*/}
//             {/*    <SpecificMap restaurant={restaurants[0]} />*/}
//             {/*</div>*/}
//
//             <HomePage />
//         </div>
//     )
// }
// //
// export default App;
//

import { Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import RestaurantDetail from "./components/RestaurantDetail";

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/restaurant/:id" element={<RestaurantDetail />} />
        </Routes>
    );
}
