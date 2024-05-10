import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ViewRooms.css';  // Ensure you have the corresponding CSS file
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ViewRoom = () => {
    const [rooms, setRooms] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [roomTypeFilter, setRoomTypeFilter] = useState('');
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [updatedRoomData, setUpdatedRoomData] = useState({
        bedType: '',
        totalRooms: '',
        roomType: '',
        capacity: '',
        available: '',
        description: '',
        photo_url: '',
        photo_url2: '',
        features: [],
        price: '',
    });

    const [validationErrors, setValidationErrors] = useState({});
    //get user type from session storage
    const userType = sessionStorage.getItem('user_type');

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/room');
            setRooms(response.data.rooms); // Adjust the property based on your server response
            console.log(response.data.rooms);
        } catch (error) {
            console.error('Error fetching rooms:', error);
        }
    };

    const validateInput = () => {
        const errors = {};

        // Example validation rules (customize as needed)
        if (!updatedRoomData.bedType.trim()) {
            errors.bedType = 'Room Number is required';
        }

        if (!updatedRoomData.roomType.trim()) {
            errors.roomType = 'Room Type is required';
        }

        if (!updatedRoomData.capacity.trim()) {
            errors.capacity = 'Capacity is required';
        } else if (!/^\d+$/.test(updatedRoomData.capacity)) {
            errors.capacity = 'Only Numbers';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const filteredRooms = Array.isArray(rooms)
        ? rooms.filter((room) => {
            const searchTermMatch = room.roomType.toLowerCase().includes(searchTerm.toLowerCase());
            const roomTypeMatch = roomTypeFilter === '' || room.roomType === roomTypeFilter;

            return searchTermMatch && roomTypeMatch;
        })
        : [];

    const handleSearchTermChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleRoomTypeFilterChange = (selectedRoomType) => {
        setRoomTypeFilter(selectedRoomType);
    };

    const handleEditClick = (room) => {
        setSelectedRoom(room);
        setUpdatedRoomData({
            bedType: room.bedType,
            totalRooms: room.totalRooms,
            roomType: room.roomType,
            capacity: room.capacity,
            available: room.available,
            description: room.description || '',
            photo_url: room.photo_url || '',
            photo_url2: room.photo_url2 || '',
            features: room.features || [],
            price: room.price,
        });
        setValidationErrors({});
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedRoomData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        setValidationErrors((prevErrors) => ({
            ...prevErrors,
            [name]: '', // Clear validation error when the input changes
        }));
    };

    const handleUpdateClick = async () => {
        if (validateInput()) {
            try {
                const roomId = selectedRoom._id; // Assuming _id is the MongoDB document ID
                // Perform the update API call with updatedRoomData
                await axios.put(`http://localhost:5000/room/${roomId}`, updatedRoomData);
                toast.success('Room updated successfully', { position: toast.POSITION.BOTTOM_RIGHT });

                // Fetch updated rooms
                fetchRooms();

                // Reset selectedRoom and updatedRoomData
                setSelectedRoom(null);
                setUpdatedRoomData({
                    bedType: '',
                    totalRooms: '',
                    roomType: '',
                    capacity: '',
                    available: '',
                    description: '',
                    photo_url: '',
                    photo_url2: '',
                    features: [],
                    price: '',
                });
            } catch (error) {
                console.error('Error updating room:', error);
                toast.error('Error updating room', { position: toast.POSITION.BOTTOM_RIGHT });
            }
        }
    };

    const handleDeleteClick = async () => {
        try {
            const roomId = selectedRoom._id; // Assuming _id is the MongoDB document ID
            // Perform the delete API call
            await axios.delete(`http://localhost:5000/room/${roomId}`);
            toast.success('Room deleted successfully', { position: toast.POSITION.BOTTOM_RIGHT });

            // Fetch updated rooms
            fetchRooms();

            // Reset selectedRoom and updatedRoomData
            setSelectedRoom(null);
            setUpdatedRoomData({
                bedType: '',
                totalRooms: '',
                roomType: '',
                capacity: '',
                available: '',
                description: '',
                photo_url: '',
                photo_url2: '',
                features: [],
                price: '',
            });
        } catch (error) {
            console.error('Error deleting room:', error);
            toast.error('Error deleting room', { position: toast.POSITION.BOTTOM_RIGHT });
        }
    };

    const handleCancelClick = () => {
        setSelectedRoom(null);
        setUpdatedRoomData({
            bedType: '',
            totalRooms: '',
            roomType: '',
            capacity: '',
            available: '',
            description: '',
            photo_url: '',
            photo_url2: '',
            features: [],
            price: '',
        });
    }

    return (
        <div className="updateroom-container">
            <div className="filters">
                <input
                    type="text"
                    placeholder="Search Rooms"
                    value={searchTerm}
                    onChange={handleSearchTermChange}
                />
                <select value={roomTypeFilter} onChange={(e) => handleRoomTypeFilterChange(e.target.value)}>
                    <option value="">Select Room Type</option>
                    <option value="standard">Standard</option>
                    <option value="delux">Delux</option>
                    <option value="suite">Suite</option>
                    <option value="premium">Premium</option>
                </select>
            </div>

            <table className="table-container">
                <thead>
                    <tr>
                        <th>BedType</th>
                        <th>Total Rooms</th>
                        <th>Room Type</th>
                        <th>Capacity</th>
                        <th>Availability</th>
                        <th>Description</th>
                        {userType !== 'staff' && (
                            <>
                                <th>Photo URL 1</th>
                                <th>Photo URL 2</th>
                            </>
                        )}
                        <th>Features</th>
                        <th>Price</th>
                        {userType !== 'staff' && (
                            <>
                                <th>Actions</th>
                            </>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {filteredRooms.map((room) => (
                        <tr key={room._id}>
                            <td>{room.bedType}</td>
                            <td>{room.totalRooms}</td>
                            <td>{room.roomType}</td>
                            <td>{room.capacity}</td>
                            <td>{room.available}</td>
                            <td style={{ maxWidth: '100px', maxHeight: '60px', overflowWrap: 'break-word', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {room.description}</td>
                            {userType !== 'staff' && (
                                <>
                                    <td style={{ maxWidth: '100px', maxHeight: '60px', overflowWrap: 'break-word', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {room.photo_url}
                                    </td>
                                    <td style={{ maxWidth: '100px', maxHeight: '60px', overflowWrap: 'break-word', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {room.photo_url2}
                                    </td>
                                </>
                            )}
                            <td style={{ maxWidth: '100px', maxHeight: '60px', overflowWrap: 'break-word', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {room.features && room.features.map((feature, index) => (
                                    <span key={index}>{feature}, </span>
                                ))}
                            </td>
                            <td>{"₹ " + room.price + "/-"}</td>
                            {userType !== 'staff' && (
                                <>
                                    <td style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly' }}>
                                        <button className="button-primary" onClick={() => handleEditClick(room)} style={{ marginBottom: '10px', marginLeft: '0' }}><i className='fa-regular fa-pen-to-square'></i></button>
                                        <button className="button-primary" onClick={handleDeleteClick} style={{ marginLeft: '0' }}><i className='fa-solid fa-trash'></i></button>
                                    </td>
                                </>
                            )}

                        </tr>
                    ))}
                </tbody>
            </table>

            {selectedRoom && (
                <div className="update-form">
                    <div className='left-container'>
                        <label style={{ marginTop: '1rem' }}>
                            Bed Type:
                            <input type="text" name="bedType" value={updatedRoomData.bedType} onChange={handleInputChange} />
                            {validationErrors.bedType && <div className="error-message">{validationErrors.bedType}</div>}
                        </label>
                        <label>
                            Total Rooms:
                            <input type="text" name="totalRooms" value={updatedRoomData.totalRooms} onChange={handleInputChange} />
                            {validationErrors.totalRooms && <div className="error-message">{validationErrors.totalRooms}</div>}
                        </label>
                        <label>
                            Room Type:
                            <input type="text" name="roomType" value={updatedRoomData.roomType} onChange={handleInputChange} />
                            {validationErrors.roomType && <div className="error-message">{validationErrors.roomType}</div>}
                        </label>
                        <label>
                            Capacity:
                            <input type="text" name="capacity" value={updatedRoomData.capacity} onChange={handleInputChange} />
                            {validationErrors.capacity && <div className="error-message">{validationErrors.capacity}</div>}
                        </label>

                        <label>
                            Availability:
                            <input type="text" name="available" value={updatedRoomData.available} onChange={handleInputChange} />
                        </label>

                        <button className="button-tertiary" onClick={handleCancelClick}>Cancel</button>
                    </div>

                    <div className='right-container'>
                        <label>
                            Description:
                            <input type="text" name="description" value={updatedRoomData.description} onChange={handleInputChange}></input>
                        </label>
                        <label>
                            Photo URL 1:
                            <input type="text" name="photo_url" value={updatedRoomData.photo_url} onChange={handleInputChange} />
                        </label>
                        <label>
                            Photo URL 2:
                            <input type="text" name="photo_url2" value={updatedRoomData.photo_url2} onChange={handleInputChange} />
                        </label>
                        <label>
                            Features (comma-seperated):
                            <input type="text" name="features" value={updatedRoomData.features} onChange={handleInputChange} />
                        </label>
                        <button className="button-tertiary" onClick={handleUpdateClick}>Update</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewRoom;
