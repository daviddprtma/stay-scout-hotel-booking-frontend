import React from "react";
import { useNavigate, NavLink } from "react-router-dom";
import ApiService from "../../service/ApiService";

function Navbar() {
  const isAuthenticated = ApiService.isAuthenticated();
  const isCustomer = ApiService.isCustomer();
  const isAdmin = ApiService.isAdmin();

  const navigate = useNavigate();

  const handleLogout = () => {
    const isLogout = window.confirm("Are you sure you want to logout?");
    if (isLogout) {
      ApiService.logout();
      navigate("/home");
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <NavLink to="/home">StayScout Hotel</NavLink>
      </div>
      <ul className="navbar-ul">
        <li>
          <NavLink to="/home" activeclassname="active">
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/rooms">Rooms</NavLink>
        </li>
        <li>
          <NavLink to="/find-bookings">Find My Bookings</NavLink>
        </li>
        {isCustomer && (
          <li>
            <NavLink to="/profile">Profile</NavLink>
          </li>
        )}
        {isAdmin && (
          <li>
            <NavLink to="/admin">Admin</NavLink>
          </li>
        )}
        {/* login button */}
        {!isAuthenticated && (
          <li>
            <NavLink to="/login">Login</NavLink>
          </li>
        )}
        {/* register button */}
        {!isAuthenticated && (
          <li>
            <NavLink to="/register">Register</NavLink>
          </li>
        )}
        {/* logout button */}
        {isAuthenticated && (
          <li>
            <button onClick={handleLogout}>Logout</button>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
