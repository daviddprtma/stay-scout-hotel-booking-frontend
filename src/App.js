import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./component/common/Navbar";
import Footer from "./component/common/Footer";
import RegisterPage from "./component/auth/Register";
import LoginPage from "./component/auth/Login";
import HomePage from "./component/home/HomePage";
import AllRoomsPage from "./component/booking_rooms/AllRoomsPage";
import RoomDetailsPage from "./component/booking_rooms/RoomDetailsPage";
import { CustomerRouter } from "./service/Guard";
import FindBookingPage from "./component/booking_rooms/FindBookingPage";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <div className="content">
          <Routes>
            {/* register page */}
            <Route path="/register" element={<RegisterPage />} />
            {/* login page */}
            <Route path="/login" element={<LoginPage />} />
            {/* Home page */}
            <Route exact path="/home" element={<HomePage />} />
            {/* Rooms page */}
            <Route path="/rooms" element={<AllRoomsPage />} />
            {/* find booking */}
            <Route path="/find-bookings" element={<FindBookingPage />} />
            {/* room details */}
            <Route path="/room-details/:roomId" element={<CustomerRouter element={<RoomDetailsPage />} />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
