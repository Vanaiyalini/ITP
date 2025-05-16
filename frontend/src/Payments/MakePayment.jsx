import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const MakePayment = () => {
    const [payment, setPayment] = useState({
        user: "",
        email: "",
        Contactno: "",
        BookRef: "",
        payRef: "",
        cnum: "",
        type: "",
        cmonth: "",
        cyear: "",
        cvv: ""
    });
    const [submitLoading, setSubmitLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setPayment({ ...payment, [name]: value });
 
        if (errors[name]) {
            setErrors({ ...errors, [name]: "" });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\d{10}$/;
        const cardRegex = /^\d{16}$/;
        const cvvRegex = /^\d{3}$/;

        if (!payment.user.trim()) newErrors.user = "Full name is required";
        if (!payment.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!emailRegex.test(payment.email)) {
            newErrors.email = "Invalid email format";
        }
        if (!payment.Contactno.trim()) {
            newErrors.Contactno = "Contact number is required";
        } else if (!phoneRegex.test(payment.Contactno)) {
            newErrors.Contactno = "Must be 10 digits";
        }
        if (!payment.BookRef.trim()) newErrors.BookRef = "Booking reference is required";
        if (!payment.payRef.trim()) newErrors.payRef = "Payment reference is required";
        if (!payment.cnum.trim()) {
            newErrors.cnum = "Card number is required";
        } else if (!cardRegex.test(payment.cnum)) {
            newErrors.cnum = "Must be 16 digits";
        }
        if (!payment.type) newErrors.type = "Card type is required";
        if (!payment.cmonth) newErrors.cmonth = "Month is required";
        if (!payment.cyear) newErrors.cyear = "Year is required";
        if (!payment.cvv.trim()) {
            newErrors.cvv = "CVV is required";
        } else if (!cvvRegex.test(payment.cvv)) {
            newErrors.cvv = "Must be 3 digits";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        if (!validateForm()) {
            return;
        }
    
        setSubmitLoading(true);
    
        try {
            const token = localStorage.getItem('authToken');
            const userData = JSON.parse(localStorage.getItem('userData'));
    
            if (!userData?._id) {
                throw new Error('User not authenticated');
            }
    
            const paymentData = {
                userId: userData._id,
                user: payment.user.trim(),
                email: payment.email.trim(),
                Contactno: payment.Contactno.trim(),
                BookRef: payment.BookRef.trim(),
                payRef: payment.payRef.trim(),
                cnum: payment.cnum.trim(),
                type: payment.type,
                cmonth: payment.cmonth,
                cyear: payment.cyear,
                cvv: payment.cvv
            };
    
            const response = await axios.post(
                'http://localhost:4000/PaymentOperations/Payment',
                paymentData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
    
            if (response.data && response.data.success) {
                navigate('/Profile', {
                    state: { 
                        successMessage: 'Payment processed successfully!',
                        paymentId: response.data.paymentId
                    }
                });
            } else {
                throw new Error(response.data?.message || 'Payment failed');
            }
        } catch (err) {
            setErrors({ form: err.response?.data?.message || err.message || "Error processing payment" });
        } finally {
            setSubmitLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl overflow-hidden">

                <div className="bg-blue-600 py-3 px-6">
                    <h1 className="text-xl font-bold text-white">EverGreen Payment Section</h1>
                </div>

                <div className="p-6">
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                            <div className="space-y-3">
                                <h3 className="text-md font-semibold text-gray-800 border-b pb-2">Patient Details</h3>
                                
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        name="user"
                                        value={payment.user}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 text-sm rounded border ${errors.user ? "border-red-500" : "border-gray-300"}`}
                                    />
                                    {errors.user && <p className="mt-1 text-xs text-red-500">{errors.user}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={payment.email}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 text-sm rounded border ${errors.email ? "border-red-500" : "border-gray-300"}`}
                                    />
                                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Contact Number</label>
                                    <input
                                        type="tel"
                                        name="Contactno"
                                        value={payment.Contactno}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 text-sm rounded border ${errors.Contactno ? "border-red-500" : "border-gray-300"}`}
                                    />
                                    {errors.Contactno && <p className="mt-1 text-xs text-red-500">{errors.Contactno}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Booking Reference</label>
                                    <input
                                        type="text"
                                        name="BookRef"
                                        value={payment.BookRef}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 text-sm rounded border ${errors.BookRef ? "border-red-500" : "border-gray-300"}`}
                                    />
                                    {errors.BookRef && <p className="mt-1 text-xs text-red-500">{errors.BookRef}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Payment Reference</label>
                                    <input
                                        type="text"
                                        name="payRef"
                                        value={payment.payRef}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 text-sm rounded border ${errors.payRef ? "border-red-500" : "border-gray-300"}`}
                                    />
                                    {errors.payRef && <p className="mt-1 text-xs text-red-500">{errors.payRef}</p>}
                                </div>
                            </div>


                            <div className="space-y-3">
                                <h3 className="text-md font-semibold text-gray-800 border-b pb-2">Payment Details</h3>

                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Card Number</label>
                                    <input
                                        type="text"
                                        name="cnum"
                                        placeholder="4182-XXXX-XXXX-XX63"
                                        value={payment.cnum}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 text-sm rounded border ${errors.cnum ? "border-red-500" : "border-gray-300"}`}
                                    />
                                    {errors.cnum && <p className="mt-1 text-xs text-red-500">{errors.cnum}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Card Type</label>
                                    <select
                                        name="type"
                                        value={payment.type}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 text-sm rounded border ${errors.type ? "border-red-500" : "border-gray-300"}`}
                                    >
                                        <option value="">Select Card</option>
                                        <option value="VISA">Visa</option>
                                        <option value="MASTERCARD">MasterCard</option>
                                    </select>
                                    {errors.type && <p className="mt-1 text-xs text-red-500">{errors.type}</p>}
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Expiry Month</label>
                                        <select
                                            name="cmonth"
                                            value={payment.cmonth}
                                            onChange={handleChange}
                                            className={`w-full px-3 py-2 text-sm rounded border ${errors.cmonth ? "border-red-500" : "border-gray-300"}`}
                                        >
                                            <option value="">MM</option>
                                            <option value="01">01</option>
                                            <option value="02">02</option>
                                            <option value="03">03</option>
                                            <option value="04">04</option>
                                            <option value="05">05</option>
                                            <option value="06">06</option>
                                            <option value="07">07</option>
                                            <option value="08">08</option>
                                            <option value="09">09</option>
                                            <option value="10">10</option>
                                            <option value="11">11</option>
                                            <option value="12">12</option>
                                        </select>
                                        {errors.cmonth && <p className="mt-1 text-xs text-red-500">{errors.cmonth}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Expiry Year</label>
                                        <select
                                            name="cyear"
                                            value={payment.cyear}
                                            onChange={handleChange}
                                            className={`w-full px-3 py-2 text-sm rounded border ${errors.cyear ? "border-red-500" : "border-gray-300"}`}
                                        >
                                            <option value="">YY</option>
                                            <option value="25">25</option>
                                            <option value="26">26</option>
                                            <option value="27">27</option>
                                            <option value="28">28</option>
                                            <option value="29">29</option>
                                            <option value="30">30</option>
                                        </select>
                                        {errors.cyear && <p className="mt-1 text-xs text-red-500">{errors.cyear}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">CVV</label>
                                        <input
                                            type="password"
                                            name="cvv"
                                            maxLength="3"
                                            placeholder="•••"
                                            value={payment.cvv}
                                            onChange={handleChange}
                                            className={`w-full px-3 py-2 text-sm rounded border ${errors.cvv ? "border-red-500" : "border-gray-300"}`}
                                        />
                                        {errors.cvv && <p className="mt-1 text-xs text-red-500">{errors.cvv}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 pt-6 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-600 mb-3 text-center">We Accept</h4>
                    <div className="flex justify-center space-x-6">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-8" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-8" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg" alt="American Express" className="h-8" />
                    </div>
                    </div>

                        {/* Submit Button */}
                        <div className="mt-6 flex justify-end">
                            <button
                                type="submit"
                                disabled={submitLoading}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                            >
                                {submitLoading ? 'Processing...' : 'Make Payment'}
                            </button>
                        </div>

                        {errors.form && (
                            <div className="mt-4 text-red-500 text-sm">
                                {errors.form}
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default MakePayment;