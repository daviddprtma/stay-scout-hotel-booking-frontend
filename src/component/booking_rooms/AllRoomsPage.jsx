import React, { useState, useEffect } from "react";
import ApiService from "../../service/ApiService";
import Pagination from "../common/Pagination";
import RoomResult from "../common/RoomResult";
import RoomSearch from "../common/RoomSearch";

const AllRoomsPage = () => {
  const [room, setRoom] = useState([]);
  const [filteredRooms, setFiltersRoom] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [selectedRoomType, setSelectedRoomType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [roomsPerPage, setRoomsPerPage] = useState(5);

  const getRoomTypeLabel = (type) =>
    typeof type === "string"
      ? type
      : (type?.name ?? type?.roomType ?? type?.type ?? type?.label ?? "");

  const handleSearchResults = (results) => {
    const rooms = Array.isArray(results) ? results : [];
    setRoom(rooms);
    setFiltersRoom(rooms);
  };

  useEffect(() => {
    // get all rooms
    const fetchRooms = async () => {
      try {
        const response = await ApiService.getAllRooms();
        const rooms = Array.isArray(response) ? response : [];
        setRoom(rooms);
        setFiltersRoom(rooms);
      } catch (error) {
        console.error("Error fetching rooms:", error);
        setRoom([]);
        setFiltersRoom([]);
      }
    };

    // get room types
    const fetchRoomTypes = async () => {
      try {
        const response = await ApiService.getRoomTypes();
        setRoomTypes(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error("Error fetching room types:", error);
        setRoomTypes([]);
      }
    };

    fetchRooms();
    fetchRoomTypes();
  }, []);

  // handle changes to room type
  const handleRoomTypeChange = (event) => {
    const selectedType = event.target.value;
    setSelectedRoomType(selectedType);
    filterRoom(selectedType);
  };

  // filter rooms by type
  const filterRoom = (type) => {
    if (type === "") {
      setFiltersRoom(room);
    } else {
      const rooms = Array.isArray(room) ? room : [];
      setFiltersRoom(
        rooms.filter((roomItem) => (roomItem.roomType ?? roomItem.type) === type),
      );
    }
    setCurrentPage(1); // Reset to the first page when filtering
  };

  // pagination
  const rooms = Array.isArray(filteredRooms) ? filteredRooms : [];
  const idxOfLastRoom = currentPage * roomsPerPage;
  const idxOfFirstRoom = idxOfLastRoom - roomsPerPage;
  const currentRooms = rooms.slice(idxOfFirstRoom, idxOfLastRoom);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="all-rooms">
      <h2>All Rooms</h2>

      <div className="all-room-filter-div">
        <label>Filter By Room Type</label>
        <select value={selectedRoomType} onChange={handleRoomTypeChange}>
          <option value="">All Types</option>
          {roomTypes.map((type) => (
            <option key={getRoomTypeLabel(type)} value={getRoomTypeLabel(type)}>
              {getRoomTypeLabel(type)}
            </option>
          ))}
        </select>
      </div>

      <RoomSearch handleSearchResult={handleSearchResults} />
      <RoomResult roomSearchResult={currentRooms} />

      <Pagination roomPerPage={roomsPerPage} totalRooms={rooms.length} paginate={paginate} currentPage={currentPage} />
    </div>
  );
};

export default AllRoomsPage;
