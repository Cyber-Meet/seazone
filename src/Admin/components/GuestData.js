import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './GuestData.css';

const GuestData = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [genderFilter, setGenderFilter] = useState('');

    useEffect(() => {
        fetchGuestUsers();
    }, []); 
    // Fetch guest users function
    const fetchGuestUsers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/users/guests');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching guest users:', error);
        }
    };

    // Filter guest users based on search term and gender
    const filteredUsers = users.filter((user) => {
        const searchTermMatch = user.tshid.toLowerCase().includes(searchTerm.toLowerCase());
        const genderMatch = !genderFilter || user.gender === genderFilter;

        return searchTermMatch && genderMatch;
    });

    // Handle changes in the search term input
    const handleSearchTermChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Handle changes in the gender filter
    const handleGenderFilterChange = (selectedGender) => {
        setGenderFilter(selectedGender);
    };

    // Handle status unlock
    const handleStatusUnlock = async (_id) => {
        try {
            const response = await axios.put(`http://localhost:5000/api/users/${_id}`, { acc_status: 'active' });
            console.log('Unlock Response:', response.data);
            fetchGuestUsers();
        } catch (error) {
            console.error('Error unlocking user status:', error);
        }
    };
    
    const handleStatusLock = async (_id) => {
        try {
            const response = await axios.put(`http://localhost:5000/api/users/${_id}`, { acc_status: 'deactivate' });
            console.log('Lock Response:', response.data);
            fetchGuestUsers();
        } catch (error) {
            console.error('Error locking user status:', error);
        }
    };

    return (
        <div className="user-container">
            <div className="filters">
                {/* Search term input */}
                <input
                    type="text"
                    placeholder="Search Users"
                    value={searchTerm}
                    onChange={handleSearchTermChange}
                />
                {/* Gender filter dropdown */}
                <select value={genderFilter} onChange={(e) => handleGenderFilterChange(e.target.value)}>
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </select>
            </div>

            {/* Table displaying filtered guest users */}
            <table className="table-container">
                <thead>
                    <tr>
                        <th>TSHID</th>
                        <th>Full Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>DOB</th>
                        <th>Gender</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map((user) => (
                        <tr key={user._id}>
                            <td>{user.tshid}</td>
                            <td>{user.fullName}</td>
                            <td>{user.email}</td>
                            <td>{user.phone}</td>
                            <td>{user.dob}</td>
                            <td>{user.gender}</td>
                            <td>{user.acc_status}</td>  
                            <td>
                                <button onClick={handleStatusUnlock} className='button-primary'><i className="fa-solid fa-unlock"></i></button>
                                <button onClick={handleStatusLock} className='button-primary'><i className="fa-solid fa-lock"></i></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default GuestData;
