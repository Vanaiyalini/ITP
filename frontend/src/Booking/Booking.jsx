import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Booking = () => {
  const [appointment, setAppointment] = useState({
    title: '',
    name: '',
    email: '',
    mobile: '',
    nic: '',
    area: '',
    gender: '',
    date: '',
    time: '',
    requirements: ''
  });
  
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('authToken');
        const userData = JSON.parse(localStorage.getItem('userData') || 'null');
        
        if (!token || !userData?._id) {
          setAuthError('You need to login to book appointments');
          return false;
        }
        return true;
      } catch (err) {
        setAuthError('Session error. Please login again.');
        return false;
      }
    };
    
    checkAuth();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAppointment(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    setError(null);
    const requiredFields = ['title', 'name', 'email', 'mobile', 'area', 'gender', 'date', 'time'];
    const missingFields = requiredFields.filter(field => !appointment[field]);
    
    if (missingFields.length > 0) {
      setError(`Please fill in: ${missingFields.join(', ')}`);
      return false;
    }

    if (!/^\d{10}$/.test(appointment.mobile)) {
      setError('Enter valid 10-digit phone number');
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(appointment.email)) {
      setError('Enter valid email address');
      return false;
    }

    if (new Date(appointment.date) < new Date().setHours(0,0,0,0)) {
      setError('Select future date');
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) return;
    
    setSubmitLoading(true);
    
    try {
      const token = localStorage.getItem('authToken');
      const userData = JSON.parse(localStorage.getItem('userData'));
      
      if (!token || !userData?._id) {
        throw new Error('Session expired. Please login again.');
      }

      const response = await axios.post(
        'http://localhost:4000/AppointmentController/Appointment',
        {
          ...appointment,
          requirements: appointment.requirements || ""
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        navigate('/Profile', { 
          state: { 
            success: true,
            message: 'Appointment booked successfully!',
            appointmentId: response.data.appointmentId
          }
        });
      } else {
        throw new Error(response.data.message || 'Booking failed');
      }
    } catch (err) {
      console.error('Booking error:', err);
      setError(err.response?.data?.message || err.message || "Booking error");
      
      if (err.message.includes('login')) {
        navigate('/login', { state: { from: '/booking' } });
      }
    } finally {
      setSubmitLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mt-12 mb-12 mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-blue-800 mb-6 text-center">Book Appointment</h1>

      {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-wrap gap-4">
          <fieldset className="flex-1 min-w-[200px] border border-gray-300 rounded-lg p-2">
            <legend className="px-2 text-sm text-gray-600">Title</legend>
            <select
              name="title"
              value={appointment.title}
              onChange={handleChange}
              className="w-full p-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              required
            >
              <option value="">Select title</option>
              <option value="Mr">Mr</option>
              <option value="Mrs">Mrs</option>
              <option value="Miss">Miss</option>
            </select>
          </fieldset>

          <fieldset className="flex-1 min-w-[200px] border border-gray-300 rounded-lg p-2">
            <legend className="px-2 text-sm text-gray-600">Name</legend>
            <input
              type="text"
              name="name"
              value={appointment.name}
              onChange={handleChange}
              className="w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              placeholder="Enter patient name"
              required
            />
          </fieldset>
        </div>

        <div className="flex flex-wrap gap-4">
          <fieldset className="flex-1 min-w-[200px] border border-gray-300 rounded-lg p-2">
            <legend className="px-2 text-sm text-gray-600">Phone Number</legend>
            <input
              name="mobile"
              type="tel"
              value={appointment.mobile}
              onChange={handleChange}
              className="w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              placeholder="Phone number"
              required
            />
          </fieldset>

          <fieldset className="flex-1 min-w-[200px] border border-gray-300 rounded-lg p-2">
            <legend className="px-2 text-sm text-gray-600">Email</legend>
            <input
              type="email"
              name="email"
              value={appointment.email}
              onChange={handleChange}
              className="w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              placeholder="mail@site.com"
              required
            />
          </fieldset>
        </div>

        <fieldset className="border border-gray-300 rounded-lg p-2">
          <legend className="px-2 text-sm text-gray-600">NIC Number</legend>
          <input
            type="text"
            name="nic"
            value={appointment.nic}
            onChange={handleChange}
            className="w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            placeholder="Enter NIC number"
          />
        </fieldset>

        <fieldset className="border border-gray-300 rounded-lg p-2">
          <legend className="px-2 text-sm text-gray-600">Address</legend>
          <textarea
            name="area"
            value={appointment.area}
            onChange={handleChange}
            className="w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded min-h-[80px]"
            placeholder="Enter your full address"
            required
          />
        </fieldset>

        <div className="flex flex-wrap gap-4">
          <fieldset className="flex-1 min-w-[200px] border border-gray-300 rounded-lg p-2">
            <legend className="px-2 text-sm text-gray-600">Gender</legend>
            <select
              name="gender"
              value={appointment.gender}
              onChange={handleChange}
              className="w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              required
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </fieldset>

          <fieldset className="flex-1 min-w-[200px] border border-gray-300 rounded-lg p-2">
            <legend className="px-2 text-sm text-gray-600">Date</legend>
            <input
              type="date"
              name="date"
              value={appointment.date}
              onChange={handleChange}
              className="w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              required
            />
          </fieldset>

          <fieldset className="flex-1 min-w-[200px] border border-gray-300 rounded-lg p-2">
            <legend className="px-2 text-sm text-gray-600">Time</legend>
            <input
              type="time"
              name="time"
              value={appointment.time}
              onChange={handleChange}
              className="w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              required
            />
          </fieldset>
        </div>

        <fieldset className="border border-gray-300 rounded-lg p-2">
          <legend className="px-2 text-sm text-gray-600">Requirements</legend>
          <textarea
            name="requirements"
            value={appointment.requirements}
            onChange={handleChange}
            className="w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded min-h-[80px]"
            placeholder="Enter requirements (optional)"
          />
        </fieldset>

        <div className="flex justify-center mt-6">
        <button
        type="submit"
        className={`px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 ${submitLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
           disabled={submitLoading}
          >
            {submitLoading ? 'Booking...' : 'Book Appointment'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Booking;
