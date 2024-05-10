import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DeleteStaff = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [genderFilter, setGenderFilter] = useState('');
    

    useEffect(() => {
        fetchStaffUsers();
    }, []);

    const fetchStaffUsers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/users/staffs');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching staff users:', error);
        }
    };

    const handleDeleteClick = async (staffId) => {
        try {
            await axios.delete(`http://localhost:5000/staffs/${staffId}`);
            fetchStaffUsers();
            toast.success('Staff deleted successfully', { position: toast.POSITION.BOTTOM_RIGHT });
        } catch (error) {
            console.error('Error deleting staff user:', error);
            toast.error('Error deleting staff user', { position: toast.POSITION.BOTTOM_RIGHT });
        }
    };

    const filteredUsers = users.filter((user) => {
        const searchTermMatch = user.tshid.toLowerCase().includes(searchTerm.toLowerCase());
        const genderMatch = !genderFilter || user.gender === genderFilter;

        return searchTermMatch && genderMatch;
    });

    const handleSearchTermChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleGenderFilterChange = (selectedGender) => {
        setGenderFilter(selectedGender);
    };

    return (
        <div className="staff-container">
            <div className="filters">
                <input
                    type="text"
                    placeholder="Search Users"
                    value={searchTerm}
                    onChange={handleSearchTermChange}
                />
                <select value={genderFilter} onChange={(e) => handleGenderFilterChange(e.target.value)}>
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </select>
            </div>

            <table className="table-container">
                <thead>
                    <tr>
                        <th>TSHID</th>
                        <th>Full Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>DOB</th>
                        <th>Gender</th>
                        <th>Designation</th>
                        <th>Joining Date</th>
                        <th>Salary</th>
                        <th>Actions</th>
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
                            <td>{user.designation}</td>
                            <td>{user.joiningDate}</td>
                            <td>{user.salary}</td>
                            <td>
                                <button className="button-primary" onClick={() => handleDeleteClick(user._id)}><i className='fa-solid fa-trash'></i></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DeleteStaff;
