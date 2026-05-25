import React, { useState, useEffect, useRef } from "react";
import ApiService from "../../service/ApiService";
import { DayPicker } from "react-day-picker";

const RoomSearch = ({ handleSearchResult }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [roomType, setRoomType] = useState("");
  const [roomTypes, setRoomTypes] = useState([]);
  const [error, setError] = useState("");

  // state for controlling the visibility of the date picker
  const [isStartDatePickerVisible, setStartDatePickerVisible] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisible] = useState(false);

  const startDateRef = useRef(null);
  const endDateRef = useRef(null);

  useEffect(() => {
    // Fetch room types from the API
    const fetchRoomTypes = async () => {
      try {
        const response = await ApiService.getRoomTypes();
        setRoomTypes(response);
      } catch (error) {
        console.error("Error fetching room types:", error);
      }
    };
    fetchRoomTypes();
  }, []);

  const handleClickOutside = (event) => {
    if (
      startDateRef.current &&
      !startDateRef.current.contains(event.target) &&
      endDateRef.current &&
      !endDateRef.current.contains(event.target)
    ) {
      setStartDatePickerVisible(false);
      setEndDatePickerVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const showError = (message) => {
    setError(message);
    setTimeout(() => {
      setError("");
    }, 5000);
  };

  const handleInternalSearch = async () => {
    if (!startDate || !endDate || !roomType) {
      showError("Please fill in all fields.");
      return false;
    }

    try {
      const formatStartDate = startDate
        ? startDate.toLocaleDateString("en-CA")
        : null; // Format as YYYY-MM-DD
      const formatEndDate = endDate
        ? endDate.toLocaleDateString("en-CA")
        : null; // Format as YYYY-MM-DD
      const response = await ApiService.getAvailableRooms(
        formatStartDate,
        formatEndDate,
        roomType,
      );
      if (response.status === 200) {
        if (response.rooms.length === 0) {
          showError(
            "Room not currently available. Please try different dates or room type.",
          );
          return;
        }
        handleSearchResult(response.rooms);
        setError("");
      }
    } catch (error) {
      showError(error?.response?.data?.message || error.message);
    }
  };

  return (
    <section>
      <div className="search-container">
        {/* check in date */}
        <div className="search-field" style={{ position: "relative" }}>
          <label>Check-in Date</label>
          <input
            type="text"
            value={startDate ? startDate.toLocaleDateString() : ""}
            placeholder="Select check-in date"
            onFocus={() => setStartDatePickerVisible(true)}
            readOnly
          />
          {isStartDatePickerVisible && (
            <div className="datepicker-container" ref={startDateRef}>
              <DayPicker
                selected={startDate}
                onDayClick={(day) => {
                  setStartDate(day);
                  setStartDatePickerVisible(false);
                }}
                month={startDate}
              />
            </div>
          )}
        </div>

        {/* check out date */}
        <div className="search-field" style={{ position: "relative" }}>
          <label>Check-out Date</label>
          <input
            type="text"
            value={endDate ? endDate.toLocaleDateString() : ""}
            placeholder="Select check-out date"
            onFocus={() => setEndDatePickerVisible(true)}
            readOnly
          />
          {isEndDatePickerVisible && (
            <div className="datepicker-container" ref={endDateRef}>
              <DayPicker
                selected={endDate}
                onDayClick={(day) => {
                  setEndDate(day);
                  setEndDatePickerVisible(false);
                }}
                month={endDate}
              />
            </div>
          )}
        </div>

        {/* room type */}
        <div className="search-field">
          <label>Room Type</label>
          <select
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
          >
            <option disabled value="">
              Select room type
            </option>
            {roomTypes.map((type) => (
              <option key={type.id} value={type.name}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        {/* search button */}
        <button className="home-search-button" onClick={handleInternalSearch}>
          Search Room
        </button>
      </div>
      {error && <p className="error-message">{error}</p>}
    </section>
  );
};

export default RoomSearch;
