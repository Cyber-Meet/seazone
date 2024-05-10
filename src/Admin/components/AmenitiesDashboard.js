import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './StaffDashboard.css';
import AddAmenities from './AddAnemities.js';
import ViewAmenities from './ViewAmenities.js';



function AmenitiesDashboard() {
    const [selectedContainer, setSelectedContainer] = useState('room');

    const handleContainerChange = (container) => {
        setSelectedContainer(container);
    };

    return (
        <>
            <div className="staff-main-container">

                <button className='button-primary' onClick={() => handleContainerChange('viewamenities')}>View Amenities</button>

                <button className='button-primary' onClick={() => handleContainerChange('addamenities')}>Add Amenities</button>
            </div>

            <div className="below-container">
                {selectedContainer === 'viewamenities' ? (
                    <div className="below-container-content">
                        <ViewAmenities/>
                    </div>
                ) : selectedContainer === 'addamenities' ? (
                    <div className="below-container-content">
                        <AddAmenities />
                    </div>
                ) : null}
            </div>
        </>
    );
}

export default AmenitiesDashboard;
