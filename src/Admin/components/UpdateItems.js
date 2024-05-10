import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UpdateItem.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UpdateItem = () => {
    const [items, setItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);
    const [updatedItemData, setUpdatedItemData] = useState({
        photo_url: '',
        item_name: '',
        description: '',
        origin: '',
        category: '',
        sub_category: '',
        meal: '',
        rating: '',
        price: '',
    });

    const [validationErrors, setValidationErrors] = useState({});

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/menu');
            setItems(response.data);
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    };

    const validateInput = () => {
        const errors = {};

        // Example validation rules (customize as needed)
        if (!updatedItemData.item_name.trim()) {
            errors.item_name = 'Item Name is required';
        }

        if (!updatedItemData.description.trim()) {
            errors.description = 'Description is required';
        }

        if (!updatedItemData.price.toString().trim()) {
            errors.price = 'Price is required';
        } else if (!/^\d+(\.\d{1,2})?$/.test(updatedItemData.price)) {
            errors.price = 'Invalid price format';
        }

        if (!updatedItemData.category.trim()) {
            errors.category = 'Category is required';
        }

        if (!updatedItemData.meal.trim()) {
            errors.meal = 'Meal is required';
        }

        if (!updatedItemData.rating.toString().trim()) {
            errors.rating = 'Rating is required';
        } else if (!/^\d+(\.\d{1,2})?$/.test(updatedItemData.rating)) {
            errors.rating = 'Invalid rating format';
        }

        if (!updatedItemData.origin.trim()) {
            errors.origin = 'Origin is required';
        }

        if (!updatedItemData.sub_category.trim()) {
            errors.sub_category = 'sub_category is required';
        }

        if (!updatedItemData.photo_url.trim()) {
            errors.photo_url = 'Photo URL is required';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const filteredItems = items.filter((item) => {
        const searchTermMatch = item.item_name.toLowerCase().includes(searchTerm.toLowerCase());
        const categoryMatch = !categoryFilter || item.category === categoryFilter;

        return searchTermMatch && categoryMatch;
    });

    const handleSearchTermChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleCategoryFilterChange = (selectedCategory) => {
        setCategoryFilter(selectedCategory);
    };

    const handleEditClick = (item) => {
        setSelectedItem(item);
        setUpdatedItemData({
            photo_url: item.photo_url,
            item_name: item.item_name,
            description: item.description,
            origin: item.origin,
            category: item.category,
            sub_category: item.sub_category,
            meal: item.meal,
            rating: item.rating,
            price: item.price,
        });
        setValidationErrors({});
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedItemData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        setValidationErrors((prevErrors) => ({
            ...prevErrors,
            [name]: '', // Clear validation error when the input changes
        }));
    };

    const handleUpdateClick = async () => {
        if (validateInput()) {
            try {
                const itemId = selectedItem._id; // Assuming _id is the MongoDB document ID
                // Perform the update API call with updatedItemData
                await axios.put(`http://localhost:5000/api/menu/${itemId}`, updatedItemData);
                toast.success('Item updated successfully', { position: toast.POSITION.BOTTOM_RIGHT });

                // Fetch updated items
                fetchItems();

                // Reset selectedItem and updatedItemData
                setSelectedItem(null);
                setUpdatedItemData({
                    photo_url: '',
                    item_name: '',
                    description: '',
                    origin: '',
                    category: '',
                    sub_category: '',
                    meal: '',
                    rating: '',
                    price: '',
                });
            } catch (error) {
                console.error('Error updating item:', error);
                toast.error('Error updating item', { position: toast.POSITION.BOTTOM_RIGHT });
            }
        }
    };

    const handleCancelClick = () => {
        setSelectedItem(null);
        setUpdatedItemData({
            photo_url: '',
            item_name: '',
            description: '',
            origin: '',
            category: '',
            sub_category: '',
            meal: '',
            rating: '',
            price: '',
        });
    };

    return (
        <div className="updateitem-container">
            <div className="filters">
                <input
                    type="text"
                    placeholder="Search Items"
                    value={searchTerm}
                    onChange={handleSearchTermChange}
                />
                <select
                    value={categoryFilter}
                    onChange={(e) => handleCategoryFilterChange(e.target.value)}
                >
                    <option value="">Select Category</option>

                </select>
            </div>

            <table className="table-container">
                <thead>
                    <tr>
                        <th>Item Name</th>
                        <th>Description</th>
                        <th>Photo</th>
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
                    {filteredItems.map((item) => (
                        <tr key={item._id}>
                            <td>{item.item_name}</td>
                            <td>{item.description}</td>
                            <td style={{maxWidth:'100px',maxHeight:'60px',overflowWrap:'break-word',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{item.photo_url}</td>
                            <td>{item.origin}</td>
                            <td>{item.category}</td>
                            <td>{item.sub_category}</td>
                            <td>{item.meal}</td>
                            <td>{item.rating}</td>
                            <td>{item.price}</td>
                            <td>
                                <button className="button-primary" onClick={() => handleEditClick(item)}>
                                    <i className='fa-regular fa-pen-to-square'></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {selectedItem && (
                <div className="updateitem-form">
                    <div className='left-container'>
                        <h2>Update {selectedItem.item_name}</h2>
                        <label>
                            Photo URL:
                            <input
                                type='text'
                                name="photo_url"
                                value={updatedItemData.photo_url}
                                onChange={handleInputChange}
                            />
                            {validationErrors.photo_url && (
                                <div className="error-message">{validationErrors.photo_url}</div>
                            )}
                        </label>
                        <label>
                            Item Name:
                            <input
                                type="text"
                                name="item_name"
                                value={updatedItemData.item_name}
                                onChange={handleInputChange}
                            />
                            {validationErrors.item_name && (
                                <div className="error-message">{validationErrors.item_name}</div>
                            )}
                        </label>
                        <label>
                            Description:
                            <input  
                                type='text'
                                name="description"
                                value={updatedItemData.description}
                                onChange={handleInputChange}
                            />
                            {validationErrors.description && (
                                <div className="error-message">{validationErrors.description}</div>
                            )}
                        </label>
                        <label>
                            Origin:
                            <input
                                type="text"
                                name="origin"
                                value={updatedItemData.origin}
                                onChange={handleInputChange}
                            />
                            {validationErrors.origin && (
                                <div className="error-message">{validationErrors.origin}</div>
                            )}
                        </label>
                        <button className="button-tertiary" onClick={handleCancelClick}>
                            Cancel
                        </button>
                    </div>
                    <div className='right-container'>
                        <label>
                            Category:
                            <input
                                type="text"
                                name="category"
                                value={updatedItemData.category}
                                onChange={handleInputChange}
                            />
                            {validationErrors.category && (
                                <div className="error-message">{validationErrors.category}</div>
                            )}
                        </label>
                        <label>
                            Sub Category:
                            <input
                                type="text"
                                name="sub_category"
                                value={updatedItemData.sub_category}
                                onChange={handleInputChange}
                            />
                            {validationErrors.sub_category && (
                                <div className="error-message">{validationErrors.sub_category}</div>
                            )}
                        </label>
                        <label>
                            Meal:
                            <input
                                type="text"
                                name="meal"
                                value={updatedItemData.meal}
                                onChange={handleInputChange}
                            />
                            {validationErrors.meal && (
                                <div className="error-message">{validationErrors.meal}</div>
                            )}
                        </label>
                        <label>
                            Rating:
                            <input
                                type="text"
                                name="rating"
                                value={updatedItemData.rating}
                                onChange={handleInputChange}
                            />
                            {validationErrors.rating && (
                                <div className="error-message">{validationErrors.rating}</div>
                            )}
                        </label>
                        <label>
                            Price:
                            <input
                                type="text"
                                name="price"
                                value={updatedItemData.price}
                                onChange={handleInputChange}
                            />
                            {validationErrors.price && (
                                <div className="error-message">{validationErrors.price}</div>
                            )}
                        </label>
                        <button className="button-tertiary" onClick={handleUpdateClick}>
                            Update
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UpdateItem;
