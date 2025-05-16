import { useEffect, useState } from 'react'; 
import { Link } from 'react-router-dom';
import axios from 'axios';

const PayTable = () => {
    const [Payment, setPayment] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:4000/PaymentOperations/getpayments`)
            .then(result => {
                console.log("Fetched Data:", result.data);
                setPayment(result.data);
            })
            .catch(err => console.error("Error fetching data:", err));
    }, []);  

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this payment record?")) {
            axios.delete(`http://localhost:4000/PaymentOperations/deletepayments/${id}`)
                .then(() => {
                    setPayment(Payment.filter(pay => pay._id !== id)); 
                })
                .catch(err => console.error("Error deleting:", err));
        }
    };

    return (
        <div className="p-8">
            <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200 bg-white">
                <table className="min-w-full text-sm text-gray-700">
                    <thead className="bg-blue-600 text-white uppercase">
                        <tr>
                            <th className="py-3 px-4 text-left">Name</th>
                            <th className="py-3 px-4 text-left">Email</th>
                            <th className="py-3 px-4 text-left">Contact</th>
                            <th className="py-3 px-4 text-left">Booking Ref</th>
                            <th className="py-3 px-4 text-left">Payment Ref</th>
                            <th className="py-3 px-4 text-left">Card Number</th>
                            <th className="py-3 px-4 text-left">Card Type</th>
                            <th className="py-3 px-4 text-left">Expiry</th>
                            <th className="py-3 px-4 text-left">CVV</th>
                            <th className="py-3 px-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Payment.length > 0 ? Payment.map((pay) => (
                            <tr key={pay._id} className="even:bg-gray-50 hover:bg-gray-100 transition-colors">
                                <td className="py-3 px-4 border-t">{pay.user}</td>
                                <td className="py-3 px-4 border-t">{pay.email}</td>
                                <td className="py-3 px-4 border-t">{pay.Contactno}</td>
                                <td className="py-3 px-4 border-t">{pay.BookRef}</td>
                                <td className="py-3 px-4 border-t">{pay.payRef}</td>
                                <td className="py-3 px-4 border-t">•••• •••• •••• {pay.cnum?.slice(-4)}</td>
                                <td className="py-3 px-4 border-t">{pay.type}</td>
                                <td className="py-3 px-4 border-t">{pay.cmonth}/{pay.cyear}</td>
                                <td className="py-3 px-4 border-t">•••</td>
                                <td className="py-3 px-4 border-t text-center">
                                    <div className="flex justify-center gap-2">
                                        <Link 
                                            to={`/AdminPay/${pay._id}`}
                                            className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded transition"
                                        >
                                            Edit
                                        </Link>
                                        <button 
                                            onClick={() => handleDelete(pay._id)}
                                            className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded transition"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="10" className="py-6 text-center text-gray-500">
                                    No payment records found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PayTable;
