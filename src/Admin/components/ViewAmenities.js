import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ViewRooms.css';  // Ensure you have the corresponding CSS file
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ViewAmenities = () => {
    const [amenities, setAmenities] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAmenity, setSelectedAmenity] = useState(null);
    const [updatedAmenityData, setUpdatedAmenityData] = useState({
        amenityName: '',
        description: '',
        photo_url1: '',
        photo_url2: '',
        price: 0,
        serviceType: '',
    });

    const [validationErrors, setValidationErrors] = useState({});
    //get user type from session
    const userType = sessionStorage.getItem('user_type');

    useEffect(() => {
        fetchAmenities();
    }, []);

    const fetchAmenities = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/amenities');
            setAmenities(response.data);
        } catch (error) {
            console.error('Error fetching amenities:', error);
        }
    };

    const validateInput = () => {
        const errors = {};

        // Example validation rules (customize as needed)
        if (!updatedAmenityData.amenityName.trim()) {
            errors.amenityName = 'Amenity Name is required';
        }

        // Add additional validation rules...

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const filteredAmenities = Array.isArray(amenities)
        ? amenities.filter((amenity) => {
            const searchTermMatch = amenity.amenityName.toLowerCase().includes(searchTerm.toLowerCase());

            return searchTermMatch;
        })
        : [];

    const handleSearchTermChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleEditClick = (amenity) => {
        setSelectedAmenity(amenity);
        setUpdatedAmenityData({
            amenityName: amenity.amenityName,
            description: amenity.description || '',
            photo_url1: amenity.photo_url1 || '',
            photo_url2: amenity.photo_url2 || '',
            price: amenity.price,
            serviceType: amenity.serviceType || '',
        });
        setValidationErrors({});
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // If the input is 'price', parse it as a float
        const parsedValue = name === 'price' ? parseFloat(value) : value;

        setUpdatedAmenityData((prevData) => ({
            ...prevData,
            [name]: parsedValue,
        }));
        setValidationErrors((prevErrors) => ({
            ...prevErrors,
            [name]: '', // Clear validation error when the input changes
        }));
    };
    const handleUpdateClick = async () => {
        if (validateInput()) {
            try {
                const amenityId = selectedAmenity._id; // Assuming _id is the MongoDB document ID
                // Perform the update API call with updatedAmenityData
                await axios.put(`http://localhost:5000/api/amenities/${amenityId}`, updatedAmenityData);
                toast.success('Amenity updated successfully', { position: toast.POSITION.BOTTOM_RIGHT });
                console.log('Amenity updated successfully');
                // Fetch updated amenities
                fetchAmenities();

                // Reset selectedAmenity and updatedAmenityData
                setSelectedAmenity(null);
                setUpdatedAmenityData({
                    amenityName: '',
                    description: '',
                    photo_url1: '',
                    photo_url2: '',
                    price: '',
                    serviceType: '',
                });
                console.log('Updated amenity:', updatedAmenityData);
            } catch (error) {
                console.error('Error updating amenity:', error);
                toast.error('Error updating amenity', { position: toast.POSITION.BOTTOM_RIGHT });
            }
        }
    };

    const handleDeleteClick = async () => {
        try {
            if (selectedAmenity && selectedAmenity._id) {
                const amenityId = selectedAmenity._id;

                // Perform the delete API call
                await axios.delete(`http://localhost:5000/api/amenities/${amenityId}`);

                toast.success('Amenity deleted successfully', { position: toast.POSITION.BOTTOM_RIGHT });

                // Fetch updated amenities
                fetchAmenities();

                // Reset selectedAmenity and updatedAmenityData
                setSelectedAmenity(null);
                setUpdatedAmenityData({
                    amenityName: '',
                    description: '',
                    photo_url1: '',
                    photo_url2: '',
                    price: '',
                    serviceType: '',
                });
            } else {
                console.error('Error: selectedAmenity is null or does not have _id property');
                toast.error('Error deleting amenity', { position: toast.POSITION.BOTTOM_RIGHT });
            }
        } catch (error) {
            console.error('Error deleting amenity:', error);
            toast.error('Error deleting amenity', { position: toast.POSITION.BOTTOM_RIGHT });
        }
    };
    const handleCancelClick = () => {
        setSelectedAmenity(null);
        setUpdatedAmenityData({
            amenityName: '',
            description: '',
            photo_url1: '',
            photo_url2: '',
            price: '',
            serviceType: '',
        });
    }

    return (
        <div className="updateroom-container">
            <div className="filters">
                <input
                    type="text"
                    placeholder="Search Amenities"
                    value={searchTerm}
                    onChange={handleSearchTermChange}
                />
            </div>

            <table className="table-container">
                <thead>
                    <tr>
                        <th>Amenity Name</th>
                        <th>Description</th>
                        {userType !== 'staff' && (
                            <>
                                <th>Photo URL 1</th>
                                <th>Photo URL 2</th>
                            </>
                        )}
                        <th>Price</th>
                        <th>Service Type</th>
                        {userType !== 'staff' && (
                            <>
                                <th>Actions</th>
                            </>
                        )}

                    </tr>
                </thead>
                <tbody>
                    {filteredAmenities.map((amenity) => (
                        <tr key={amenity._id}>
                            <td>{amenity.amenityName}</td>
                            <td style={{ maxWidth: '100px', maxHeight: '60px', overflowWrap: 'break-word', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {amenity.description}
                            </td>
                            {userType !== 'staff' && (
                                <>
                                    <td style={{ maxWidth: '100px', maxHeight: '60px', overflowWrap: 'break-word', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {amenity.photo_url1}
                                    </td>
                                    <td style={{ maxWidth: '100px', maxHeight: '60px', overflowWrap: 'break-word', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {amenity.photo_url2}
                                    </td>
                                </>

                            )}
                            <td>{"₹ " + amenity.price + "/-"}</td>
                            <td>{amenity.serviceType}</td>
                            {userType !== 'staff' && (
                                <>
                            <td style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly' }}>
                                <button className="button-primary" onClick={() => handleEditClick(amenity)} style={{ marginBottom: '10px', marginLeft: '0' }}>
                                    <i className='fa-regular fa-pen-to-square'></i>
                                </button>
                                <button className="button-primary" onClick={handleDeleteClick} style={{ marginLeft: '0' }}>
                                    <i className='fa-solid fa-trash'></i>
                                </button>
                            </td>
                            </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
            {selectedAmenity && (
                <div className="update-form">
                    <div className='left-container'>
                        <label style={{ marginTop: '10px' }}>
                            Amenity Name:
                            <input type="text" name="amenityName" value={updatedAmenityData.amenityName} onChange={handleInputChange} />
                            {validationErrors.amenityName && <div className="error-message">{validationErrors.amenityName}</div>}
                        </label>
                        <label>
                            Description:
                            <input type="text" name="description" value={updatedAmenityData.description} onChange={handleInputChange}></input>
                        </label>
                        <label>
                            Photo URL 1:
                            <input type="text" name="photo_url1" value={updatedAmenityData.photo_url1} onChange={handleInputChange} />
                        </label>

                    </div>

                    <div className='right-container'>
                        <label>
                            Photo URL 2:
                            <input type="text" name="photo_url2" value={updatedAmenityData.photo_url2} onChange={handleInputChange} />
                        </label>
                        <label>
                            Service Type:
                            <select
                                name="serviceType"
                                value={updatedAmenityData.serviceType}
                                onChange={handleInputChange}
                            >
                                <option value="Included">Included</option>
                                <option value="Value Added">Value Added</option>
                            </select>
                        </label>
                        <label>
                            Price:
                            <input type="text" name="price" value={updatedAmenityData.price} onChange={handleInputChange} />
                        </label>
                        <div className="button-container">
                            <button className="button-tertiary" onClick={handleUpdateClick}>Update</button>
                            <button className="button-tertiary" onClick={handleCancelClick}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewAmenities;
