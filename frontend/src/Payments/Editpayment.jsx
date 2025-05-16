import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const Editpayment = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    useEffect(() => {
        const fetchPayment = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:4000/PaymentOperations/getpayments/${id}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                        }
                    }
                );
                setPayment(response.data);
            } catch (err) {
                console.error('Error fetching payment:', err);
                alert('Failed to load payment details');
                navigate('/');
            }
        };
        fetchPayment();
    }, [id, navigate]);

    const validateForm = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\d{10}$/;

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

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setPayment(prev => ({ ...prev, [name]: value }));
        
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        setIsSubmitting(true);
        try {
            await axios.put(
                `http://localhost:4000/PaymentOperations/updatepay/${id}`,
                {
                    ...payment,
                    cvv: undefined,
                    cnum: payment.cnum.slice(-4)
                },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            alert("Payment details updated successfully!");
            navigate('/Profile');
        } catch (err) {
            console.error("Update error:", err);
            alert(err.response?.data?.message || "Failed to update payment details");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl overflow-hidden">
                <div className="bg-blue-600 py-3 px-6">
                    <h1 className="text-xl font-bold text-white">Update Payment Details</h1>
                </div>

                <div className="p-6">
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Patient Details */}
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

                            {/* Card Details (read-only) */}
                            <div className="space-y-3">
                                <h3 className="text-md font-semibold text-gray-800 border-b pb-2">Card Details</h3>

                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Card Number</label>
                                    <input
                                        type="text"
                                        value={`•••• •••• •••• ${payment.cnum?.slice(-4) || ''}`}
                                        readOnly
                                        className="w-full px-3 py-2 text-sm rounded border border-gray-300 bg-gray-100 cursor-not-allowed"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Card Type</label>
                                    <input
                                        type="text"
                                        value={payment.type || ''}
                                        readOnly
                                        className="w-full px-3 py-2 text-sm rounded border border-gray-300 bg-gray-100 cursor-not-allowed"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Expiry Month</label>
                                        <input
                                            type="text"
                                            value={payment.cmonth || ''}
                                            readOnly
                                            className="w-full px-3 py-2 text-sm rounded border border-gray-300 bg-gray-100 cursor-not-allowed"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Expiry Year</label>
                                        <input
                                            type="text"
                                            value={payment.cyear || ''}
                                            readOnly
                                            className="w-full px-3 py-2 text-sm rounded border border-gray-300 bg-gray-100 cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="mt-6 flex justify-end">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                            >
                                {isSubmitting ? 'Updating...' : 'Update Details'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Editpayment;