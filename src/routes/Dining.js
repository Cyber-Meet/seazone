// Home.js
import React from 'react';
import Navbar from '../frontend/components/Navbar.js';
import Footer from '../frontend/components/Footer.js';
import Hero from '../frontend/components/Hero.js';
import food from '../assets/food.jpg';
import Menu from '../frontend/components/Menu.js';
const Dining = () => {
  return (
    <>
      <Navbar />
      <Hero
        cName="hero-mid-1"
        heroImg={food}
        imgheight = "95%"
        title="Dining"
        // text="Food that brings people together"
        buttonText="Book Now"
        url="/rooms"
        btnClass="hide"
      />
      <Menu />
      <Footer />
    </>
  );
};

export default Dining;



