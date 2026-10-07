import React, { useState, useEffect } from "react";
import ApiService from "../../service/ApiService";
import { useNavigate, useParams } from "react-router-dom";
import { DayPicker } from "react-day-picker";

const ONE_DAY = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds

// backend bisa mengirim imageUrl sebagai string atau array
const getImageUrl = (room) => {
  const image = Array.isArray(room?.imageUrl)
    ? room.imageUrl[0]
    : room?.imageUrl;
  return image ?? "";
};

// backend butuh yyyy-MM-dd, bukan locale string
const toApiDate = (date) => {
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
};

const RoomDetailsPage = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();

  // state management
  const [room, setRoom] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalDaysToStay, setTotalDaysToStay] = useState(0);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showBookingPreview, setShowBookingPreview] = useState(false);
  const [showMessge, setShowMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // fetch room details

  useEffect(() => {
    const fetchRoomDetails = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        // getRoomById sudah mengembalikan object room-nya
        const result = await ApiService.getRoomById(roomId);
        if (result) {
          setRoom(result);
        } else {
          setErrorMessage("Room not found.");
        }
      } catch (error) {
        console.error("Error fetching room details:", error);
        setErrorMessage(
          error.response?.data?.message ||
            "An error occurred while loading the room details.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoomDetails();
  }, [roomId]);

  //   calculate total price
  const calculateTotalPrice = () => {
    if (!checkInDate || !checkOutDate) {
      return { totalDays: 0, totalPrice: 0 };
    }
    const totalDays = Math.round(
      Math.abs((checkOutDate.getTime() - checkInDate.getTime()) / ONE_DAY),
    );
    return { totalDays, totalPrice: (room?.pricePerNight ?? 0) * totalDays };
  };

  //   handle booking confirmation
  const handleBookingConfirmation = () => {
    if (!checkInDate || !checkOutDate) {
      setErrorMessage("Please select both check-in and check-out dates.");
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }

    const { totalDays, totalPrice: price } = calculateTotalPrice();
    setTotalDaysToStay(totalDays);
    setTotalPrice(price);
    setShowBookingPreview(true);
  };

  const acceptBooking = async () => {
    try {
      const booking = {
        checkInDate: toApiDate(checkInDate),
        checkOutDate: toApiDate(checkOutDate),
        roomId: room.id,
      };

      // axios throw kalau status bukan 2xx, jadi sampai sini berarti sukses
      const response = await ApiService.bookRoom(booking);
      setShowBookingPreview(false);
      setShowMessage(
        response?.message ||
          "Booking successful!. An email of your booking details has been sent to your email. Please proceed for the payment",
      );
      setTimeout(() => {
        setShowMessage(null);
        navigate("/rooms");
      }, 8000);
    } catch (error) {
      console.error("Error booking room:", error);
      setErrorMessage(
        error.response?.data?.message ||
          "An error occurred while booking the room.",
      );
      setTimeout(() => setErrorMessage(null), 5000);
    }
  };

  //   loading & error state
  if (isLoading) {
    return <div>Loading room details...</div>;
  }

  if (!room) {
    return (
      <div className="room-details-booking">
        <p className="booking-error-message">
          {errorMessage || "Room not found."}
        </p>
        <button onClick={() => navigate("/rooms")}>Back to Rooms</button>
      </div>
    );
  }

  const { roomNumber, pricePerNight, capacity, description } = room;
  const type = room.roomType ?? room.type;

  return (
    <div className="room-details-booking">
      {/* success and error message */}
      {showMessge && <p className="booking-success-message">{showMessge}</p>}
      {errorMessage && <p className="booking-error-message">{errorMessage}</p>}
      {/* room details */}
      <h2>Room Details</h2>
      <img src={getImageUrl(room)} alt={type} className="room-details-image" />
      <div className="room-details-info">
        <h3>{type}</h3>
        <p>Room Number: {roomNumber}</p>
        <p>Price: IDR {pricePerNight?.toLocaleString("id-ID")} / Night</p>
        <p>Capacity: {capacity} people</p>
        <p>{description}</p>
      </div>
      {/* booking controls */}
      <div className="booking-info">
        <button
          className="book-now-button"
          onClick={() => setShowDatePicker(true)}
        >
          Select Date
        </button>

        {showDatePicker && (
          <div className="date-picker-container">
            <div className="date-picker">
              <label>Check-in Date:</label>
              <DayPicker
                mode="single"
                selected={checkInDate}
                onSelect={setCheckInDate}
                disabled={(date) => checkOutDate && date > checkOutDate}
              />
            </div>

            <div className="date-picker">
              <label>Check-out Date:</label>
              <DayPicker
                mode="single"
                selected={checkOutDate}
                onSelect={setCheckOutDate}
                disabled={(date) => checkInDate && date < checkInDate}
              />
            </div>

            <button
              className="confirm-booking"
              onClick={handleBookingConfirmation}
            >
              Proceed
            </button>
          </div>
        )}

        {/* booking preview & submit */}

        {showBookingPreview && (
          <div className="booking-preview">
            <h3>Booking Preview</h3>
            <p>Check-in Date: {checkInDate.toLocaleDateString("id-ID")}</p>
            <p>Check-out Date: {checkOutDate.toLocaleDateString("id-ID")}</p>
            <p>Total Days to Stay: {totalDaysToStay}</p>
            <p>Total Price: IDR {totalPrice.toLocaleString("id-ID")}</p>
            <button onClick={acceptBooking}>Confirm Booking</button>
            <button
              className="cancel-booking"
              onClick={() => setShowBookingPreview(false)}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomDetailsPage;
