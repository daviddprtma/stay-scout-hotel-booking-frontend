import React, { useState } from "react";
import RoomResult from "../common/RoomResult";
import RoomSearch from "../common/RoomSearch";

const HomePage = () => {
  const [roomSearchResult, setRoomSearchResult] = useState([]);

  // handle search result from RoomSearch component
  const handleSearchResult = (result) => {
    setRoomSearchResult(result);
  };

  return (
    <div className="home">
      <section>
        <header className="header-banner">
          <img src="/images/bg.jpg" alt="Hotel" className="header-image" />
          <div className="overlay"></div>
          <div className="animated-texts overlay-content">
            <h1>
              Welcome to <span className="phegon-color">Stay Scout Hotel</span>
            </h1>
            <br />
            <h3>Find your perfect stay to look at this beautiful place</h3>
          </div>
        </header>
      </section>

      <RoomSearch handleSearchResult={handleSearchResult} />
      <RoomResult roomSearchResult={roomSearchResult} />

      <h4>
        <a className="view-rooms-home" href="/rooms">
          All Rooms
        </a>
      </h4>

      <h2 className="home-services">Service at <span className="phegon-color">Stay Scout Hotel</span></h2>

      <section className="service-section">
        <div className="service-card">
          <img src="/images/ac.png" alt="Air Conditioning"/>
          <div className="service-details">
            <h3 className="service-title">Air Conditioning</h3>
            <p className="service-description">Enjoy a comfortable stay with our air-conditioned rooms, providing a cool and refreshing environment.</p>
          </div>
        </div>
        <div className="service-card">
          <img src="/images/mini-bar.png" alt="Mini Bar"/>
          <div className="service-details">
            <h3 className="service-title">Mini Bar</h3>
            <p className="service-description">Refresh yourself with our complimentary mini bar, offering a variety of beverages and snacks.</p>
          </div>
        </div>
        <div className="service-card">
          <img src="/images/parking.png" alt="Parking"/>
          <div className="service-details">
            <h3 className="service-title">Parking</h3>
            <p className="service-description">Enjoy convenient and secure parking facilities for your vehicle during your stay.</p>
          </div>
        </div>
        <div className="service-card">
          <img src="/images/wifi.png" alt="WiFi"/>
          <div className="service-details">
            <h3 className="service-title">WiFi</h3>
            <p className="service-description">Stay connected with our high-speed WiFi internet access throughout the hotel.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
