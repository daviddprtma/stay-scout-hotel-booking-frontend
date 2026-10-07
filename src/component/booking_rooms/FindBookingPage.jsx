import React, { useState } from "react";
import ApiService from "../../service/ApiService";

// backend bisa mengirim imageUrl sebagai string atau array
const getImageUrl = (room) => {
  const image = Array.isArray(room?.imageUrl)
    ? room.imageUrl[0]
    : room?.imageUrl;
  return image ?? "";
};

const FindBookingPage = () => {
  const [confirmationCode, setConfirmationCode] = useState("");
  const [bookingDetails, setBookingDetails] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!confirmationCode.trim()) {
      setError("Please enter a confirmation code.");
      setTimeout(() => setError(null), 5000);
      return;
    }

    try {
      // getBookingByReference sudah mengembalikan object booking-nya
      const result = await ApiService.getBookingByReference(confirmationCode);
      if (result) {
        setBookingDetails(result);
        setError(null);
      } else {
        setBookingDetails(null);
        setError("Booking not found. Please check your confirmation code.");
        setTimeout(() => setError(null), 5000);
      }
    } catch (error) {
      setBookingDetails(null);
      setError(error.response?.data?.message || error.message);
      setTimeout(() => setError(null), 5000);
    }
  };

  // user dan room bisa tidak disertakan backend, jadi jangan diakses langsung
  const user = bookingDetails?.user;
  const room = bookingDetails?.room;

  return (
    <div className="find-booking-page">
      <h2>Find Your Booking</h2>
      <div className="search-container">
        <input
          required
          type="text"
          placeholder="Enter your booking confirmation code"
          value={confirmationCode}
          onChange={(e) => setConfirmationCode(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {bookingDetails && (
        <div className="booking-details">
          <h3>Booking Details</h3>
          <p>
            <strong>Booking code:</strong> {bookingDetails.bookingReference}
          </p>
          <p>
            <strong>Check-in Date:</strong> {bookingDetails.checkInDate}
          </p>
          <p>
            <strong>Check-out Date:</strong> {bookingDetails.checkOutDate}
          </p>
          <p>
            <strong>Payment Status:</strong> {bookingDetails.paymentStatus}
          </p>
          <p>
            <strong>Amount:</strong> {bookingDetails.totalPrice}
          </p>
          <p>
            <strong>Booking Status:</strong> {bookingDetails.bookingStatus}
          </p>

          {user && (
            <>
              <br />
              <br />
              <br />

              <h3>Booker Details: </h3>
              <div>
                <p>First Name: {user.firstName}</p>
                <p>Last Name: {user.lastName}</p>
                <p>Email: {user.email}</p>
                <p>Phone: {user.phoneNumber}</p>
              </div>
            </>
          )}

          {room && (
            <>
              <br />
              <br />
              <br />

              <h3>Room Details: </h3>
              <div>
                <p>Room Type: {room.roomType ?? room.type}</p>
                <p>Room Number: {room.roomNumber}</p>
                <p>Room Capacity: {room.capacity}</p>
                <img
                  src={getImageUrl(room)}
                  alt={room.roomType ?? room.type}
                  width={"1000"}
                  height={"500"}
                />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default FindBookingPage;
