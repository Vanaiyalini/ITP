import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Tickets = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllMessages = async () => {
            try {
                setLoading(true);
                setError('');
                
                const response = await axios.get(
                    'http://localhost:4000/ContactusOperations/getAllMessages',
                    { timeout: 5000 }
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

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this message?")) {
            try {
                const response = await axios.delete(
                    `http://localhost:4000/ContactusOperations/deletemsg/${id}`
                );
                
                if (response.data?.success) {
                    setMessages(messages.filter(msg => msg._id !== id));
                }
            } catch (err) {
                console.error("Delete error:", err);
                setError(err.response?.data?.message || "Failed to delete message");
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-6 text-blue-600 text-center">All Messages</h1>
                
                <button
                    // onClick={() => navigate(-1)}
                    className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition duration-300 mb-4"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Back
                </button>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-center">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
                        <p>Loading messages...</p>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="text-center py-8">
                        <div className="mx-auto w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <p className="text-gray-500 text-lg">No messages found.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {messages.map((message) => (
                            <div key={message._id} className="bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-lg">{message.username}</h3>
                                        <p className="text-sm text-gray-500">{message.email}</p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <Link to={`/UpdateMessage/${message._id}`}>
                                            <button className="text-blue-500 hover:text-blue-700 px-2 py-1 rounded hover:bg-blue-50 transition-colors">
                                                Edit
                                            </button>
                                        </Link>
                                        <button 
                                            onClick={() => handleDelete(message._id)}
                                            className="text-red-500 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50 transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                        {message.type}
                                    </span>
                                    <p className="mt-2 text-gray-700">{message.msg}</p>
                                    <p className="text-xs text-gray-400 mt-2">
                                        {new Date(message.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Tickets;