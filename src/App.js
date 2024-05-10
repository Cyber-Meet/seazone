
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './routes/Home.js';
import Dining from './routes/Dining.js';
import Login from './routes/Login.js';
import Signup from './routes/Signup.js';
import Contact from './routes/Contact.js';
import Dashboard from './admin/routes/Dashboard.js';
import StaffD from './admin/routes/Staff.js';
import Amenities from './routes/Amenities.js';
import Bookings from './routes/Booking.js';  
import Room from './routes/Room.js';
import Profile from './routes/Profile.js'
import Faqs from './routes/Faq.js';
import Payment from './routes/Payment.js'
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==" crossorigin="anonymous" referrerpolicy="no-referrer" />



function App() {
  return (
    <div className="App">

        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/dining' element={<Dining />} />
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/staff' element={<StaffD />} />
            <Route path='/amenities' element={<Amenities />} />
            <Route path='/booking' element={<Bookings />} />
            <Route path='/rooms' element={<Room />} />
            <Route path='/profile' element={<Profile/>}/>
            <Route path='/faqs' element={<Faqs/>}/>
            <Route path='/payment' element={<Payment/>}/>
        </Routes>
    </div>
  );
}

export default App;
