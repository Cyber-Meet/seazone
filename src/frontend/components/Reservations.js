import React, { useState, useEffect } from 'react';
import '../components/Reservations.css';

const ReservationDetails = () => {
    const [loading, setLoading] = useState(true);
    const [reservationData, setReservationData] = useState([]);
    const storedTshid = sessionStorage.getItem('tshid');

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    useEffect(() => {
        const fetchReservationData = async () => {
            try {
                // Make API request to fetch reservations for current or past month
                const response = await fetch(`http://localhost:5000/api/reservations/month?tshid=${storedTshid}`);
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
            <h2>Reservation Details</h2>
            <p>Reservations of Current Month and Past Month</p>
            {loading ? (
                <p>Loading reservation data...</p>
            ) : (reservationData !== null && Array.isArray(reservationData)) ? (
                <table className='table-container'>
                    <thead>
                        <tr>
                            <th>Reservation ID</th>
                            <th>Check-In</th>
                            <th>Check-Out</th>
                            <th>Price</th>
                            <th>Room No</th>
                            <th>Status</th>
                            {reservationData[0].status === 'confirmed' && <th>Action</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {reservationData.map((reservation, index) => (
                            <tr key={index}>
                                <td>{reservation.rid}</td>
                                <td>{formatDate(reservation.checkInDate)}</td>
                                <td>{formatDate(reservation.checkOutDate)}</td>
                                <td>{reservation.totalAmount}</td>
                                <td>{reservation.roomNo}</td>
                                <td>{reservation.status}</td>
                                {reservation.status === 'confirmed' && (
                                    <td><button className='cncl-btn' >Cancel</button></td>
                                )}                            
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No reservations found</p>
            )}
        </div>
    );
};

export default ReservationDetails;