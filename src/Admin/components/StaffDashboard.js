import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './StaffDashboard.css';
import AddStaff from './AddStaff.js';
import ViewStaff from './ViewStaff.js';
import UpdateStaff from './UpdateStaff.js';
import DeleteStaff from './DeleteStaff.js';


function StaffDashboard() {
    const [selectedContainer, setSelectedContainer] = useState('staff');

    const handleContainerChange = (container) => {
        setSelectedContainer(container);
    };

    return (
        <>
            <div className="staff-main-container">

                <button className='button-primary' onClick={() => handleContainerChange('viewstaff')}>View Staff</button>

                <button className='button-primary' onClick={() => handleContainerChange('addstaff')}>Add Staff</button>

                <button className='button-primary' onClick={() => handleContainerChange('updatestaff')}>Update Staff</button>

                <button className='button-primary' onClick={() => handleContainerChange('deletestaff')}>Delete Staff</button>

            </div>

            <div className="below-container">
                {selectedContainer === 'viewstaff' ? (
                    <div className="below-container-content">
                        <ViewStaff/>
                    </div>
                ) : selectedContainer === 'addstaff' ? (
                    <div className="below-container-content">
                        <AddStaff />
                    </div>
                ) : selectedContainer === 'updatestaff' ? (
                    <div className="below-container-content">
                        <UpdateStaff/>
                    </div>
                ) : selectedContainer === 'deletestaff' ? (
                    <div className="below-container-content">
                        <DeleteStaff/>
                    </div>
                ) : null}
            </div>
        </>
    );
}

export default StaffDashboard;
