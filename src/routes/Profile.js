// Home.js
import React from 'react';
import Navbar from '../frontend/components/Navbar.js';
import Footer from '../frontend/components/Footer.js';
import UserProfile from '../frontend/components/Profile.js';
// import UserProfile from '../frontend/components/UserProfile.js';
const Profile = () => {
  return (
    <>
      <Navbar />
      <UserProfile/>
      <Footer />
    </>
  );
};

export default Profile;



