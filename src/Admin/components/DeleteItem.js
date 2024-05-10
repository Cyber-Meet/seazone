import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import './DeleteMenu.css'; // Update the CSS file name if needed
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DeleteMenu = () => {
    const [menus, setMenus] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchMenus();
    }, []);

    const fetchMenus = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/menu');
            setMenus(response.data);
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    };

    const handleDeleteClick = async (menuId) => {
        try {
            await axios.delete(`http://localhost:5000/api/menus/${menuId}`);
            fetchMenus();
            toast.success('Menu item deleted successfully', { position: toast.POSITION.BOTTOM_RIGHT });
        } catch (error) {
            console.error('Error deleting menu item:', error);
            toast.error('Error deleting menu item', { position: toast.POSITION.BOTTOM_RIGHT });
        }
    };

    const filteredMenus = menus.filter((menus) => {
        const searchTermMatch = menus.item_name.toLowerCase().includes(searchTerm.toLowerCase());
        return searchTermMatch;
    });


    const handleSearchTermChange = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className="staff-container">
            <div className="filters">
                <input
                    type="text"
                    placeholder="Search Menus"
                    value={searchTerm}
                    onChange={handleSearchTermChange}
                />
            </div>

            <table className="table-container">
                <thead>
                    <tr>
                    <th>Item Name</th>
                        <th>Description</th>
                        <th>Origin</th>
                        <th>Category</th>
                        <th>Sub Category</th>
                        <th>Meal</th>
                        <th>Rating</th>
                        <th>Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredMenus.map((menu) => (
                        <tr key={menu._id}>
                            <td>{menu.item_name}</td>
                            <td>{menu.description}</td>
                            <td>{menu.origin}</td>
                            <td>{menu.category}</td>
                            <td>{menu.sub_category}</td>
                            <td>{menu.meal}</td>
                            <td>{menu.rating}</td>
                            <td>{menu.price}</td>
                            <td>
                                <button className="button-primary"  onClick={() => handleDeleteClick(menu._id)}>
                                    <i className='fa fa-trash'></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DeleteMenu;
