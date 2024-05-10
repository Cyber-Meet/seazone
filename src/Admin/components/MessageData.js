import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MessageData.css';

const MessageData = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        fetchMessages();
    }, []); // Fetch messages once when the component mounts

    // Handle completion of a message
    const handleStatus = async (messageId) => {
        try {
            // Make an API call to mark the message as completed
            await axios.put(`http://localhost:5000/api/messages/${messageId}/status`);
            // Fetch updated messages after completion
            fetchMessages();
        } catch (error) {
            console.error('Error completing message:', error);
        }
    };

    // Handle deletion of a message
    const handleDelete = async (messageId) => {
        try {
            // Make an API call to delete the message
            await axios.delete(`http://localhost:5000/api/messages/${messageId}`);
            // Fetch updated messages after deletion
            fetchMessages();
        } catch (error) {
            console.error('Error deleting message:', error);
        }
    };

    // Fetch messages function
    const fetchMessages = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/messages');
            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    // Filter messages based on search term, start date, and end date
    const filteredMessages = messages.filter((message) => {
        const searchTermMatch = message.fullName.toLowerCase().includes(searchTerm.toLowerCase()); // Update to "fullName"
        const startDateMatch = startDate ? new Date(message.date) >= new Date(startDate) : true;
        const endDateMatch = endDate ? new Date(message.date) <= new Date(endDate) : true;

        return searchTermMatch && startDateMatch && endDateMatch;
    });

    // Handle changes in the search term input
    const handleSearchTermChange = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className="message-container">
            <div className="filters">
                {/* Search term input */}
                <input
                    type="text"
                    placeholder="Search Messages"
                    value={searchTerm}
                    onChange={handleSearchTermChange}
                />

                {/* Start date input */}
                <label>
                    From Date:
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </label>

                {/* End date input */}
                <label>
                    To Date:
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </label>
            </div>

            {/* Table displaying filtered messages */}
            <table className="table-container">
                <thead>
                    <tr>
                        <th>Sender Name</th>
                        <th>Subject</th>
                        <th>Content</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                        {/* Add more table headers as needed */}
                    </tr>
                </thead>
                <tbody>
                    {filteredMessages.map((message) => (
                        <tr key={message._id}>
                            <td>{message.fullName}</td> {/* Update to "fullName" */}
                            <td>{message.subject}</td>
                            <td>{message.message}</td>
                            <td>{new Date(message.date).toLocaleDateString()}</td>
                            <td>{message.status === 'Pending' ? (
                                <span style={{ color: 'red' }}>Pending</span>
                            ) : (
                                <span style={{ color: 'green' }}>Completed</span>
                            )}</td>
                            <td>
                                <button className='status' onClick={() => handleStatus(message._id)}>
                                    <i className="fas fa-check"></i>
                                </button>
                                <button className='delete' onClick={() => handleDelete(message._id)}>
                                    <i className="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MessageData;
