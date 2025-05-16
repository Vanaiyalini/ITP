import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import image from './contact.jpg'
import Nav2 from '../user/Nav2';


const Contact = () => {
    const [msg, setMsg] = useState({
        username: "",
        email: "",
        msg: "",
        type: "",
    });
    const [submitLoading, setSubmitLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setMsg({ ...msg, [name]: value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: "" });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!msg.username.trim()) newErrors.username = "Name required";
        if (!msg.email.trim()) {
            newErrors.email = "Email required";
        } else if (!emailRegex.test(msg.email)) {
            newErrors.email = "Invalid email";
        }
        if (!msg.msg.trim()) newErrors.msg = "Message required";
        if (!msg.type.trim()) newErrors.type = "Subject required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateForm()) return;
    
        setSubmitLoading(true);
    
        try {
            const token = localStorage.getItem('authToken');
            const userData = JSON.parse(localStorage.getItem('userData'));
    
            if (!userData?._id) throw new Error('Authentication required');
    
            const response = await axios.post(
                'http://localhost:4000/ContactusOperations/contact',
                {
                    userId: userData._id,
                    username: msg.username.trim(),
                    email: msg.email.trim(),
                    msg: msg.msg.trim(),
                    type: msg.type.trim()
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
    
            if (response.data?.success) {
                navigate('/Profile', {
                    state: { 
                        successMessage: 'Message sent!',
                        msgId: response.data.msgId
                    }
                });
            } else {
                throw new Error(response.data?.message || 'Submission failed');
            }
        } catch (err) {
            setErrors({ 
                form: err.response?.data?.message || err.message || "Submission error" 
            });
        } finally {
            setSubmitLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col p-4">
            <Nav2/>
            <div className="flex-grow flex items-center justify-center">
                <div className="w-full max-w-5xl flex flex-col md:flex-row gap-6">
                    {/* Image Section - More compact */}
                    <div className="w-full md:w-1/2 flex items-center justify-center p-4">
                        <div className="bg-[#f4f6f7] bg-opacity-5 p-6 rounded-lg w-full h-full flex items-center">
                            <img 
                                src={image}
                                alt="Contact Support"
                                className="w-full h-auto max-h-80 object-contain"
                            />
                        </div>
                    </div>

                    {/* Form Section - More compact */}
                    <div className="w-full md:w-1/2">
                        <form onSubmit={handleSubmit} className="w-full bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <h2 className="text-xl font-semibold text-[#007BFF] mb-4 text-center">Contact Us</h2>

                            {errors.form && (
                                <div className="mb-3 p-2 bg-red-50 text-red-600 text-sm rounded">
                                    {errors.form}
                                </div>
                            )}

                         

                            <div className="mb-4">
                                <label className="block text-sm text-[#007BFF] font-medium mb-1">Email</label>
                                <input 
                                    type="email" 
                                    name="email" 
                                    value={msg.email}
                                    onChange={handleChange}
                                    className="w-full p-2 text-sm border border-gray-200 rounded focus:border-[#007BFF] focus:ring-1 focus:ring-[#007BFF] outline-none"
                                    placeholder="your@email.com"
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm text-[#007BFF] font-medium mb-1">Name</label>
                                <input 
                                    type="text" 
                                    name="username" 
                                    value={msg.username}
                                    onChange={handleChange}
                                    className="w-full p-2 text-sm border border-gray-200 rounded focus:border-[#007BFF] focus:ring-1 focus:ring-[#007BFF] outline-none"
                                    placeholder="Your name"
                                />
                                {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm text-[#007BFF] font-medium mb-1">Subject</label>
                                <select
                                    name="type"
                                    value={msg.type}
                                    onChange={handleChange}
                                    className="w-full p-2 text-sm border border-gray-200 rounded focus:border-[#007BFF] focus:ring-1 focus:ring-[#007BFF] outline-none"
                                >
                                    <option value="">Select subject</option>
                                    <option value="General Inquiry">General Inquiry</option>
                                    <option value="Technical Support">Technical Support</option>
                                    <option value="Billing Question">Billing</option>
                                    <option value="Feedback">Feedback</option>
                                    <option value="Other">Other</option>
                                </select>
                                {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm text-[#007BFF] font-medium mb-1">Message</label>
                                <textarea
                                    name="msg" 
                                    value={msg.msg}
                                    onChange={handleChange}
                                    className="w-full p-2 text-sm border border-gray-200 rounded focus:border-[#007BFF] focus:ring-1 focus:ring-[#007BFF] outline-none"
                                    placeholder="Your message..."
                                    rows={3}
                                />
                                {errors.msg && <p className="text-red-500 text-xs mt-1">{errors.msg}</p>}
                            </div>

                            <div className="text-center mt-4">
                                <button 
                                    type="submit"
                                    disabled={submitLoading}
                                    className="bg-[#007BFF] hover:bg-blue-600 text-white text-sm font-medium py-2 px-5 rounded transition disabled:opacity-50"
                                >
                                    {submitLoading ? 'Sending...' : 'Send Message'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;