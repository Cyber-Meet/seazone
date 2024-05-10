import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ADashboard.css';
import ViewRoom from './ViewRooms.js';
import ViewAmenities from './ViewAmenities.js';
import AllReseveations from './Areserve.js';
import Booking from '../../frontend/components/Booking.js';


function SDashboard() {
  const [selectedContainer, setSelectedContainer] = useState('staff');

  const handleContainerChange = (container) => {
    setSelectedContainer(container);
  };

  return (
    <>
      <div className="admin-main-container">

        <button className='button-primary' onClick={() => handleContainerChange('reservations')}>Reservations</button>
        <button className='button-primary' onClick={() => handleContainerChange('ostp')}>OSTP</button>
        <button className='button-primary' onClick={() => handleContainerChange('rooms')}>Rooms</button>
        <button className='button-primary' onClick={() => handleContainerChange('amenities')}>Amenities</button>
      </div>

      <div className="below-container">
        {selectedContainer === 'reservations' ? (
          <div className="below-container-content">
            <AllReseveations />
          </div>
        )  : selectedContainer === 'ostp' ? (
          <div className="below-container-content">
            <Booking/>
          </div>
        ) :
            selectedContainer === 'rooms' ? (
              <div className="below-container-content">
                <ViewRoom/>
              </div>
            ) :
            selectedContainer === 'amenities' ? (
              <div className="below-container-content">
                <ViewAmenities/>
              </div>
            ) : null}
      </div>
    </>
  );
}

export default SDashboard;
