import React, { useState, useEffect } from 'react';
import '../components/Profile.css';
import ReservationDetails from './Reservations.js'; // Update the path as needed
import History from './History.js';

const UserProfile = () => {
    const [activeSection, setActiveSection] = useState('reservations');
    const [userData, setUserData] = useState(null);
    var [editedName, setEditedName] = useState('');
    const [editedEmail, setEditedEmail] = useState('');
    const [editedDob, setEditedDob] = useState('');
    const [editedPhone, setEditedPhone] = useState('');
    const [editedGender, setEditedGender] = useState('');
    const [editedPassword, setEditedPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const tshid = sessionStorage.getItem('tshid');
                const response = await fetch(`http://localhost:5000/api/users?tshid=${tshid}`);
                const data = await response.json();

                if (response.ok) {
                    setUserData(data);
                } else {
                    console.error('Error fetching user data');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchData();
    }, []);

    const handleSectionClick = (section) => {
        setActiveSection(section);
    };

    const handleCancelDeactivate = () => {
        setActiveSection('reservations');
    };

    const handleDeactivate = async () => {
        try {
            const tshid = sessionStorage.getItem('tshid');
            const response = await fetch(`http://localhost:5000/api/users?tshid=${tshid}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    acc_status: 'deactivated',
                }),
            });

            if (response.ok) {
                // Handle successful deactivation, e.g., redirect the user or show a message
                alert('Account deactivated successfully');
                sessionStorage.clear();
            } else {
                // Handle error response, e.g., show an error message
                console.error('Error deactivating user:', response.statusText);
            }
        } catch (error) {
            // Handle general error, e.g., show an error message
            console.error('Error deactivating user:', error);
        }
    };

    // change password by fetching user and updating password and hash password
    const handleChangePassword = async () => {
        try {
            const tshid = sessionStorage.getItem('tshid');
    
            // Validate the input fields
            const updatedValidationErrors = {};
    
            if (!oldPassword.trim()) {
                updatedValidationErrors.oldPassword = 'Old Password is required';
            }
    
            if (!editedPassword.trim()) {
                updatedValidationErrors.editedPassword = 'New Password is required';
            }
    
            if (editedPassword !== confirmNewPassword) {
                updatedValidationErrors.confirmNewPassword = 'Passwords do not match';
            }
    
            if (Object.keys(updatedValidationErrors).length > 0) {
                setValidationErrors(updatedValidationErrors);
                return;
            }
    
            // Send a request to the backend to change the password
            const response = await fetch(`http://localhost:5000/api/change-password?tshid=${tshid}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    oldPassword,
                    newPassword: editedPassword,
                }),
            });
    
            if (response.ok) {
                // Password change successful
                alert('Password changed successfully');
                setEditMode(false);
                setValidationErrors({});
                setActiveSection('reservations');
            } else {
                // Handle error response
                console.error('Error changing password:', response.statusText);
    
                // Assuming the response body contains a meaningful error message
                const responseData = await response.json();
                setValidationErrors({ oldPassword: responseData.error });
            }
        } catch (error) {
            console.error('Error changing password:', error);
        }
    };

    const handleCancelChangePassword = () =>{
        setActiveSection('reservations');
        setEditMode(false);
        setValidationErrors({});
    }

    const handleCancelEdit = () => {
        setActiveSection('reservations');
        setEditMode(false);
        setValidationErrors({});
    };

    const handleSaveEdit = async (event) => {
        event.preventDefault();

        try {
            // Dynamic validations
            const updatedValidationErrors = {};

            if (!editedName.trim()) {
                updatedValidationErrors.editedName = 'Name is required';
            }

            if (!editedDob.trim()) {
                updatedValidationErrors.editedDob = 'Date of Birth is required';
            }

            if (!editedPhone.trim()) {
                updatedValidationErrors.editedPhone = 'Phone is required';
            } else if (editedPhone.length < 10 && editedPhone.length > 0) {
                updatedValidationErrors.editedPhone = 'Phone must be at least 10 characters long';
            }

            if (!editedGender.trim()) {
                updatedValidationErrors.editedGender = 'Gender is required';
            }

            if (Object.keys(updatedValidationErrors).length > 0) {
                setValidationErrors(updatedValidationErrors);
                return; // Stop further processing if there are validation errors
            }

            const tshid = sessionStorage.getItem('tshid');

            // Update user information using an API endpoint (replace with your actual endpoint)
            const response = await fetch(`http://localhost:5000/api/users?tshid=${tshid}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fullName: editedName,
                    dob: editedDob,
                    phone: editedPhone,
                    gender: editedGender,
                }),
            });

            if (response.ok) {
                // Fetch updated user data after saving changes
                const fetchData = async () => {
                    try {
                        const tshid = sessionStorage.getItem('tshid');
                        const response = await fetch(`http://localhost:5000/api/users?tshid=${tshid}`);
                        const data = await response.json();

                        if (response.ok) {
                            setUserData(data);
                        } else {
                            console.error('Error fetching user data');
                        }
                    } catch (error) {
                        console.error('Error fetching user data:', error);
                    }
                };

                fetchData();

                setEditMode(false);
                setValidationErrors({});
                alert('Profile updated successfully');
                setActiveSection('reservations');
            } else {
                console.error('Error updating user data');
            }
        } catch (error) {
            console.error('Error updating user data:', error);
        }
    };

    const handleInputChange = (event) => {
        switch (event.target.name) {
            case 'editedName':
                setEditedName(event.target.value);
                break;
            case 'editedEmail':
                setEditedEmail(event.target.value);
                break;
            case 'editedDob':
                setEditedDob(event.target.value);
                break;
            case 'editedPhone':
                setEditedPhone(event.target.value);
                break;
            case 'editedGender':
                setEditedGender(event.target.value);
                break;
            case 'editedPassword':
                setEditedPassword(event.target.value);
                break;
            case 'oldPassword':
                setOldPassword(event.target.value);
                break;
            case 'confirmNewPassword':
                setConfirmNewPassword(event.target.value);
                break;
            default:
                break;
        }

        setValidationErrors({
            ...validationErrors,
            [event.target.name]: '', // Clear validation error when the user starts typing
        });
    };

    return (
        <>
            <div style={{ marginTop: '6rem' }} className="profile-main-container">
                <div className="user-left-container">
                    <div className="controls">
                        <button
                            className={`button-tertiary ${activeSection === 'reservations' ? 'active' : ''}`}
                            style={{ marginLeft: '0', marginBottom: '1rem' }}
                            onClick={() => handleSectionClick('reservations')}
                        >
                            Reservations
                        </button>
                        <button
                            className={`button-tertiary ${activeSection === 'history' ? 'active' : ''}`}
                            style={{ marginLeft: '0', marginBottom: '1rem' }}
                            onClick={() => handleSectionClick('history')}
                        >
                            History
                        </button>
                        <button
                            className={`button-tertiary ${activeSection === 'edit-profile' ? 'active' : ''}`}
                            style={{ marginLeft: '0', marginBottom: '1rem' }}
                            onClick={() => handleSectionClick('edit-profile')}
                        >
                            Edit Profile
                        </button>
                        <li
                            style={{ cursor: 'pointer', listStyle: 'none', color: 'black', marginBottom: '1rem', marginTop:'1rem'}}
                            onClick={() => handleSectionClick('change-password')}
                        >
                            Change Password
                        </li>
                        <li
                            style={{ cursor: 'pointer', listStyle: 'none', color: 'red' }}
                            onClick={() => handleSectionClick('deactivate')}
                        >
                            Deactivate Account
                        </li>
                    </div>
                </div>

                <div className="user-right-container">
                    {activeSection === 'edit-profile' ? (
                        <div className='edit-profile'>
                            <div>
                                <form onSubmit={handleSaveEdit}>
                                    <div className='form-row'>
                                        <label>Name:</label>
                                        <input
                                            type="text"
                                            name="editedName"
                                            value={editedName === '' ? userData.fullName : editedName}
                                            onChange={handleInputChange}
                                        />
                                        {validationErrors.editedName && <span className="error">{validationErrors.editedName}</span>}
                                    </div>
                                    <div className='form-row'>
                                        <label>Email:</label>
                                        <input
                                            type="text"
                                            name="editedEmail"
                                            value={userData.email}
                                            readOnly
                                        />
                                    </div>
                                    <div className='form-row'>
                                        <label>Date of Birth:</label>
                                        <input
                                            type="date"
                                            name="editedDob"
                                            value={editedDob === '' ? userData.dob : editedDob}
                                            onChange={handleInputChange}
                                            placeholder={userData.dob}
                                        />
                                        {validationErrors.editedDob && <span className="error">{validationErrors.editedDob}</span>}
                                    </div>
                                </form>
                            </div>
                            <div>
                                <form onSubmit={handleSaveEdit}>
                                    <div className='form-row'>
                                        <label>Phone:</label>
                                        <input
                                            type="text"
                                            name="editedPhone"
                                            value={editedPhone === '' ? userData.phone : editedPhone}
                                            onChange={handleInputChange}
                                            placeholder={userData.phone}
                                        />
                                        {validationErrors.editedPhone && <span className="error">{validationErrors.editedPhone}</span>}
                                    </div>
                                    <div className='form-row'>
                                        <label>Gender:</label>
                                        <select
                                            name="editedGender"
                                            value={editedGender === '' ? userData.gender : editedGender}
                                            onChange={handleInputChange}
                                        >
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                        {validationErrors.editedGender && <span className="error">{validationErrors.editedGender}</span>}
                                    </div>

                                    <div className='button-container-profile'>
                                        <button type="submit" className='button-tertiary' style={{ marginLeft: '0' }}>Save</button>
                                        <button type="button" className='button-tertiary' style={{ marginLeft: '0' }} onClick={handleCancelEdit}>Cancel</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    ) : (
                        <>
                            {userData && (
                                <div className='user-profile'>
                                    <div className="profile-info-1">
                                        <p>Name: {userData.fullName}</p>
                                        <p>Email: {userData.email}</p>
                                        <p>TSHID: {userData.tshid}</p>
                                    </div>
                                    <div className='profile-info-2'>
                                        <p>Phone: {userData.phone}</p>
                                        <p>Gender: {userData.gender}</p>
                                        <p>DOB: {userData.dob}</p>
                                    </div>
                                </div>
                            )}

                            <div className='user-reservation' style={{ display: activeSection === 'reservations' ? 'block' : 'none' }}>
                                <ReservationDetails />
                            </div>
                            <div className='user-history' style={{ display: activeSection === 'history' ? 'block' : 'none' }}>
                                <History />
                            </div>
                            <div className='change-password' style={{ display: activeSection === 'change-password' ? 'block' : 'none' }}>
                                <h3>Change Password</h3>
                                <form onSubmit={handleChangePassword}>
                                    <div className='form-row'>
                                        <label>Old Password:</label>
                                        <input
                                            type="password"
                                            name="oldPassword"
                                            value={oldPassword}
                                            onChange={handleInputChange}
                                        />
                                        {validationErrors.oldPassword && <span className="error">{validationErrors.oldPassword}</span>}
                                    </div>
                                    <div className='form-row'>
                                        <label>New Password:</label>
                                        <input
                                            type="password"
                                            name="editedPassword"
                                            value={editedPassword}
                                            onChange={handleInputChange}
                                        />
                                        {validationErrors.editedPassword && <span className="error">{validationErrors.editedPassword}</span>}
                                    </div>
                                    <div className='form-row'>
                                        <label>Confirm New Password:</label>
                                        <input
                                            type="password"
                                            name="confirmNewPassword"
                                            value={confirmNewPassword}
                                            onChange={handleInputChange}
                                        />
                                        {validationErrors.confirmNewPassword && <span className="error">{validationErrors.confirmNewPassword}</span>}
                                    </div>
                                    <div className='button-container-profile'>
                                        <button type="submit" className='button-tertiary' style={{ marginLeft: '0' }}>Change</button>
                                        <button type="button" className='button-tertiary' style={{ marginLeft: '0' }} onClick={handleCancelChangePassword}>Cancel</button>
                                    </div>
                                </form>
                            </div>
                            <div className='user-deactivate' style={{ display: activeSection === 'deactivate' ? 'block' : 'none' }}>
                                <h3> Are you sure you want to Deactivate Account?</h3>
                                <p>Once your account was deactivated, you can't login</p>
                                <div className='button-container-profile'>
                                    <button className='button-tertiary' style={{ marginLeft: '0', backgroundColor: 'red' }} onClick={handleDeactivate}>Yes</button>
                                    <button className='button-tertiary' style={{ marginLeft: '0' }} onClick={handleCancelDeactivate}>No</button>
                                </div>
                                <p>If you want to Re-Activate your Account, Contact us</p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default UserProfile;
