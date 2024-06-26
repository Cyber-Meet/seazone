// Home.js
import React from 'react';
import Navbar from '../frontend/components/Navbar.js';
import Footer from '../frontend/components/Footer.js';
import Hero from '../frontend/components/Hero.js';
import faqq from '../assets/faq.jpg';
import FAQ from '../frontend/components/Faq.js';
const Faqs = () => {
  return (
    <>
      <Navbar />
      <Hero
        cName="hero-mid"
        heroImg={faqq}
        imgheight = "95%"
        title="FAQs"
        // text="Food that brings people together"
        buttonText="Book Now"
        url="/rooms"
        btnClass="hide"
      />
      <FAQ />
      <Footer />
    </>
  );
};

export default Faqs;



