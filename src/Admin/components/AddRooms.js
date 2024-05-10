import React, { useState } from 'react';
import './AddRooms.css'; // Ensure you have the corresponding CSS file

const AddRoom = () => {
    const [roomData, setRoomData] = useState({
        bedType: '',
        totalRooms: '',
        roomType: '',
        capacity: '',
        available: '',
        description: '',
        photo_url: '',
        features: [],
        price:''
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRoomData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!roomData.bedType.trim()) {
            newErrors.bedType = 'Room Number is required';
        }

        if (!roomData.roomType.trim()) {
            newErrors.roomType = 'Room Type is required';
        }

        if (!roomData.capacity.trim()) {
            newErrors.capacity = 'Capacity is required';
        } else if (!/^\d+$/.test(roomData.capacity)) {
            newErrors.capacity = 'Invalid capacity format';
        }

        if (!roomData.available.trim()) {
            newErrors.available = 'Status is required';
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleCancelClick = () => {
        // Implement the logic for canceling the form submission or resetting form values
        setRoomData({
            bedType: '',
            totalRooms: '',
            roomType: '',
            capacity: '',
            available: '',
            description: '',
            photo_url: '',
            photo_url2:'',
            features: [],
            price:''
        });

        setErrors({});
    };
    const handleFeaturesChange = (e) => {
        const { name, value } = e.target;
        setRoomData((prevData) => ({
            ...prevData,
            [name]: value.split(',').map((feature) => feature.trim()),
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            console.error('Form validation failed');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/room', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(roomData),
            });

            if (response.ok) {
                console.log('Room added successfully');
                setRoomData({
                    bedType: '',
                    totalRooms: '',
                    roomType: '',
                    capacity: '',
                    Available: '',
                    description: '',
                    photo_url: '',
                    photo_url2:'',
                    features: [],
                    price:'',
                });
            } else {
                console.error('Failed to add room');
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    return (
        <div className="main-container">
            <div className='left-container'>
                <form onSubmit={handleSubmit} className="form">
                    <div className="form-row">
                        <label>
                            Bed Type:
                            <input
                                type="text"
                                name="bedType"
                                value={roomData.bedType}
                                onChange={handleChange}
                                className={errors.bedType ? 'error' : ''}
                            />
                            {errors.bedType && <span className="error-message">{errors.bedType}</span>}
                        </label>
                    </div>

                    <div className="form-row">
                        <label>
                            Total Rooms:
                            <input
                                type="number"
                                name="totalRooms"
                                value={roomData.totalRooms}
                                onChange={handleChange}
                                className={errors.totalRooms ? 'error' : ''}
                            />
                            {errors.available && <span className="error-message">{errors.totalRooms}</span>}
                        </label>
                    </div>

                    <div className="form-row">
                        <label>
                            Room Type:
                            <select
                                name="roomType"
                                value={roomData.roomType}
                                onChange={handleChange}
                                className={errors.roomType ? 'error' : ''}
                            >
                                <option value="">Select Room Type</option>
                                <option value="Standard">Standard</option>
                                <option value="Delux">Delux</option>
                                <option value="Suite">Suite</option>
                                <option value="Premium">Premium</option>
                                {/* Add more options as needed */}
                            </select>
                            {errors.roomType && <span className="error-message">{errors.roomType}</span>}
                        </label>
                    </div>

                    <div className="form-row">
                        <label>
                            Capacity:
                            <input
                                type="text"
                                name="capacity"
                                value={roomData.capacity}
                                onChange={handleChange}
                                className={errors.capacity ? 'error' : ''}
                            />
                            {errors.capacity && <span className="error-message">{errors.capacity}</span>}
                        </label>
                    </div>

                    <div className="form-row">
                        <label>
                            Available:
                            <input
                                type="text"
                                name="available"
                                value={roomData.available}
                                onChange={handleChange}
                                className={errors.available ? 'error' : ''}
                            />
                            {errors.available && <span className="error-message">{errors.available}</span>}
                        </label>
                    </div>

                    <button className="button-tertiary" type="button" onClick={handleCancelClick}>
                        Cancel
                    </button>
                </form>
            </div>


            <div className='right-container'>
                <form onSubmit={handleSubmit} className="form">
                
                    <div className="form-row">
                        <label>
                            Description:
                            <input
                                type='text'
                                name="description"
                                value={roomData.description}
                                onChange={handleChange}
                            />
                        </label>
                    </div>

                    <div className="form-row">
                        <label>
                            Photo URL 1:
                            <input
                                type="text"
                                name="photo_url"
                                value={roomData.photo_url}
                                onChange={handleChange}
                            />
                        </label>
                    </div>

                    <div className="form-row">
                        <label>
                            Photo URL 2:
                            <input
                                type="text"
                                name="photo_url2"
                                value={roomData.photo_url2}
                                onChange={handleChange}
                            />
                        </label>
                    </div>

                    <div className="form-row">
                        <label>
                            Features: (comma-seperated)
                            <input
                                type="text"
                                name="features"
                                value={roomData.features.join(', ')}
                                onChange={handleFeaturesChange}
                            />
                        </label>
                    </div>

                    <div className='form-row'>
                    <label>
                            Price:
                            <input
                                type="text"
                                name="price"
                                value={roomData.price}
                                onChange={handleChange}
                            />
                        </label>
                    </div>

                    <button className="button-tertiary" type="submit">
                        Add Room
                    </button>

                </form>
            </div>
        </div>
    );
};

export default AddRoom;
