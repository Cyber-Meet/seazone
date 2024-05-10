import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ADashboard.css';
import StaffDashboard from './StaffDashboard.js';
import MessageData from './MessageData.js';
import GuestData from './GuestData.js';
import MenuDashboard from './MenuDashboard.js';
import RoomsDashboard from './RoomsDashboard.js';
import AmenitiesDashboard from './AmenitiesDashboard.js';
import AllReseveations from './Areserve.js';
function ADashboard() {
  const [selectedContainer, setSelectedContainer] = useState('staff');

  const handleContainerChange = (container) => {
    setSelectedContainer(container);
  };

  return (
    <>
      <div className="admin-main-container">

        <button className='button-primary' onClick={() => handleContainerChange('staff')}>Staff</button>
        <button className='button-primary' onClick={() => handleContainerChange('guests')}>Guests</button>
        <button className='button-primary' onClick={() => handleContainerChange('reservations')}>Reservations</button>
        <button className='button-primary' onClick={() => handleContainerChange('menu')}>Menu</button>
        <button className='button-primary' onClick={() => handleContainerChange('rooms')}>Rooms</button>
        <button className='button-primary' onClick={() => handleContainerChange('amenities')}>Amenities</button>
        <button className='button-primary' onClick={() => handleContainerChange('support')}>Support</button>
        <button className='button-primary' onClick={() => handleContainerChange('feedback')}>Feedbacks</button>
      </div>

      <div className="below-container">
        {selectedContainer === 'staff' ? (
          <div className="below-container-content">
            <StaffDashboard />
          </div>
        ) : selectedContainer === 'reservations' ? (
          <div className="below-container-content">
            <AllReseveations />
          </div>
        ) : selectedContainer === 'menu' ? (
          <div className="below-container-content">
            <MenuDashboard />
          </div>
        ) :
          selectedContainer === 'guests' ? (
            <div className="below-container-content">
              <GuestData />
            </div>
          ) :
            selectedContainer === 'rooms' ? (
              <div className="below-container-content">
                <RoomsDashboard/>
              </div>
            ) :
            selectedContainer === 'amenities' ? (
              <div className="below-container-content">
                <AmenitiesDashboard/>
              </div>
            ) :
              selectedContainer === 'support' ? (
                <div className="below-container-content">
                  <MessageData />
                </div>
              ) :
                selectedContainer === 'feedback' ? (
                  <div className="below-container-content">
                  </div>
                ) : null}
      </div>
    </>
  );
}

export default ADashboard;
