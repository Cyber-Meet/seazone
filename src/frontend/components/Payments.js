import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import './Payments.css';
import Loader from './Loader';
import visa from '../../assets/icons/visa.svg';
import mastercard from '../../assets/icons/mastercard.svg';
import rupay from '../../assets/icons/rupay.png';
import paypal from '../../assets/icons/paypal.svg';
import gpay from '../../assets/icons/gpay.png';
import paytm from '../../assets/icons/paytm.png';
import amex from '../../assets/icons/amex.svg';
import sbi from '../../assets/icons/sbi.png';
import hdfc from '../../assets/icons/hdfc.png';
import icici from '../../assets/icons/icici.svg';
import upi from '../../assets/icons/upi.svg';
import { render } from '@testing-library/react';

const Payments = ({ paymentMethods }) => {
    const [bookingDetails, setBookingDetails] = useState(null);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

    useEffect(() => {
        const storedTshid = sessionStorage.getItem('tshid');
        if (!storedTshid) {
            console.error('No tshid found in session.');
            return;
        }

        const fetchBookingDetails = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/pendingpayment', {
                    params: { tshid: storedTshid }
                });
                setBookingDetails(response.data);
            } catch (error) {
                console.error('Error fetching booking details:', error);
                // You can add user feedback here, such as showing an error message
            }
        };

        fetchBookingDetails();
    }, []);

    // Calculate CGST, SGST, and total amount
    const calculateCharges = () => {
        if (!bookingDetails || !bookingDetails.length) return null;

        const totalAmount = bookingDetails[0].totalAmount;
        const cgst = totalAmount * 0.06;
        const sgst = totalAmount * 0.09;
        const totalWithTax = totalAmount + cgst + sgst;

        return {
            cgst: cgst,
            sgst: sgst,
            totalAmount: totalWithTax
        };
    };



    const handlePayment = async (selectedPaymentMethod) => {

        render(<Loader />);

        const handlePaymentMethodSelect = (paymentMethod) => {
            setSelectedPaymentMethod(paymentMethod);
        };

        const generateTransactionID = () => {
            if (!selectedPaymentMethod || !bookingDetails || !bookingDetails[0]) return null;

            const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, "");
            const lastFourTshid = sessionStorage.getItem('tshid').slice(-4);
            const paymentMethod = selectedPaymentMethod.name;
            const grandTotal = calculateCharges()?.totalAmount;
            const txnID = `${paymentMethod}${lastFourTshid}${currentDate}${grandTotal}`;

            return txnID;
        };

        const txnID = generateTransactionID();
        const paymentData = {
            tshid: sessionStorage.getItem('tshid'),
            rid: bookingDetails[0].rid,
            amount: calculateCharges().totalAmount,
            txnid: txnID,
            method: selectedPaymentMethod.name
        };

        try {
            const response = await axios.post('http://localhost:5000/api/payments', paymentData);
            console.log('Payment successful:', response.data);
            setTimeout(() => {
                window.location.href = '/profile';
            }, 2000);
        } catch (error) {
            console.error('Error processing payment:', error);
        }
    };

    const renderPaymentMethods = () => {
        return (
            <div className="payment-methods">
                <ul>
                    <p>Net Banking</p>
                    <li>
                        <button onClick={() => {
                            const selectedPaymentMethod = { name: 'NBSBI' };
                            handlePayment(selectedPaymentMethod);
                        }}>
                            <img src={sbi} alt='SBI' />
                        </button>
                        <button onClick={() => {
                            const selectedPaymentMethod = { name: 'NBHDFC' };
                            handlePayment(selectedPaymentMethod);
                        }}>
                            <img src={hdfc} alt='HDFC' />
                        </button>
                        <button onClick={() => {
                            const selectedPaymentMethod = { name: 'NBICICI' };
                            handlePayment(selectedPaymentMethod);
                        }}>
                            <img src={icici} alt='ICICI' />
                        </button>
                        <button onClick={() => {
                            const selectedPaymentMethod = { name: 'NBAMEX' };
                            handlePayment(selectedPaymentMethod);
                        }}>
                            <img src={amex} alt='Amex' />
                        </button>
                    </li>
                    <p>Wallet</p>
                    <li>
                        <button onClick={() => {
                            const selectedPaymentMethod = { name: 'WLTGPAY' };
                            handlePayment(selectedPaymentMethod);
                        }}>
                            <img src={gpay} alt='GPay' />
                        </button>
                        <button onClick={() => {
                            const selectedPaymentMethod = { name: 'WLTPAYPAL' };
                            handlePayment(selectedPaymentMethod);
                        }}>
                            <img src={paypal} alt='PayPal' />
                        </button>
                        <button onClick={() => {
                            const selectedPaymentMethod = { name: 'WLTPAYTM' };
                            handlePayment(selectedPaymentMethod);
                        }}>
                            <img src={paytm} alt='PayTm' />
                        </button>
                    </li>
                    <p>Cards</p>
                    <li>
                        <button onClick={() => {
                            const selectedPaymentMethod = { name: 'CRDRUPAY' };
                            handlePayment(selectedPaymentMethod);
                        }}>
                            <img src={rupay} alt='RuPay' />
                        </button>
                        <button onClick={() => {
                            const selectedPaymentMethod = { name: 'CRDRVISA' };
                            handlePayment(selectedPaymentMethod);
                        }}>
                            <img src={visa} alt='Visa' />
                        </button>
                        <button onClick={() => {
                            const selectedPaymentMethod = { name: 'CRDMSTR' };
                            handlePayment(selectedPaymentMethod);
                        }}>
                            <img src={mastercard} alt='Master Card' />
                        </button>
                    </li>
                    <p>UPI</p>
                    <li>
                        <button onClick={() => {
                            const selectedPaymentMethod = { name: 'UPI' };
                            handlePayment(selectedPaymentMethod);
                        }}>
                            <img src={upi} alt='UPI' />
                        </button>
                    </li>
                </ul>

            </div >
        );
    };

    return (
        <div className="payment-container">
            <div className="left-container">
                <div className="booking-details">
                    <h2 style={{ backgroundColor: 'white', borderRadius: '.3rem', padding: '.3rem' }}>Booking Details</h2>
                    {bookingDetails && bookingDetails.length > 0 ? (
                        <>
                            <div className='reservation-details'>
                                <div className='rvd'>
                                    <p>Reservation No: {bookingDetails[0].rid}</p>
                                    <p>Check-in Date: {new Date(bookingDetails[0].checkInDate).toLocaleDateString()}</p>
                                    <p>Check-out Date: {new Date(bookingDetails[0].checkOutDate).toLocaleDateString()}</p>
                                    <p>Room Type: {bookingDetails[0].roomType}</p>
                                    {bookingDetails[0].addedServices && Array.isArray(bookingDetails[0].addedServices) && (
                                        <p>Added Services: {bookingDetails[0].addedServices.join(', ')}</p>
                                    )}
                                    <p>Room No: {bookingDetails[0].roomNo}</p>
                                    <p>Amount: {bookingDetails[0].totalAmount}</p>
                                </div>
                                <div className='line'></div>
                                <div className='tax-details'>
                                    <p>18% CGST: {' ₹ ' + calculateCharges()?.cgst}</p>
                                    <p>18% SGST: {' ₹ ' + calculateCharges()?.sgst}</p>
                                    <p>Taxable Amount: {' ₹ ' + (calculateCharges()?.cgst + calculateCharges()?.sgst)}</p>
                                </div>
                                <div className='line'></div>
                                <div className='total-amount'>
                                    <p>Grand Total: {'  ₹ ' + calculateCharges()?.totalAmount + '/-'}</p>
                                    <p style={{ fontSize: '.7rem', padding: 'auto' }}>*Inclusive of all taxes</p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>
            </div>
            <div className="right-container">
                {renderPaymentMethods()}
            </div>
        </div>
    );
};

Payments.propTypes = {
    paymentMethods: PropTypes.array.isRequired,
};

export default Payments;
