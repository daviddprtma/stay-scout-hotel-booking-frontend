import React from "react";
import ApiService from "../../service/ApiService";
import { useNavigate } from "react-router-dom";

const RoomResult = ({ roomSearchResult = [], handleSearchResult }) => {
  const navigate = useNavigate();
  const isAdmin = ApiService.isAdmin();
  const rooms = roomSearchResult ?? handleSearchResult ?? [];

  return (
    <section className="room-results">
      <div className="room-list">
        {rooms.map((room) => (
          <div key={room.id} className="room-list-item">
            <img
              src={room.imageUrl}
              alt={room.roomNumber}
              className="room-list-item-image"
            />
            <div className="room-details">
              <h3>{room.type}</h3>
              <p>Price: IDR {room.pricePerNight?.toLocaleString('id-ID')} / Night</p>
              <p>Description: {room.description}</p>
            </div>

            <div className="book-now-div">
              {isAdmin ? (
                <button
                  className="edit-room-button"
                  onClick={() => navigate(`/admin/edit-room/${room.id}`)}
                >
                  Edit Rooms
                </button>
              ) : (
                <button
                  className="book-now-button"
                  onClick={() => navigate(`/room-details/${room.id}`)}
                >
                  View / Book Room
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RoomResult;
