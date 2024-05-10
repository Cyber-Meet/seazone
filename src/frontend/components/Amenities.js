// Amenities.js

import React, { useState, useEffect } from 'react';
import './Amenities.css';

const Amenities = () => {
  const [amenitiesData, setAmenitiesData] = useState([]);

  useEffect(() => {
    // Fetch amenity data from your API endpoint
    const fetchAmenitiesData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/amenities');
        if (response.ok) {
          const data = await response.json();
          setAmenitiesData(data);
        } else {
          console.error('Failed to fetch amenity data');
        }
      } catch (error) {
        console.error('Error:', error.message);
      }
    };

    fetchAmenitiesData();
  }, []);
  const includedAmenities = amenitiesData.filter((amenity) => amenity.serviceType === 'Included');
  const otherAmenities = amenitiesData.filter((amenity) => amenity.serviceType !== 'Included');
  return (
    <>
    <div className="awelcome">
      {includedAmenities.map((amenity, index) => (
        <div key={index} className={index % 2 === 0 ? 'aintro' : 'aintro-reverse'}>
          <div className="aintro-text">
            <h2>{amenity.amenityName}</h2>
            <p>{amenity.description}</p>
            <p style={{ color: 'green' }}>Inc with booking</p>
          </div>
          <div className='aimage'>
            <img src={amenity.photo_url1} alt={`Amenity ${index + 1}`} />
            <img src={amenity.photo_url2} alt={`Amenity ${index + 1}`} />
          </div>
        </div>
      ))}
    </div>

    <div className="awelcome">
      {otherAmenities.map((amenity, index) => (
        <div key={index} className={index % 2 === 0 ? 'aintro' : 'aintro-reverse'}>
          <div className="aintro-text">
            <h2>{amenity.amenityName}</h2>
            <p>{amenity.description}</p>
            <p style={{color:'black'}}><span style={{color:'red'}}>*</span> Need to pay</p>
          </div>
          <div className='aimage'>
            <img src={amenity.photo_url1} alt={`Amenity ${index + 1}`} />
            <img src={amenity.photo_url2} alt={`Amenity ${index + 1}`} />
          </div>
        </div>
      ))}
    </div>
  </>
  );
};

export default Amenities;
