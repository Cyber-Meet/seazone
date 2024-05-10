import React, { useState, useEffect, useRef } from 'react';
import './Booking.css';

const Booking = () => {
    const [formData, setFormData] = useState({
        tshid: '',
        name: '',
        aadhar: '',
        email: '',
        phone: '',
        checkInDate: '',
        checkOutDate: '',
        roomType: '',
        addedServices: [],
        totalAmount: 0,
        rid: '',
        roomNo: '',
    });

    useEffect(() => {
        const storedTshid = sessionStorage.getItem('tshid');
        const storedFullName = sessionStorage.getItem('fullName');
        const storedEmail = sessionStorage.getItem('email');

        if (storedTshid === null) {
            alert('Please login to continue');
            window.location.href = '/login';
        }

        setFormData({
            ...formData,
            tshid: storedTshid || '',
            name: storedFullName || '',
            email: storedEmail || '',
        });
    }, []);

    const [roomTypes, setRoomTypes] = useState([]);
    const [amenities, setAmenities] = useState([]);

    useEffect(() => {
        const fetchRoomTypes = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/room');
                if (response.ok) {
                    const responseData = await response.json();
                    if (Array.isArray(responseData.rooms)) {
                        const roomTypesArray = responseData.rooms.map(room => ({ type: room.roomType, price: room.price }));
                        setRoomTypes(roomTypesArray);
                    } else {
                        console.error('Invalid data format. Expected an array.');
                    }
                } else {
                    console.error('Failed to fetch room types');
                }
            } catch (error) {
                console.error('Error:', error.message);
            }
        };

        // Fetch amenities from your API endpoint
        const fetchAmenities = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/amenities');
                if (response.ok) {
                    const data = await response.json();

                    // Filter amenities where price is 0
                    const paidAmenities = data.filter((amenity) => amenity.price !== 0);

                    setAmenities(paidAmenities);
                } else {
                    console.error('Failed to fetch amenities');
                }
            } catch (error) {
                console.error('Error:', error.message);
            }
        };

        fetchRoomTypes();
        fetchAmenities();
    }, []);

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;
        if (name === 'roomType' || name === 'addedServices') {
            setFormData((prevData) => ({
                ...prevData,
                [name]: type === 'checkbox'
                    ? checked
                        ? [...prevData[name], value]
                        : prevData[name].filter(item => item !== value)
                    : value,
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    useEffect(() => {
        const selectedRoom = roomTypes.find(room => room.type === formData.roomType);
        const roomTypePrice = selectedRoom ? selectedRoom.price : 0;
        const addedServicesPrice = formData.addedServices.reduce((total, serviceName) => {
            const amenity = amenities.find((a) => a.amenityName === serviceName);
            return total + (amenity ? amenity.price : 0);
        }, 0);
        const newTotalAmount = roomTypePrice + addedServicesPrice;
        setFormData(prevData => ({ ...prevData, totalAmount: newTotalAmount }));
    }, [formData.roomType, formData.addedServices, roomTypes, amenities]);

    const formRef = useRef(null);

    const handleClear = (e) => {
        e.preventDefault();
        setFormData({
            addedServices: [],
            totalAmount: 0,
        });
        if (formRef.current) {
            formRef.current.reset();
        }
    };

    function getCurrentDate() {
        const today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth() + 1; // January is 0!
        const yyyy = today.getFullYear();

        if (dd < 10) {
            dd = '0' + dd;
        }

        if (mm < 10) {
            mm = '0' + mm;
        }

        return yyyy + '-' + mm + '-' + dd;
    }

    function getMaxDate() {
        const today = new Date();
        const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
        let dd = nextMonth.getDate();
        let mm = nextMonth.getMonth() + 1; // January is 0!
        const yyyy = nextMonth.getFullYear();

        if (dd < 10) {
            dd = '0' + dd;
        }

        if (mm < 10) {
            mm = '0' + mm;
        }

        return yyyy + '-' + mm + '-' + dd;
    }

    function getNextDay() {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        let dd = tomorrow.getDate();
        let mm = tomorrow.getMonth() + 1; // January is 0!
        const yyyy = tomorrow.getFullYear();

        if (dd < 10) {
            dd = '0' + dd;
        }

        if (mm < 10) {
            mm = '0' + mm;
        }

        return yyyy + '-' + mm + '-' + dd;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            // Fetch available rooms
            const roomResponse = await fetch('http://localhost:5000/api/room');
    
            // Check if roomResponse is successful
            if (!roomResponse.ok) {
                throw new Error('Failed to fetch available rooms');
            }
    
            // Parse room data
            const responseData = await roomResponse.json();
            const roomData = responseData.rooms;
            console.log('Room data:', roomData);
    
            // Check if roomData is an array
            if (!Array.isArray(roomData)) {
                throw new Error('Room data is not in the expected format');
            }
    
            // Filter available rooms based on room type
            const selectedRoomType = formData.roomType; // Assuming roomType is in formData
            const availableRoomsOfType = roomData.filter(room => room.roomType === selectedRoomType && (room.available > 0 && room.available <= 100));    
    
            // Check if there are available rooms of the specified type
            if (availableRoomsOfType.length === 0) {
                console.error(`No available rooms of type: ${selectedRoomType}`);
                return;
            }
    
            // Check if room number has already been assigned for the selected room type
            const reservationsResponse = await fetch(`http://localhost:5000/api/chkreservations?roomType=${selectedRoomType}`);
            
            // Check if reservationsResponse is successful
            if (!reservationsResponse.ok) {
                throw new Error('Failed to fetch reservations');
            }
            
            // Parse reservations data
            const reservations = await reservationsResponse.json();
    
            // Check if room number has already been assigned for the selected room type
            const assignedRoomNumbers = reservations.map(reservation => reservation.roomNo); // Assuming reservations is the array of reservations
            const assignedRoom = availableRoomsOfType.find(room => !assignedRoomNumbers.includes(room.roomNo));
    
            if (!assignedRoom) {
                console.error(`No available rooms with unassigned room number of type: ${selectedRoomType}`);
                return;
            }
    
            // Assign room number starting from 101
            const roomNumber = assignedRoom.roomNo;
    
            // Check if selected dates are available for the selected room type
            const checkInDate = new Date(formData.checkInDate); // Assuming checkInDate is in formData
            const checkOutDate = new Date(formData.checkOutDate); // Assuming checkOutDate is in formData
    
            // Check for conflicting reservation
            const conflictingReservation = reservations.find(reservation => {
                const reservationCheckInDate = new Date(reservation.checkInDate);
                const reservationCheckOutDate = new Date(reservation.checkOutDate);
    
                return (checkInDate < reservationCheckOutDate && checkOutDate > reservationCheckInDate);
            });
    
            // If there is a conflicting reservation, log an error and return
            if (conflictingReservation) {
                console.error('Selected dates are not available for the specified room type');
                return;
            }
    
            // Update room API to decrement available count by 1 for the assigned room
            await fetch(`http://localhost:5000/api/room/${assignedRoom._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ available: assignedRoom.available - 1 }),
            });
    
            // Proceed with reservation
            const reservationResponse = await fetch('http://localhost:5000/api/reservation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...formData, roomNo: roomNumber, status: 'confirmed' }),
            });
    
            // Check if reservationResponse is successful
            if (reservationResponse.ok) {
                const responseData = await reservationResponse.json();
                console.log('Reservation added successfully:', responseData);
                window.location.href = '/payment';
            } else {
                console.error('Failed to add reservation:', reservationResponse.statusText);
            }
        } catch (error) {
            console.error('Error handling reservation:', error.message);
        }
    };
    
    return (
        <>
            <div className='hotel-booking'>
                <h2 style={{ margin: '1rem', color: 'black' }}>Seazone Hotel Booking</h2>
                <button className='button-tertiary' style={{ padding: '1rem', margin: '.7rem' }} onClick={handleClear}>Book Event</button>
            </div>
            <div className="main-container">
                <div className="left-container">
                    <form ref={formRef} onSubmit={handleSubmit} style={{ alignItems: 'left' }}>
                        <label>
                            Name:
                            <input
                                type="text"
                                name="tshid"
                                value={formData.name}
                                onChange={handleChange}
                                readOnly
                            />
                        </label>
                        <label>
                            Email:
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                readOnly
                            />
                        </label>
                        <label>
                            Aadhar:
                            <input
                                type="text"
                                name="aadhar"
                                value={formData.aadhar}
                                onChange={handleChange}
                                required
                            />
                        </label>
                        <label>
                            Phone:
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                        </label>
                        <label>
                            Room Type:
                            <select
                                name="roomType"
                                value={formData.roomType}
                                onChange={handleChange}
                                style={{ marginLeft: '1rem' }}
                            >
                                {roomTypes.map((roomType) => (
                                    <option key={roomType.type} value={roomType.type}>
                                        {roomType.type}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </form>
                </div>
                <div className='right-container'>
                    <form ref={formRef} onSubmit={handleSubmit}>
                        <p></p>
                        <label>
                            Check In Date:
                            <input
                                type="date"
                                name="checkInDate"
                                value={formData.checkInDate || getCurrentDate()} // Set the default value to today's date
                                onChange={handleChange}
                                min={getCurrentDate()}
                                max={getMaxDate()}
                            />
                        </label>
                        <label>
                            Check Out Date:
                            <input
                                type="date"
                                name="checkOutDate"
                                value={formData.checkOutDate || getNextDay()} // Set the default value to today's date
                                onChange={handleChange}
                                min={getCurrentDate()}
                                max={getMaxDate()}
                            />
                        </label>
                        <label>
                            Added Services:
                            <div className='checkboxes'>
                                {amenities.map((amenity) => (
                                    <div key={amenity.id} className='checkitems'>
                                        <input
                                            type="checkbox"
                                            name="addedServices"
                                            value={amenity.amenityName}
                                            checked={formData.addedServices.includes(amenity.amenityName)}
                                            onChange={handleChange}
                                        />
                                        <label>{amenity.amenityName}</label>
                                    </div>
                                ))}
                            </div>
                        </label>
                        <label>
                            Total Amount:
                            <input
                                type="number"
                                name="totalAmount"
                                value={formData.totalAmount}
                                readOnly
                            />
                        </label>
                        <div>
                            <button className='button-tertiary'>Clear</button>
                            <button className='button-tertiary' type="submit" >Book Now</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Booking;
