// Home.js
import React from 'react';
import Navbar from '../frontend/components/Navbar.js';
import Footer from '../frontend/components/Footer.js';
import Hero from '../frontend/components/Hero.js';
import Herohome from '../assets/home.jpg';
import Welcome from '../frontend/components/Welcome.js';

const Home = () => {
  return (
    <>
      <Navbar
      to ="/login" />
      <Hero
        cName="hero"
        heroImg={Herohome}
        imgheight = "100%"
        title="Seazone"
        text="Unveiling Luxury, Embraced by the Waves"
        buttonText="Book Now"
        url="/rooms"
        btnClass="show"
      />
      <Welcome />
      <Footer />
    </>
  );
};

export default Home;



