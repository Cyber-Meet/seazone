import React, { useState } from 'react';

const AddAmenities = () => {
    const [amenitiesData, setAmenitiesData] = useState({
        amenityName: '',
        description: '',
        photo_url1: '',
        photo_url2: '',
        price: 0,
        serviceType: '',
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAmenitiesData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!amenitiesData.amenityName.trim()) {
            newErrors.amenityName = 'Amenity Name is required';
        }

        // Add additional validations as needed...

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleCancelClick = () => {
        // Reset form values and errors
        setAmenitiesData({
            amenityName: '',
            description: '',
            photo_url1: '',
            photo_url2: '',
            price: 0,
            serviceType: '',
        });

        setErrors({});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            console.error('Form validation failed');
            return;
        }

        // Assuming you have a separate API endpoint for amenities
        try {
            const response = await fetch('http://localhost:5000/api/amenities', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(amenitiesData),
            });

            if (response.ok) {
                console.log('Amenity added successfully');
                // Reset form values and errors after successful submission
                setAmenitiesData({
                    amenityName: '',
                    description: '',
                    photo_url1: '',
                    photo_url2: '',
                    price: 0,
                    serviceType: '',
                });
            } else {
                console.error('Failed to add amenity');
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    return (
        <div className="main-container">
            <div className='left-container'>
                <form onSubmit={handleSubmit} className="form">
                    <div className="form-row">
                        <label>
                            Amenity Name:
                            <input
                                type="text"
                                name="amenityName"
                                value={amenitiesData.amenityName}
                                onChange={handleChange}
                                className={errors.amenityName ? 'error' : ''}
                            />
                            {errors.amenityName && <span className="error-message">{errors.amenityName}</span>}
                        </label>
                    </div>

                    <div className="form-row">
                        <label>
                            Description:
                            <input
                                type="text"
                                name="description"
                                value={amenitiesData.description}
                                onChange={handleChange}
                                className={errors.description ? 'error' : ''}
                            />
                            {errors.description && <span className="error-message">{errors.description}</span>}
                        </label>
                    </div>

                    <div className="form-row">
                        <label>
                            Photo URL 1:
                            <input
                                type="text"
                                name="photo_url1"
                                value={amenitiesData.photo_url1}
                                onChange={handleChange}
                                className={errors.photo_url1 ? 'error' : ''}
                            />
                            {errors.photo_url1 && <span className="error-message">{errors.photo_url1}</span>}
                        </label>
                    </div>
                </form>
            </div>
            <div className='right-container'>
                <form onSubmit={handleSubmit} className="form">
                    <div className="form-row">
                        <label>
                            Photo URL 2:
                            <input
                                type="text"
                                name="photo_url2"
                                value={amenitiesData.photo_url2}
                                onChange={handleChange}
                                className={errors.photo_url2 ? 'error' : ''}
                            />
                            {errors.photo_url2 && <span className="error-message">{errors.photo_url2}</span>}
                        </label>
                    </div>

                    <div className="form-row">
                        <label>
                            Price:
                            <input
                                type="number"
                                name="price"
                                value={amenitiesData.price}
                                onChange={handleChange}
                                className={errors.price ? 'error' : ''}
                            />
                            {errors.price && <span className="error-message">{errors.price}</span>}
                        </label>
                    </div>
                    {/* select service type */}
                    <div className="form-row">
                        <label>
                            Service Type:
                            <select
                                name="serviceType"
                                value={amenitiesData.serviceType}
                                onChange={handleChange}
                                className={errors.serviceType ? 'error' : ''}
                            >
                                <option value="Included">Included</option>
                                <option value="Value Added">Value Added</option>
                            </select>
                            {errors.serviceType && <span className="error-message">{errors.serviceType}</span>}
                        </label>
                    </div>
                    <div className='button-container'>
                        <button className="button-tertiary" type="button" onClick={handleCancelClick}>
                            Cancel
                        </button>
                        <button className="button-tertiary" type="submit" onClick={handleSubmit}>
                            Add Amenity
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddAmenities;
