import '../frontend/components/Navbar.js';

import '../frontend/components/Footer.js';

import Navbar from '../frontend/components/Navbar.js';
import Footer from '../frontend/components/Footer.js';
import Booking from '../frontend/components/Booking.js';

function Bookings() {

    return (
        <>
            {/* Use the Logout component for the onClick event */}
            <Navbar
            />
            <Booking />
            <Footer />
        </>
    )
}

export default Bookings;