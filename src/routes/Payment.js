import '../frontend/components/Navbar.js';

import '../frontend/components/Footer.js';

import Navbar from '../frontend/components/Navbar.js';
import Footer from '../frontend/components/Footer.js';
import Payments from '../frontend/components/Payments.js';

function Payment() {

    return (
        <>
            {/* Use the Logout component for the onClick event */}
            <Navbar
            />
            <Payments />
            <Footer />
        </>
    )
}

export default Payment;