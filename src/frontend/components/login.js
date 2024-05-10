import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './login.css';
import logo from '../../assets/Seazone-dark.svg';
// import AlertModal from '../components/Alert';



const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    // const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        // Client-side validation
        if (!email || !password) {
            setError('Please enter both email and password');
            return;
        }

        // Validate email format
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Please enter a valid email address');
            return;
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (!passwordRegex.test(password)) {
            setError('Password must be at least 8 characters long.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/login', {
                email,
                password,
            });

            console.log('Login successful:', response.data);
            const { token, tshid, fullName, user_type, acc_status } = response.data;
            setError(null); 
           
            if(user_type === 'guest' && acc_status === 'active'){
                sessionStorage.setItem('fullName', fullName);
                sessionStorage.setItem('user_type', user_type);
                sessionStorage.setItem('email', email);
                sessionStorage.setItem('tshid', tshid);
                sessionStorage.setItem('token', token);
                
                setTimeout(() => {
                    navigate('/');
                    window.location.reload();   
                }, 0);

            }else if(user_type === 'admin'){
                sessionStorage.setItem('fullName', fullName);
                sessionStorage.setItem('user_type', user_type);
                sessionStorage.setItem('email', email);
                sessionStorage.setItem('tshid', tshid);
                sessionStorage.setItem('token', token);
                setTimeout(() => {
                navigate('/dashboard');
                window.location.reload();   
                },0);
            }else if(user_type === 'staff'){
                sessionStorage.setItem('fullName', fullName);
                sessionStorage.setItem('user_type', user_type);
                sessionStorage.setItem('email', email);
                sessionStorage.setItem('tshid', tshid);
                sessionStorage.setItem('token', token);
                setTimeout(() => {
                navigate('/staff');
                window.location.reload();   
                },0);
            }else if (acc_status !== 'active'){
                alert("Your Account is deactivated, please contact support!");
                navigate('/contact');
            }else{
                navigate('/');
            }


        } catch (error) {
            console.error('Error logging in:', error);
            setError('Invalid email or password. Please try again.');
            console.error('Response data:', error.response?.data);
            // Display an error message or perform other error handling actions
        }
    };

    // Empty dependency array ensures this effect runs only once on mount

    return (
        <div className="login-main-container">
            <div className="login-container">
                <div className="login-left">
                    <img src={logo} alt="Logo" className="login-logo" />
                    <h1 className="login-company-name">Seazone</h1>
                    <p><i>"Where Luxury Meets Reality"</i></p>
                </div>
                <div className="login-right">
                    <div className="login-content">
                        <h2 className="login-heading">Welcome Back!</h2>
                        <p className="login-subtext">Login to your account</p>
                        <form className="login-form" onSubmit={handleLogin}>
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                            />
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                            />
                            {error && <p className="error-message">{error}</p>}
                            <button type="submit" className="button-secondary">
                                Login
                            </button>
                            <p>Dont have an account yet?<a href='/signup'> Register Now</a></p>
                        </form>
                    </div>
                </div>
            </div>



        </div>
    );
};

export default Login;
