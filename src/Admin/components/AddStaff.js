import React, { useState } from 'react';
import './AddStaff.css';

const AddStaff = () => {
    const [staffData, setStaffData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        joiningDate: '',
        dob: '',
        gender: '',
        designation: '',
        salary: '',
        user_type: 'staff',
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setStaffData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        // Example validation: Check if the fullName is not empty
        if (!staffData.fullName.trim()) {
            newErrors.fullName = 'Full Name is required';
        } else if (/\d/.test(staffData.fullName)) {
            // Check if the Full Name contains numbers
            newErrors.fullName = 'Numbers not allowed';
        }

        // Example validation: Check if the email is not empty and is a valid email format
        if (!staffData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^\S+@\S+\.\S+$/.test(staffData.email)) {
            newErrors.email = 'Invalid email format';
        }

        // Example validation: Check if the phone is not empty and follows a numeric format
        if (!staffData.phone.trim() || !/^\d+$/.test(staffData.phone)) {
            newErrors.phone = 'Invalid phone number';
        }

        // Example validation: Check if the password is at least 6 characters long
        if (staffData.password.trim().length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        // Example validation: Check if the joining date is not empty
        if (!staffData.joiningDate.trim()) {
            newErrors.joiningDate = 'Joining Date is required';
        }

        // Example validation: Check if the date of birth is not empty
        if (!staffData.dob) {
            newErrors.dob = 'Date of Birth is required';
        }

        // Example validation: Check if the salary is a positive number
        if (isNaN(staffData.salary) || parseFloat(staffData.salary) <= 0) {
            newErrors.salary = 'Salary must be a positive number';
        }

        // Example validation: Check if the gender is not empty
        if (!staffData.gender.trim()) {
            newErrors.gender = 'Gender is required';
        }

        // Example validation: Check if the designation is not empty
        if (!staffData.designation.trim()) {
            newErrors.designation = 'Designation is required';
        }

        setErrors(newErrors);

        // Return true if there are no errors
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            // Validation failed, do not submit the form
            console.error('Form validation failed');
            return;
        }else{

        try {
            const response = await fetch('http://localhost:5000/api/addStaff', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(staffData),
            });

            if (response.ok) {
                console.log('Staff added successfully');
                // Optionally, you can reset the form after successful submission
                setStaffData({
                    fullName: '',
                    email: '',
                    phone: '',
                    password: '',
                    joiningDate: '',
                    dob: '',
                    gender: '',
                    designation: '',
                    salary: '',
                    user_type: 'staff',
                });
            } else {
                console.error('Failed to add staff');
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
    }
};

    return (
        <div className="main-container">
            <div className="left-container">
                <form onSubmit={handleSubmit} className="form">
                    <div className="form-row">
                        <label>
                            Full Name:
                            <input
                                type="text"
                                name="fullName"
                                value={staffData.fullName}
                                onChange={handleChange}
                                className={errors.fullName ? 'error' : ''}
                            />
                            {errors.fullName && <span className="error-message">{errors.fullName}</span>}
                        </label>
                    </div>

                    <div className="form-row">
                        <label>
                            Email:
                            <input
                                type="email"
                                name="email"
                                value={staffData.email}
                                onChange={handleChange}
                                className={errors.email ? 'error' : ''}
                            />
                            {errors.email && <span className="error-message">{errors.email}</span>}
                        </label>
                    </div>

                    <div className="form-row">
                        <label>
                            Phone:
                            <input
                                type="text"
                                name="phone"
                                value={staffData.phone}
                                onChange={handleChange}
                                className={errors.phone ? 'error' : ''}
                            />
                            {errors.phone && <span className="error-message">{errors.phone}</span>}
                        </label>
                    </div>

                    <div className="form-row">
                        <label>
                            Password:
                            <input
                                type="password"
                                name="password"
                                value={staffData.password}
                                onChange={handleChange}
                                className={errors.password ? 'error' : ''}
                            />
                            {errors.password && <span className="error-message">{errors.password}</span>}
                        </label>
                    </div>
                    <button className="button-secondary" type="reset">
                        Reset
                    </button>
                </form>
            </div>

            <div className="right-container">
                <form onSubmit={handleSubmit} className="form">
                    <div className="form-row">
                        <label>
                            Date of Birth:
                            <input
                                type="date"
                                name="dob"
                                value={staffData.dob}
                                onChange={handleChange}
                                className={errors.dob ? 'error' : ''}
                            />
                            {errors.dob && <span className="error-message">{errors.dob}</span>}
                        </label>
                        {/* Slelect Genbder */}
                        <label>
                            Gender:
                            <select
                                name="gender"
                                value={staffData.gender}
                                onChange={handleChange}
                                className={errors.gender ? 'error' : ''}
                            >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                            {errors.gender && <span className="error-message">{errors.gender}</span>}
                        </label>
                    </div>
                    <div className="form-row">
                        <label>
                            Designation:
                            <input
                                type="text"
                                name="designation"
                                value={staffData.designation}
                                onChange={handleChange}
                                className={errors.designation ? 'error' : ''}
                            />
                            {errors.designation && (
                                <span className="error-message">{errors.designation}</span>
                            )}
                        </label>
                    </div>

                    <div className="form-row">
                        <label>
                            Salary:
                            <input
                                type="number"
                                name="salary"
                                value={staffData.salary}
                                onChange={handleChange}
                                className={errors.salary ? 'error' : ''}
                            />
                            {errors.salary && <span className="error-message">{errors.salary}</span>}
                        </label>
                    </div>
                    <div className="form-row">
                        <label>
                            Joining Date:
                            <input
                                type="date"
                                name="joiningDate"
                                value={staffData.joiningDate}
                                onChange={handleChange}
                                className={errors.joiningDate ? 'error' : ''}
                            />
                            {errors.joiningDate && (
                                <span className="error-message">{errors.joiningDate}</span>
                            )}
                        </label>
                    </div>
                    <button className="button-tertiary" type="submit">
                        Add Staff
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddStaff;
