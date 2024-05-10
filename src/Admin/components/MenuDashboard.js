import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MenuDashboard.css';
import AddMenuItem from './AddMenuItem.js';
import Menu from './ViewItems.js';
import UpdateItem from './UpdateItems.js';
import DeleteMenu from './DeleteItem.js';

function MenuDashboard() {
    const [selectedContainer, setSelectedContainer] = useState('staff');

    const handleContainerChange = (container) => {
        setSelectedContainer(container);
    };

    return (
        <>
            <div className="menu-main-container">
                <button className='button-primary' onClick={() => handleContainerChange('viewitem')}>View Items</button>
                <button className='button-primary' onClick={() => handleContainerChange('additem')}>Add Items</button>
                <button className='button-primary' onClick={() => handleContainerChange('updateitem')}>Update Items</button>
                <button className='button-primary' onClick={() => handleContainerChange('deleteitem')}>Delete Items</button>

            </div>

            <div className="below-container">
                {selectedContainer === 'viewitem' ? (
                    <div className="below-container-content">
                        <Menu/>
                    </div>
                ) : selectedContainer === 'additem' ? (
                    <div className="below-container-content">
                        <AddMenuItem />
                    </div>
                ) : selectedContainer === 'updateitem' ? (
                    <div className="below-container-content">
                        <UpdateItem/>
                    </div>
                ) : selectedContainer === 'deleteitem' ? (
                    <div className="below-container-content">
                        <DeleteMenu/>
                    </div>
                ) :null}
            </div>
        </>
    );
}

export default MenuDashboard;
