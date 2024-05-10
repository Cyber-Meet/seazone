import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Rooms.css';

const numberToWords = (number) => {
    const words = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];
    return words[number] || number.toString();
};

const Rooms = () => {
    const [roomsData, setRoomsData] = useState([]);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/room');
                const roomsWithWords = response.data.rooms.map(room => ({
                    ...room,
                    maxOccupancyWord: numberToWords(room.capacity)
                }));
                setRoomsData(roomsWithWords);
                console.log(roomsWithWords);
            } catch (error) {
                console.error('Error fetching rooms:', error);
            }
        };

        fetchRooms();
    }, []);

    return (
        <div>
            {roomsData.map((room, index) => (
                <div key={index} className="room-container">
                    <div className="left-section">
                        <img src={room.photo_url} alt={`Room ${index + 1}`} />
                        <img src={room.photo_url2} alt={`Room ${index + 1}`} />
                    </div>
                    <div className="right-section">
                        <div className='room-info-top'>
                            <h2>{room.roomType}</h2>
                            <p>{room.description}</p>
                        </div>
                        <div className='room-info-mid'>
                            <h3>Features</h3>
                            {Array.isArray(room.features) ? (
                                <div className='features'>
                                    <div className="features-list">
                                        <p className="feature-item">
                                            {room.features.join(', ')}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <p>{room.features}</p>
                            )}
                        </div>
                        <div className='room-info-low'>
                            <p>Bed: {room.bedType + " Size"}</p>
                            <p>Max Occupancy: {room.maxOccupancyWord}</p>
                            <p>Price: {"₹ " + room.price + "/-"}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Rooms;