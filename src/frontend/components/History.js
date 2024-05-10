import React, { useState, useEffect } from 'react';
import '../components/Reservations.css';

const History = () => {
    const [loading, setLoading] = useState(true);
    const [reservationData, setReservationData] = useState(null);
    const storedTshid = sessionStorage.getItem('tshid');

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            // Invalid date, return empty string or handle it as per your requirement
            return '';
        }
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    useEffect(() => {
        const fetchReservationData = async () => {
            try {
                // Make API request to fetch reservation details based on storedTshid
                const response = await fetch(`http://localhost:5000/api/reservations?tshid=${storedTshid}`);
                const data = await response.json();

                setReservationData(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching reservation data:', error);
                setLoading(false);
            }
        };
        fetchReservationData();
    }, [storedTshid]);

    return (
        <div className='reservation'>
            <h2>Past Reservations</h2>
            {loading ? (
    <p>Loading reservation data...</p>
) : (reservationData !== null && Array.isArray(reservationData))? (
    <table className='table-container'>
        <thead>
            <tr>
                <th>Reservation ID</th>
                <th>Check-In</th>
                <th>Check-Out</th>
                <th>Amount</th>
                <th>Added Service</th>
                <th>Room No</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            {reservationData.map((reservation, index) => (
                <tr key={index}>
                    <td>{reservation.rid}</td>
                    <td>{formatDate(reservation.checkInDate)}</td>
                    <td>{formatDate(reservation.checkOutDate)}</td>                    
                    <td>{reservation.totalAmount}</td>
                    <td>{reservation.addedServices.length > 0 ? reservation.addedServices.join(', ') : ''}</td>
                    <td>{reservation.roomNo}</td>
                    <td>{reservation.status}</td>
                </tr>
            ))}
        </tbody>
    </table>
            ) : (
                <p>No reservation data available</p>
            )}
        </div>
    );
};

export default History;
