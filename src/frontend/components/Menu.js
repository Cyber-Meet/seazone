import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../components/Menu.css';
import FoodLoader from './FoodLoader';

const Menu = () => {
  const [menus, setMenus] = useState([]);
  const [filteredMenus, setFilteredMenus] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    category: '',
    subcategory: '',
    meal: '',
    origin: '',
    priceRange: '',
    searchTerm: '',
  });

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        // Make a GET request to the API endpoint
        const response = await axios.get('http://localhost:5000/api/menu');
        setMenus(response.data);
      } catch (error) {
        console.error('Error fetching menus:', error);
        // Handle error and update UI accordingly
      }
    };

    fetchMenus();
  }, []); // Empty dependency array ensures the effect runs only once, similar to componentDidMount

  useEffect(() => {
    // Shuffle the menus array to get a random order
    const shuffledMenus = [...menus].sort(() => Math.random() - 0.5);
    setFilteredMenus(shuffledMenus);
  }, [menus]);


  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSelectedFilters({ ...selectedFilters, searchTerm });
    setFilteredMenus(searchTerm === '' ? menus : filteredMenus);
    applyFilters();
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setSelectedFilters({ ...selectedFilters, [name]: value });
  };

  const handleApplyFilters = () => {
    applyFilters();
  };

  const handleClearFilters = () => {
    setSelectedFilters({
      category: '',
      subcategory: '',
      meal: '',
      origin: '',
      priceRange: '',
      searchTerm: '',
    });
    setFilteredMenus(menus); // Reset filteredMenus to all items
    applyFilters();
  };

  const applyFilters = () => {
    // Apply filters here based on selectedFilters
    const filtered = menus.filter((menu) => {
      // Customize the logic based on your needs
      return (
        (selectedFilters.category === '' || menu.category.toLowerCase() === selectedFilters.category) &&
        (selectedFilters.subcategory === '' || menu.sub_category.toLowerCase() === selectedFilters.subcategory) &&
        (selectedFilters.meal === '' || menu.meal.toLowerCase() === selectedFilters.meal) &&
        (selectedFilters.origin === '' || menu.origin.toLowerCase() === selectedFilters.origin) &&
        // Add logic for price range filtering
        (selectedFilters.priceRange === '' || checkPriceRange(menu.price, selectedFilters.priceRange)) &&
        // Search term filtering
        (selectedFilters.searchTerm === '' || checkSearchTerm(menu, selectedFilters.searchTerm))
      );
    });

    setFilteredMenus(filtered);
  };

  const handleDropdown = () => {
    const dropdown = document.querySelector('.dropdown');
    dropdown.classList.toggle('active');
    //hide filter button
    const filterButton = document.getElementById('filter-button');
    if (filterButton) {
      filterButton.classList.toggle('hidden');
    }
  };

  const handleClose = () => {
    const dropdown = document.querySelector('.dropdown');
    dropdown.classList.remove('active');

    //show filter button
    const filterButton = document.getElementById('filter-button');
    if (filterButton) {
      filterButton.classList.remove('hidden');
    }
  };

  const checkPriceRange = (price, range) => {
    const [minRange, maxRange] = range.split('-').map(Number);
  
    // Check if the menu item's price is within the selected range
    return price >= minRange && price <= maxRange;
  };

  const checkSearchTerm = (menu, term) => {
    // Placeholder logic to check if menu matches the search term
    return (
      menu.item_name.toLowerCase().includes(term) ||
      menu.category.toLowerCase().includes(term) ||
      menu.sub_category.toLowerCase().includes(term) ||
      menu.meal.toLowerCase().includes(term) ||
      menu.origin.toLowerCase().includes(term)
    );
  };

  return (
    <div>
      <div className="search-container">
        {/* Search input */}
        <input
          type="text"
          placeholder="Search by name, category, sub-category, meal, or origin"
          value={selectedFilters.searchTerm}
          onChange={handleSearch}
        />

        <button className='button-tertiary' id='filter-button' onClick={handleDropdown}>Filters</button>
        <div className='dropdown'>
          {/* Filter dropdowns */}
          <select name="category" value={selectedFilters.category} onChange={handleFilterChange}>
            <option value="">SelectCategories</option>
            {Array.from(new Set(menus.map((menu) => menu.category))).map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </select>

          <select name="subcategory" value={selectedFilters.subcategory} onChange={handleFilterChange}>
            <option value="">Select Subcategory</option>
            {Array.from(new Set(menus.map((menu) => menu.sub_category))).map((subcategory, index) => (
              <option key={index} value={subcategory}>{subcategory}</option>
            ))}
          </select>

          <select name="meal" value={selectedFilters.meal} onChange={handleFilterChange}>
            <option value="">Select Meal</option>
            {Array.from(new Set(menus.map((menu) => menu.meal))).map((meal, index) => (
              <option key={index} value={meal}>{meal}</option>
            ))}
          </select>

          <select name="origin" value={selectedFilters.origin} onChange={handleFilterChange} style={{marginBottom: '1rem'}}>
            <option value="">Select Origin</option>
            {Array.from(new Set(menus.map((menu) => menu.origin))).map((origin, index) => (
              <option key={index} value={origin}>{origin}</option>
            ))}
          </select>

          <div className="filter-buttons">
            <button className='button-tertiary' onClick={handleApplyFilters} style={{ marginLeft: '0px', marginBottom: '1rem' }}>Apply Filters</button>
            <button className="button-tertiary" onClick={handleClearFilters} style={{ marginLeft: '0px', marginBottom: '1rem' }}>Clear Filters</button>
            <button className='button-tertiary' onClick={handleClose} style={{ background: 'red', marginLeft: '0px' }}><i className="fa-solid fa-xmark"></i></button>
          </div>
        </div>
      </div>

      {/* Display filtered menus */}
      <div className="food-grid">
            {/* Display all ites by default and if filters are applied then and then show filtered items */}
        {filteredMenus.length > 0 ? filteredMenus.map((menu) => <FoodCard key={menu.id} menu={menu} />) : menus.map((menu) => <FoodCard key={menu.id} menu={menu} />)}
      </div>
    </div>
  );
};

const FoodCard = ({ menu }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div className="food-card">
      {!imageLoaded && <FoodLoader />} 
      <img 
        src={menu.photo_url} 
        alt={menu.item_name} 
        style={{ display: imageLoaded ? 'block' : 'none' }} 
        onLoad={handleImageLoad} 
      />
      <div className="food-info">
        <h3>{menu.item_name}</h3>
        <p>{menu.description}</p>
      </div>
      <div className="food-info2">
        <p>Origin: {menu.origin}</p>
        <p>Category: {menu.category}</p>
        <p>Subcategory: {menu.sub_category}</p>
        <p>Meal: {menu.meal}</p>
      </div>
      <div className="price-info">
        <p>
          Rating: {menu.rating} <i className="fa-solid fa-star"></i>
        </p>
        <p>Price: {"₹ " + menu.price + "/-"}</p>
      </div>
    </div>
  );
};

export default Menu;
