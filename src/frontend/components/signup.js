// SignupUser Component
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './signup.css'; // Import the signup CSS file
import logo from '../../assets/Seazone-dark.svg';

const SignupUser = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    gender: '',
    dob: '',
    phone: '',
    password: '',
    acc_status: 'active',
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const validateField = (fieldName, value, minLength, maxLength, pattern, errorMessage) => {
    if (value.trim().length === 0) {
      return `${fieldName} is required`;
    } else if (value.length > maxLength) {
      return `${fieldName} is too long (Max ${maxLength} characters)`;
    } else if (!pattern.test(value)) {
      return errorMessage;
    }
    return null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Dynamic validation based on field name
    let errorMessage = '';

    switch (name) {
      case 'fullName':
        errorMessage = validateField(name, value, 0, 50, /^[a-zA-Z\s]+$/, 'Name can only contain alphabets');
        break;
      case 'email':
        errorMessage = validateField(name, value, 0, Infinity, /\S+@\S+\.\S+/, 'Email is invalid');
        break;
      case 'gender':
        errorMessage = validateField(name, value, 0, Infinity, /^(male|female|other)$/i, 'Please select a valid gender');
        break;
      case 'dob':
        errorMessage = validateField(name, value, 0, Infinity, /^\d{4}-\d{2}-\d{2}$/, 'Please enter a valid date of birth');
        break;
      case 'phone':
        errorMessage =
          value.length < 10
            ? 'Phone Number is incorrect'
            : /^\d+$/.test(value)
              ? null
              : 'Phone Number can only contain numbers';
        break;
      case 'password':
        errorMessage = validateField(
          name,
          value,
          8,
          Infinity,
          /(?=.*[A-Z])(?=.*\d)(?=.*\W)/,
          'Password must meet complexity requirements'
        );
        break;
      case 'confirmPassword':
        errorMessage = value !== formData.password ? 'Passwords do not match' : null;
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    // Placeholder for additional form-level validation logic (if needed)
    // ...

    // Return true if the form is valid
    return Object.values(errors).every((error) => error === null || error === '');
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      email: '',
      gender: '',
      dob: '',
      phone: '',
      password: '',
      confirmPassword: '',
      acc_status: 'active',
    });
    setErrors({});
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert('Please fill all the fields correctly!');
      return;
    }

    try {
      // Set the default user type to 'guest'
      const response = await axios.post('http://localhost:5000/api/signup', {
        ...formData,
        user_type: 'guest',
      });

      console.log('Signup response:', response);

      if (response && response.data) {
        console.log('Signup successful:', response.data);
        navigate('/login');
      } else {
        console.error('Signup failed. No data in the response:', response);
      }
    } catch (error) {
      console.error('Error signing up:', error);

      // If you want to display the error message to the user, you can do something like:
      // alert('Error signing up: ' + error.message);
    }
  };

  return (
    <div className="signup-form">
      <div className="left-signup">
        <img src={logo} alt='Seazone' style={{ height: '180px', width: '200px' }}></img>
        <div className='our-reach'>
            <p>Our Reach</p>
          <ul>
            <li>Delhi</li>
            <li>Mumbai</li>
            <li>Agra</li>
            <li>Jaipur</li>
            <li>Varanasi</li>
            <li>Udaipur</li>
            <li>Kolkata</li>
            <li>Chennai</li>
            <li>Kochi (Cochin)</li>
            <li>Hyderabad</li>
            <li>Bangalore</li>
            <li>Goa</li>
            <li>Amritsar</li>
            <li>Rishikesh and Haridwar</li>
            <li>Mysuru (Mysore)</li>
            <li>Pune</li>
            <li>Ahmedabad</li>
            <li>Lucknow</li>
            <li>Bhopal</li>
            <li>Chandigarh</li>
            <li>Thiruvananthapuram</li>
            <li>Shimla</li>
            <li>Jodhpur</li>
            <li>Varanasi</li>
            <li>Guwahati</li>
          </ul>
        </div>
      </div>

      <div className="right-signup">
        <form onSubmit={handleSignup}>
          <div className="form-row">
            <label htmlFor="fullName">Full Name:</label>
            <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} />
            {errors.fullName && <span className="error">{errors.fullName}</span>}
          </div>

          <div className="form-row">
            <label htmlFor="email">Email:</label>
            <input type="text" id="email" name="email" value={formData.email} onChange={handleChange} />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

          <div className="form-row">
            <label htmlFor="gender">Gender:</label>
            <select id="gender" name="gender" value={formData.gender} onChange={handleChange} style={{ marginBottom: '1rem' }}>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && <span className="error">{errors.gender}</span>}
          </div>

          <div className="form-row" style={{ marginBottom: '0' }}>
            <label htmlFor="dob">Date of Birth:</label>
            <input type="date" id="dob" name="dob" value={formData.dob} onChange={handleChange} />
            {errors.dob && <span className="error">{errors.dob}</span>}
          </div>

          <div className="form-row" style={{ marginBottom: '0' }}>
            <label htmlFor="phone">Phone:</label>
            <input type="text" id="phone" name="phone" value={formData.phone} onChange={handleChange} />
            {errors.phone && <span className="error">{errors.phone}</span>}
          </div>

          <div className="form-row">
            <label htmlFor="password">Password:</label>
            <div className="password-input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                style={{ marginright: '0rem', width: 'auto' }}
              />
              <i
                className={`password-icon ${showPassword ? 'fa fa-eye-slash' : 'fa fa-eye'}`}
                onClick={togglePasswordVisibility}
              />
            </div>
            {errors.password && <span className="error">{errors.password}</span>}
          </div>

          <div className="form-row">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
          </div>

          <div className="btn-container">
            <button type="button" className="button-tertiary" style={{ marginLeft: '0' }} onClick={handleReset}>
              Reset
            </button>
            <button type="button" className="button-tertiary" onClick={handleSignup} style={{ marginLeft: '0' }}>
              Signup
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupUser;
