// Home.js
import React from 'react';
import Navbar from '../frontend/components/Navbar.js';
import Footer from '../frontend/components/Footer.js';
import SignupUser from '../frontend/components/signup.js';
const Home = () => {
    return (
        <>
            <Navbar />
            <SignupUser />
            <Footer />
        </>
    );
};

export default Home;



