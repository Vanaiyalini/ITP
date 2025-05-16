import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEnvelope, FaUser, FaCalendarAlt, FaArrowLeft } from 'react-icons/fa';

const Admincheck = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllMessages = async () => {
            try {
                setLoading(true);
                setError('');
                
                const token = localStorage.getItem('authToken');
                const response = await axios.get(
                    'http://localhost:4000/ContactusOperations/getAllMessages',
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        },
                        timeout: 5000
                    }
                );

                const allMessages = response.data.data || [];
                setMessages(allMessages);
            } catch (err) {
                console.error("Error fetching messages:", err);
                setError(err.response?.data?.message || "Failed to load messages");
                setMessages([]);
            } finally {
                setLoading(false);
            }
        };

        fetchAllMessages();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                {/* Header Section */}
                <div className="bg-blue-600 p-4 md:p-6 flex items-center justify-between">
                    <button
                        onClick={() => navigate('/AdminDashboard')}
                        className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-full shadow-md hover:bg-blue-50 transition duration-300"
                    >
                        <FaArrowLeft className="inline" />
                        <span className="hidden sm:inline">Back to Dashboard</span>
                    </button>
                    <h1 className="text-xl md:text-2xl font-bold text-white">
                        Patient Complaints & Feedback
                    </h1>
                    <div className="w-10"></div> {/* Spacer for alignment */}
                </div>

                <div className="p-4 md:p-6">
                    {error && (
                        <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-lg text-center">
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                            <p className="text-gray-600">Loading patient messages...</p>
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <FaEnvelope className="text-gray-400 text-3xl" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-700 mb-1">No messages received</h3>
                            <p className="text-gray-500">Patient complaints and feedback will appear here</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {messages.map((message) => (
                                <div key={message._id} className="border border-gray-200 rounded-lg p-4 md:p-6 hover:shadow-md transition-shadow">
                                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className="bg-blue-100 p-3 rounded-full">
                                                <FaUser className="text-blue-600 text-xl" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg text-gray-800">{message.username}</h3>
                                                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                                    <FaEnvelope className="inline" />
                                                    <span>{message.email}</span>
                                                </div>
                                                <div className="mt-2">
                                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium 
                                                        ${message.type === 'complaint' ? 'bg-red-100 text-red-800' : 
                                                          message.type === 'feedback' ? 'bg-green-100 text-green-800' : 
                                                          'bg-blue-100 text-blue-800'}`}>
                                                        {message.type}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4 pl-2 md:pl-16">
                                        <p className="text-gray-700 whitespace-pre-line">{message.msg}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Admincheck;