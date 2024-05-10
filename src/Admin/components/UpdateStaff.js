import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UpdateStaff.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UpdateStaff = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [genderFilter, setGenderFilter] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [updatedUserData, setUpdatedUserData] = useState({
        fullName: '',
        email: '',
        phone: '',
        dob: '',
        gender: '',
        designation: '',
        joiningDate: '',
        salary: '',
        password: '',
    });

    const [validationErrors, setValidationErrors] = useState({});

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

    const validateInput = () => {
        const errors = {};

        // Example validation rules (customize as needed)
        if (!updatedUserData.fullName.trim()) {
            errors.fullName = 'Full Name is required';
        }

        if (!updatedUserData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/^\S+@\S+\.\S+$/.test(updatedUserData.email)) {
            errors.email = 'Invalid email format';
        }

        if (!updatedUserData.phone.trim()) {
            errors.phone = 'Phone is required';
        } else if (!/^\d{10}$/.test(updatedUserData.phone)) {
            errors.phone = 'Invalid phone number';
        }

        if (!updatedUserData.dob.trim()) {
            errors.dob = 'DOB is required';
        }

        if (!updatedUserData.gender.trim()) {
            errors.gender = 'Gender is required';
        }

        if (!updatedUserData.designation.trim()) {
            errors.designation = 'Designation is required';
        }

        if (!updatedUserData.joiningDate.trim()) {
            errors.joiningDate = 'Joining Date is required';
        }

        if (!updatedUserData.salary.trim()) {
            errors.salary = 'Salary is required';
        } else if (!/^\d+$/.test(updatedUserData.salary)) {
            errors.salary = 'Invalid salary format';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
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

    const handleEditClick = (user) => {
        setSelectedUser(user);
        setUpdatedUserData({
            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
            dob: user.dob,
            gender: user.gender,
            designation: user.designation,
            joiningDate: user.joiningDate,
            salary: user.salary,
            password: '',
        });
        setValidationErrors({});
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedUserData((prevData) => ({
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
                const staffId = selectedUser._id; // Assuming _id is the MongoDB document ID
                // Perform the update API call with updatedUserData
                await axios.put(`http://localhost:5000/staffs/${staffId}`, updatedUserData);
                toast.success('Staff updated successfully', { position: toast.POSITION.BOTTOM_RIGHT });

                // Fetch updated staff users
                fetchStaffUsers();

                // Reset selectedUser and updatedUserData
                setSelectedUser(null);
                setUpdatedUserData({
                    fullName: '',
                    email: '',
                    phone: '',
                    dob: '',
                    gender: '',
                    designation: '',
                    joiningDate: '',
                    salary: '',
                    password: '',
                });
            } catch (error) {
                console.error('Error updating staff user:', error);
                toast.error('Error updating staff user', { position: toast.POSITION.BOTTOM_RIGHT });
            }
        }
    };

    const handleCancelClick = () => {
        setSelectedUser(null);
        setUpdatedUserData({
            fullName: '',
            email: '',
            phone: '',
            dob: '',
            gender: '',
            designation: '',
            joiningDate: '',
            salary: '',
            password: '',
        });
    }

    return (
        <div className="updatestaff-container">
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
                                <button className="button-primary" onClick={() => handleEditClick(user)}><i className='fa-regular fa-pen-to-square'></i></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {selectedUser && (
                <div className="update-form">

                    <div className='left-container'>
                        <h2>Update{` ${selectedUser.tshid}`}</h2>
                        <label>
                            Full Name:
                            <input type="text" name="fullName" value={updatedUserData.fullName} onChange={handleInputChange} />
                            {validationErrors.fullName && <div className="error-message">{validationErrors.fullName}</div>}
                        </label>
                        <label>
                            Email:
                            <input type="text" name="email" value={updatedUserData.email} onChange={handleInputChange} />
                            {validationErrors.email && <div className="error-message">{validationErrors.email}</div>}
                        </label>
                        <label>
                            Phone:
                            <input type="text" name="phone" value={updatedUserData.phone} onChange={handleInputChange} />
                        </label>
                        <label>
                            Date of Birth:
                            <input type="text" name="dob" value={updatedUserData.dob} onChange={handleInputChange} />
                        </label>
                        <button className="button-tertiary" onClick={handleCancelClick}>Cancel</button>

                    </div>
                    <div className='right-container'>
                        <label>
                            Gender:
                            <input type="text" name="gender" value={updatedUserData.gender} onChange={handleInputChange} />
                        </label>

                        <label>
                            Designation:
                            <input type="text" name="designation" value={updatedUserData.designation} onChange={handleInputChange} />
                        </label>
                        <label>
                            Joining Date:
                            <input type="text" name="joiningDate" value={updatedUserData.joiningDate} onChange={handleInputChange} />
                        </label>
                        <label>
                            Salary:
                            <input type="text" name="salary" value={updatedUserData.salary} onChange={handleInputChange} />
                        </label>
                        <label>
                            Password:
                            <input type="password" name="password" value={updatedUserData.password} onChange={handleInputChange} />
                        </label>
                        <button className="button-tertiary" onClick={handleUpdateClick}>Update</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UpdateStaff;
