// Import the necessary dependencies
import React from 'react';
import '../../frontend/components/Navbar.js';
import '../../frontend/components/Footer.js';
import '../components/ADashboard.js';

import Navbar from '../components/Navbar.js';
import Footer from '../../frontend/components/Footer.js';
import ADashboard from '../components/ADashboard.js';


function Dashboard() {

  
  return (
    <>
      {/* Use the Logout component for the onClick event */}
      <Navbar/>
      <ADashboard />
      <Footer />
    </>
  );
}

export default Dashboard;
