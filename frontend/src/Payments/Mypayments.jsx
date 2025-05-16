import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logo from './Bill.png';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

const Mypayments = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserPayments = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const userData = JSON.parse(localStorage.getItem('userData'));
                
                if (!userData?._id) {
                    throw new Error('User not authenticated');
                }

                const response = await axios.get(
                    `http://localhost:4000/PaymentOperations/getpayments/user/${userData._id}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                
                setPayments(response.data.payments || []);
            } catch (err) {
                console.error("Error fetching payments:", err);
                setError(err.response?.data?.message || err.message || "Failed to load payments");
            } finally {
                setLoading(false);
            }
        };

        fetchUserPayments();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this payment method?")) {
            try {
                const token = localStorage.getItem('authToken');
                await axios.delete(
                    `http://localhost:4000/PaymentOperations/deletepayments/${id}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                setPayments(payments.filter(payment => payment._id !== id));
            } catch (err) {
                console.error("Error deleting payment:", err);
                setError(err.response?.data?.message || err.message || "Failed to delete payment");
            }
        }
    };









    
    const generatePDF = (pay) => {
        const doc = new jsPDF();
        let y = 20;
    
        // Header styles
        doc.setFillColor(255, 255, 255);
        doc.rect(0, 0, 210, 297, 'F'); 
        doc.setDrawColor(30, 136, 229);
        doc.setLineWidth(1.5);
        doc.rect(15, 15, 180, 267);
    
        doc.setDrawColor(200, 230, 255);
        doc.setLineWidth(0.5);
        doc.rect(18, 18, 174, 261);
    
        doc.addImage(logo, 'SVG', 25, 25, 30, 30);
    
        doc.setFontSize(20);
        doc.setTextColor(30, 136, 229);
        doc.setFont("helvetica", "bold");
        doc.text("Evergreen Hospital", 60, 35);
    
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100);
        doc.text("Marriyar Road kalmunai", 60, 42);
        doc.text("Phone: 0772911911 | Email: Nps@gmail.com", 60, 48);
    
        doc.setFontSize(16);
        doc.setTextColor(30, 136, 229);
        doc.setFont("helvetica", "bold");
        doc.text("PAYMENT RECEIPT", 105, 65, { align: 'center' });
    
        const date = new Date().toLocaleDateString();
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Date: ${date}`, 25, 80);
        doc.text(`Receipt #: ${Math.floor(100000 + Math.random() * 900000)}`, 150, 80);
    
        doc.setDrawColor(30, 136, 229);
        doc.setLineWidth(0.5);
        doc.line(25, 85, 185, 85);
    
        y = 95;
    
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(30, 136, 229);
        doc.text(`Payment Confirmation`, 25, y);
        y += 10;
    
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(50);
        doc.text("PATIENT INFORMATION:", 25, y);
        y += 6;
    
        doc.setFont("helvetica", "normal");
        doc.text(`Name: ${pay.user || 'N/A'}`, 30, y);
        doc.text(`Email: ${pay.email || 'N/A'}`, 110, y);
        y += 6;
        doc.text(`Contact: ${pay.Contactno || 'N/A'}`, 30, y);
        y += 8;
    
        doc.setFont("helvetica", "bold");
        doc.text("PAYMENT DETAILS:", 25, y);
        y += 6;
    
        doc.setFont("helvetica", "normal");
        doc.text(`Booking Reference: ${pay.BookRef || 'N/A'}`, 30, y);
        doc.text(`Payment Reference: ${pay.payRef || 'N/A'}`, 110, y);
        y += 6;
        doc.text(`Amount: $${pay.amount || '0'}`, 30, y);
        doc.text(`Date: ${pay.date || date}`, 110, y);
        y += 6;
        doc.text(`Payment Method: ${pay.method || pay.type || 'N/A'}`, 30, y);
        y += 8;
    
        if (pay.method === 'Credit Card' || pay.type === 'Credit Card') {
            doc.setFont("helvetica", "bold");
            doc.text("CARD INFORMATION:", 25, y);
            y += 6;
    
            doc.setFont("helvetica", "normal");
            doc.text(`Card Type: ${pay.type || 'N/A'}`, 30, y);
            doc.text(`Card Number: **** **** **** ${pay.cnum ? pay.cnum.slice(-4) : '****'}`, 110, y);
            y += 6;
            doc.text(`Expiry: ${pay.cmonth || 'MM'}/${pay.cyear || 'YY'}`, 30, y);
            y += 8;
        }
    
        doc.setFontSize(10);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(30, 136, 229);
        doc.text("Thank you for choosing Evergreen Hospital!", 105, y, { align: 'center' });
        y += 10;
    
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100);
        doc.text("Authorized Signature:", 130, y);
        doc.line(130, y + 2, 180, y + 2);
    
        doc.save(`payment_receipt_${pay.payRef || pay._id}.pdf`);
    };
    const calculateSummary = () => {
        if (payments.length === 0) return null;
        
        const totalPayments = payments.length;
        const totalAmount = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
        
        // Calculate payment method distribution
        const methodDistribution = payments.reduce((acc, payment) => {
            const method = payment.type || 'Other';
            acc[method] = (acc[method] || 0) + 1;
            return acc;
        }, {});










        // Prepare data for pie chart
        const pieChartData = {
            labels: Object.keys(methodDistribution),
            datasets: [{
                data: Object.values(methodDistribution),
                backgroundColor: [
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                    'rgba(255, 159, 64, 0.7)',
                    'rgba(255, 99, 132, 0.7)'
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1
            }]
        };

        return (
            <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-4">Payment Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-blue-700">Total Payments</h4>
                        <p className="text-2xl font-bold text-blue-900 mt-1">{totalPayments}</p>
                    </div>
 
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h4 className="text-sm font-medium text-purple-700 mb-2">Payment Methods</h4>
                        <div className="h-48"> {/* Fixed height container */}
                            <Pie 
                                data={pieChartData}
                                options={{
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            position: 'bottom',
                                            labels: {
                                                padding: 20,
                                                boxWidth: 12
                                            }
                                        },
                                        tooltip: {
                                            callbacks: {
                                                label: function(context) {
                                                    return `${context.label}: ${context.raw} (${((context.raw / totalPayments) * 100).toFixed(1)}%)`;
                                                }
                                            }
                                        }
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
                    <p className="mt-4 text-gray-700">Loading payment records...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md">
                    <div className="text-red-500 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading payments</h3>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition duration-300"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        Back to Profile
                    </button>

                    <h2 className="text-2xl font-bold text-blue-800">Payment Records</h2>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-blue-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">User</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Contact</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Booking Ref</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Payment Ref</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Card Number</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Card Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Expiry</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {payments.length > 0 ? payments.map((pay) => (
                                    <tr key={pay._id} className="hover:bg-blue-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{pay.user || 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pay.email || 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pay.Contactno || 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pay.BookRef || 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pay.payRef || 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {pay.cnum ? `•••• •••• •••• ${pay.cnum.slice(-4)}` : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pay.type || 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {pay.cmonth && pay.cyear ? `${pay.cmonth}/${pay.cyear}` : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-2">
                                                <Link
                                                    to={`/Editpayment/${pay._id}`}
                                                    className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-100"
                                                    title="Edit"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                    </svg>
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(pay._id)}
                                                    className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100"
                                                    title="Delete"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => generatePDF(pay)}
                                                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                    Download Bill
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="9" className="px-6 py-4 text-center text-sm text-gray-500">
                                            No payment records found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Payment Summary Section with Pie Chart */}
                {calculateSummary()}
            </div>
        </div>
    );
};

export default Mypayments;