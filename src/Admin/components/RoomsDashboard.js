import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './StaffDashboard.css';
import AddRoom from './AddRooms.js';
import ViewRoom from './ViewRooms.js';



function RoomsDashboard() {
    const [selectedContainer, setSelectedContainer] = useState('room');

    const handleContainerChange = (container) => {
        setSelectedContainer(container);
    };

    return (
        <>
            <div className="staff-main-container">

                <button className='button-primary' onClick={() => handleContainerChange('viewrooms')}>View Rooms</button>

                <button className='button-primary' onClick={() => handleContainerChange('addrooms')}>Add Rooms</button>
            </div>

            <div className="below-container">
                {selectedContainer === 'viewrooms' ? (
                    <div className="below-container-content">
                        <ViewRoom/>
                    </div>
                ) : selectedContainer === 'addrooms' ? (
                    <div className="below-container-content">
                        <AddRoom />
                    </div>
                ) : null}
            </div>
        </>
    );
}

export default RoomsDashboard;
