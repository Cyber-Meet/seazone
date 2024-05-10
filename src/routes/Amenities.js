import '../frontend/components/Navbar.js';
import Hero from '../frontend/components/Hero.js';
import HeroAmenities from '../assets/Amenities.jpeg';

import '../frontend/components/Footer.js';
import '../frontend/components/ContactUs.js';

import Navbar from '../frontend/components/Navbar.js';
import Footer from '../frontend/components/Footer.js';
import Amenities from '../frontend/components/Amenities.js';

function Contact() {

    return (
        <>
            {/* Use the Logout component for the onClick event */}
            <Navbar
            />
            <Hero
                cName="hero"
                heroImg={HeroAmenities}
                imgheight="100%"
                title="Amenities"
                text="Seazone's amenities"
                buttonText="Book Now"
                url="/booking"
                btnClass="show"

            />
            <Amenities />
            <Footer />
        </>
    )
}

export default Contact;