import React, { useState, useEffect } from 'react';
import './ContactUs.css';

function ContactUs() {
    const [formData, setFormData] = useState({
        fullName: "",
        tshid: "",
        email: "",
        subject: '',
        message: '',
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        const storedTshId = sessionStorage.getItem('tshid');
        const storedFullName = sessionStorage.getItem('fullName');
        const storedEmail = sessionStorage.getItem('email');

        setFormData(prevData => ({
            ...prevData,
            fullName: storedFullName || formData.fullName,
            tshid: storedTshId || formData.tshid,
            email: storedEmail || formData.email,
        }));
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Dynamic validation
        let error = '';

        if (name === 'fullName') {
            const trimmedValue = value.trim();
            if (trimmedValue.length < 3 || trimmedValue.length > 50) {
                error = 'Full Name should be between 3 and 50 characters';
            }
        }

        if (name === 'email') {
            const trimmedValue = value.trim();
            if (!trimmedValue.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
                error = 'Please enter a valid email';
            }
        }

        if (name === 'message') {
            const trimmedValue = value.trim();
            if (trimmedValue.length < 10 || trimmedValue.length > 100) {
                error = 'Message should be between 10 and 100 characters';
            }
        }
        if (name === 'subject') {
            const trimmedValue = value.trim();
            if (trimmedValue.length < 5 || trimmedValue.length > 50) {
                error = 'Subject should be between 5 and 50 characters';
            }
        }

        setErrors(prevErrors => ({ ...prevErrors, [name]: error }));
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check for errors before submitting
        if (Object.values(errors).some((error) => error !== '') ||
            Object.values(formData).some(value => value === '') || formData.message === '' || formData.subject === '') {
            alert('Please fill all the fields correctly!!');
            return;
        }

        // Send data to the server (assuming you have the server API implemented)
        try {
            const response = await fetch('http://localhost:5000/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            await response.json();
            alert('Message sent successfully!!');

            // Optionally, you can reset the form after successful submission
            setFormData({
                fullName: "",
                tshid: "",
                email: "",
                subject: '',
                message: '',
                status: 'Pending',
            });
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div className='main-container'>
            <div className='left-container'>
                <iframe
                    className='gmap'
                    title="Google Maps"
                    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d489.90496356045765!2d75.910778!3d10.792944000000002!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba7bbe6092223b3%3A0xab60d8a84283d134!2sSea%20Zone%20Resort!5e0!3m2!1sen!2sin!4v1708314258829!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                />
            </div>
            <div className='right-container'>
                <form className='form-contact' onSubmit={handleSubmit}>
                    <h1 style={{ color: '#d9bf61' }}>Send us a Message!</h1>
                    <input
                        name='fullName'
                        placeholder={formData.fullName ? formData.fullName : "Enter Full Name"}
                        value={formData.fullName}
                        onChange={handleInputChange}
                    />
                    {errors.fullName && <span className='error'>{errors.fullName}</span>}

                    <input className='tshid-hide'
                        name='tshid'
                        placeholder={formData.tshid ? formData.tshid : "Enter TSH ID"}
                        value={formData.tshid}
                        onChange={handleInputChange}
                    />
                    {errors.tshid && <span className='error'>{errors.tshid}</span>}

                    <input
                        name='email'
                        placeholder={formData.email ? formData.email : "Enter Email"}
                        value={formData.email}
                        onChange={handleInputChange}
                    />
                    {errors.email && <span className='error'>{errors.email}</span>}

                    <input
                        name='subject'
                        placeholder='Subject'
                        value={formData.subject}
                        onChange={handleInputChange}
                    />
                    {errors.subject && <span className='error'>{errors.subject}</span>}

                    <textarea
                        name='message'
                        placeholder='Message'
                        rows='4'
                        maxLength={100}
                        value={formData.message}
                        onChange={handleInputChange}
                    />
                    {errors.message && <span className='error'>{errors.message}</span>}

                    <button className='button-secondary' type='submit' style={{ marginLeft: 0 }}>Send</button>
                </form>
            </div>
        </div>
    );
}

export default ContactUs;
