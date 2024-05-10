// FAQComponent.js

import React, { useState } from 'react';
import { debounce } from 'lodash';
import './Faq.css';

const FAQ = () => {
    const initialFaqData = [
        {
            question: 'What are the check-in and check-out times?',
            answer: 'Check-in time is at 3:00 PM, and check-out time is at 12:00 PM. Early check-in and late check-out options are available upon request.'
        },
        {
            question: 'Do you provide airport shuttle service?',
            answer: 'Yes, we offer complimentary airport shuttle service for our guests. Please inform us of your flight details in advance for seamless arrangements.'
        },
        {
            question: 'Are pets allowed in the hotel?',
            answer: 'Unfortunately, pets are not allowed in our hotel. However, we can assist you in finding nearby pet-friendly accommodations.'
        },
        {
            question: 'Is there a swimming pool in the hotel?',
            answer: 'Yes, we have a luxurious outdoor swimming pool with a stunning view of the surroundings. It is open from 8:00 AM to 8:00 PM.'
        },
        {
            question: 'Do you offer room service?',
            answer: 'Yes, we provide 24/7 room service for our guests. Our menu includes a variety of gourmet dishes and beverages.'
        },
        {
            question: 'Is Wi-Fi available in the rooms?',
            answer: 'Yes, complimentary high-speed Wi-Fi is available in all rooms. You will receive login details upon check-in.'
        },
        {
            question: 'Are there any nearby attractions?',
            answer: 'Our hotel is situated near various attractions, including pristine beaches, upscale shopping centers, and cultural landmarks. Our concierge can provide recommendations and arrange transportation.'
        },
        {
            question: 'Can I book a meeting room for business events?',
            answer: 'Certainly! We have well-equipped meeting rooms available for booking. Our events team can assist you in planning and organizing successful business events.'
        },
        {
            question: 'Are smoking rooms available?',
            answer: 'We have both smoking and non-smoking room options. Please specify your preference during booking. Smoking is allowed only in designated areas for the comfort of all guests.'
        },
        {
            question: 'Do you provide laundry services?',
            answer: 'Yes, we offer prompt and efficient laundry and dry-cleaning services for our guests. Laundry bags and price lists are available in your room.'
        },
        {
            question: 'Is parking available?',
            answer: 'Complimentary valet parking is provided for our guests. Our staff will take care of parking your vehicle securely.'
        },
        {
            question: 'What dining options are available in the hotel?',
            answer: 'We take pride in offering a diverse range of dining options. Our hotel features multiple restaurants, each specializing in different cuisines. From fine dining to casual eateries, we aim to provide a delightful culinary experience.'
        },
        {
            question: 'Can I arrange for a special celebration or event at the hotel?',
            answer: "Absolutely! Our dedicated event planning team is at your service. Whether it's a birthday celebration, wedding reception, or corporate event, we will ensure that every detail is tailored to your preferences."
        },
        {
            question: 'Is there a fitness center in the hotel?',
            answer: 'Yes, we have a state-of-the-art fitness center equipped with the latest exercise machines and personal trainers. The fitness center is open 24/7 for our guests.'
        },
        {
            question: 'What safety measures are in place?',
            answer: 'We prioritize the safety and well-being of our guests. Our hotel adheres to strict safety protocols, including 24/7 security, surveillance, and regular sanitation of common areas. We are committed to providing a secure and comfortable environment for all our guests.'
        },
    ];

    const [searchTerm, setSearchTerm] = useState('');
    const [filteredFaqData, setFilteredFaqData] = useState(initialFaqData);
    const [expandedItems, setExpandedItems] = useState([]);

    const handleSearch = debounce(() => {
        const filteredData = initialFaqData.filter(
            item =>
                item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.answer.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredFaqData(filteredData);
    }, 200);

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
        handleSearch();
    };

    const toggleItem = (index) => {
        setExpandedItems((prevExpandedItems) => {
            const newExpandedItems = [...prevExpandedItems];
            newExpandedItems[index] = !newExpandedItems[index];
            return newExpandedItems;
        });
    };


    return (
        <>
            <div className='main-container'>
                <div className='faq-search'>
                    <input
                        type="text"
                        placeholder="Search for a question..."
                        value={searchTerm}
                        onChange={handleInputChange}
                    />
                </div>
            </div>
            <div className='faq-container'>
                <ul className='faq-ulist'>
                    {filteredFaqData.map((item, index) => (
                        <li key={index} className='faq-list'>
                            <div className='faqs' onClick={() => toggleItem(index)}>
                                <p>{index + 1+". " +item.question}<span className='arrow'>{expandedItems[index] ? <i className='fa-solid fa-chevron-up'></i> : <i className='fa-solid fa-chevron-down'></i>}</span></p>
                            </div>
                            <div className='answers'>
                                {expandedItems[index] && <p>{item.answer}</p>}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
};
export default FAQ;
