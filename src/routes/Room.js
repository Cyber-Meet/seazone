// Home.js
import React from 'react';
import Navbar from '../frontend/components/Navbar.js';
import Footer from '../frontend/components/Footer.js';
import Hero from '../frontend/components/Hero.js';
import roomhero from '../assets/rooms.jpg';
import Rooms from '../frontend/components/Rooms.js';
const Room = () => {
  return (
    <>
      <Navbar />
      <Hero
        cName="hero"
        heroImg={roomhero}
        imgheight = "95%"
        title="Rooms"
        text='"Room that feels like Where Elegance Meets Exceptional Comfort"'
        buttonText="Book Now"
        url="/booking"
        btnClass="show"
      />
      <Rooms/>
      <Footer />
    </>
  );
};

export default Room;



