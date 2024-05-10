import React, { useState } from 'react';
import axios from 'axios';
import './AddMenuItem.css';

const AddMenuItem = () => {
  const [menuItem, setMenuItem] = useState({
    photo_url: '',
    item_name: '',
    description: '',
    origin: '',
    category: '',
    subcategory: '',
    meal: '',
    rating: '',
    price: '',
  });

  const [validationErrors, setValidationErrors] = useState({});

  const validationRules = {
    photo_url: {
      required: true,
    },
    item_name: {
      required: true,
    },
    description: {
      required: true,
    },
    origin: {
      required: true,
      pattern: /^[a-zA-Z\s]*$/,
    },
    category: {
      required: true,
      pattern: /^[a-zA-Z\s]*$/,
    },
    sub_category: {
      required: true,
      pattern: /^[a-zA-Z\s]*$/,
    },
    meal: {
      required: true,
      pattern: /^[a-zA-Z\s]*$/,
    },
    rating: {
      required: true,
      pattern: /^\d+(\.\d{1,2})?$/, // Allow positive numbers with up to two decimal places
    },
    price: {
      required: true,
      pattern: /^\d+(\.\d{1,5})?$/, // Allow positive numbers with up to two decimal places
    },
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMenuItem((prevMenuItem) => ({
      ...prevMenuItem,
      [name]: value,
    }));
    // Validate the input dynamically
    validateInput(name, value);
  };

  const validateInput = (name, value) => {
    const rules = validationRules[name];
    const errors = {};

    if (rules.required && value.trim() === '') {
      errors[name] = 'This field is required';
    } else if (rules.pattern && !rules.pattern.test(value)) {
      errors[name] = 'Invalid format';
    }

    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errors[name] || null,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Check validation for all fields
    const errors = {};
    Object.keys(validationRules).forEach((fieldName) => {
      validateInput(fieldName, menuItem[fieldName]);
      if (validationErrors[fieldName]) {
        errors[fieldName] = validationErrors[fieldName];
      }
    });
  
    if (Object.keys(errors).length > 0) {
      // Validation failed, handle accordingly
      console.log('Validation failed:', errors);
      return;
    }
  
    // Validation passed, proceed with form submission
  
    try {
      // Make a POST request to the API endpoint
      const response = await axios.post('http://localhost:5000/api/menu', menuItem);
  
      console.log('Menu item added successfully:', response.data);
      //reset data
      setMenuItem({
        photo_url: '',
        item_name: '',
        description: '',
        origin: '',
        category: '',
        subcategory: '',
        meal: '',
        rating: '',
        price: '',
      });
      // Optionally, you can reset the form or update the UI accordingly
    } catch (error) {
      console.error('Error adding menu item:', error);
      // Handle error and update UI
    }
  };
  return (
    <div className='main-container'>
        <div className='left-container'>
      <form onSubmit={handleSubmit} className='form-container'>
          <label>
            Photo URL:
            <input type="text" name="photo_url" value={menuItem.photo_url} onChange={handleInputChange} />
            {validationErrors.photo_url && <span className="error">{validationErrors.photo_url}</span>}
          </label>
          <label>
            Item Name:
            <input type="text" name="item_name" value={menuItem.item_name} onChange={handleInputChange} />
            {validationErrors.item_name && <span className="error">{validationErrors.item_name}</span>}
          </label>
          <label>
            Description:
            <input type="text" name="description" value={menuItem.description} onChange={handleInputChange} />
            {validationErrors.description && <span className="error">{validationErrors.description}</span>}
          </label>
          <label>
            Origin:
            <input type="text" name="origin" value={menuItem.origin} onChange={handleInputChange} />
            {validationErrors.origin && <span className="error">{validationErrors.origin}</span>}
          </label>
          <label>
            Category:
            <input
              type="text"
              name="category"
              value={menuItem.category}
              onChange={handleInputChange}
              />
            {validationErrors.category && <span className="error">{validationErrors.category}</span>}
          </label>
          </form>
        </div>
        <div className='right-container'>
          <form onSubmit={handleSubmit} className='form-container'>
          <label>
            Sub Category:
            <input type="text" name="sub_category" value={menuItem.sub_category} onChange={handleInputChange} />
            {validationErrors.sub_category && <span className="error">{validationErrors.sub_category}</span>}
          </label>
          <label>
            Meal:
            <input type="text" name="meal" value={menuItem.meal}  onChange={handleInputChange} />
            {validationErrors.meal && <span className="error">{validationErrors.meal}</span>}
          </label>
          <label>
            Rating:
            <input type="text" name="rating" value={menuItem.rating} onChange={handleInputChange} />
            {validationErrors.rating && <span className="error">{validationErrors.rating}</span>}
          </label>
          <label>
            Price:
            <input type="text" name="price" value={menuItem.price} onChange={handleInputChange} />
            {validationErrors.price && <span className="error">{validationErrors.price}</span>}
          </label>
          <button type="submit" className='button-tertiary'>Add Item</button>
          </form>
        </div>
    </div>
  );
};

export default AddMenuItem;
