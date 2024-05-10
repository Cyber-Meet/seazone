import '../frontend/components/Navbar.js';
import Hero from '../frontend/components/Hero.js';
import Herocontact from '../assets/contact.jpg';

import '../frontend/components/Footer.js';
import '../frontend/components/ContactUs.js';

import Navbar from '../frontend/components/Navbar.js';
import Footer from '../frontend/components/Footer.js';
import ContactUs from '../frontend/components/ContactUs.js';

function Contact() {
    return (
        <>
            {/* Use the Logout component for the onClick event */}
            <Navbar
            />
            <Hero
                cName="hero-mid"
                heroImg={Herocontact}
                imgheight="85%"
                title="Contact Us"
                btnClass="hide"
            />
            <ContactUs />
            <div className='main-container'>
                <div className='left-container'>
                    <p>Seazone Luxury Hotel,
                        Bayside Boulevard, South Mumbai
                        Colaba, Maharashtra
                        PIN: 400001
                        India</p>
                    <p><i className='fa-solid fa-phone' style={{color:'#d9bf61'}}></i> +91 98765 43210 | <i className='fa-solid fa-circle-info' style={{color:'#d9bf61'}}></i> +91 98765 43211 | <i className='fa-solid fa-tty' style={{color:'#d9bf61'}}></i> +91 22 1234 5678 | <i className='fa-solid fa-envelope' style={{color:'#d9bf61'}}></i> info@seazoneluxury.com</p>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Contact;