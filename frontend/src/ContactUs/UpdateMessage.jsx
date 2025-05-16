import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const UpdateMessage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [msg, setmsg] = useState({
    username: "",
    email: "",
    msg: "",
    type: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:4000/ContactusOperations/getmsg/${id}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
          }
        );

        const message = response.data.data; // Access the nested 'data' field
        setmsg({
          username: message.username || "",
          email: message.email || "",
          msg: message.msg || "",
          type: message.type || ""
        });
      } catch (err) {
        console.error('Error fetching message:', err);
        setError('Failed to load message details');
        navigate('/Contact');
      } finally {
        setLoading(false);
      }
    };
    fetchMessage();
  }, [id, navigate]);

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!msg.username.trim()) newErrors.username = "Name is required";
    if (!msg.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(msg.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!msg.msg.trim()) newErrors.msg = "Message is required";
    if (!msg.type.trim()) newErrors.type = "Subject is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setmsg(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await axios.put(
        `http://localhost:4000/ContactusOperations/updatemsg/${id}`,
        {
          username: msg.username,
          email: msg.email,
          msg: msg.msg,
          type: msg.type
        },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'application/json'
          }
        }
      );
      alert("Message updated successfully!");
      navigate('/Profile');
    } catch (err) {
      console.error("Update error:", err);
      setError(err.response?.data?.message || "Failed to update message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-[#007BFF] mb-4 text-center">Update Message</h2>

        {error && (
          <div className="mb-3 p-2 bg-red-50 text-red-600 text-sm rounded">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm text-[#007BFF] font-medium mb-1">Email</label>
          <input 
            type="email" 
            name="email" 
            value={msg.email}
            onChange={handleChange}
            className="w-full p-2 text-sm bg-white border border-gray-200 rounded focus:border-[#007BFF] focus:ring-1 focus:ring-[#007BFF] outline-none"
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
            className="w-full p-2 text-sm bg-white border border-gray-200 rounded focus:border-[#007BFF] focus:ring-1 focus:ring-[#007BFF] outline-none"
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
            className="w-full p-2 text-sm bg-white border border-gray-200 rounded focus:border-[#007BFF] focus:ring-1 focus:ring-[#007BFF] outline-none"
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
            className="w-full p-2 text-sm bg-white border border-gray-200 rounded focus:border-[#007BFF] focus:ring-1 focus:ring-[#007BFF] outline-none"
            placeholder="Your message..."
            rows={3}
          />
          {errors.msg && <p className="text-red-500 text-xs mt-1">{errors.msg}</p>}
        </div>

        <div className="text-center mt-4">
          <button 
            type="submit"
            disabled={loading}
            className="bg-[#007BFF] hover:bg-blue-600 text-white text-sm font-medium py-2 px-5 rounded transition disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Message'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateMessage;
