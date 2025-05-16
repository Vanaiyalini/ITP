import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import logo from './Bill.png'
import { jsPDF } from 'jspdf';
import Nav2 from '../user/Nav2' 


const BookingDetails = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editData, setEditData] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [errors, setErrors] = useState({}); 

  const { userId: paramUserId } = useParams();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!editData.title) {
      newErrors.title = 'Title is required';
    }
    
    if (!editData.name) {
      newErrors.name = 'Full name is required';
    } else if (editData.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }
    
    if (!editData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!editData.mobile) {
      newErrors.mobile = 'Phone number is required';
    } else if (!/^[0-9]{10,15}$/.test(editData.mobile)) {
      newErrors.mobile = 'Please enter a valid phone number (10-15 digits)';
    }
    
    if (!editData.date) {
      newErrors.date = 'Date is required';
    } else {
      const selectedDate = new Date(editData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.date = 'Date cannot be in the past';
      }
    }
    
    if (!editData.time) {
      newErrors.time = 'Time is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getUserId = () => {
    try {
      const storedUser = localStorage.getItem('userData');
      if (!storedUser) {
        console.log('No user data in localStorage');
        return null;
      }

      const parsedUser = JSON.parse(storedUser);
      console.log('Parsed user data:', parsedUser);

      return (
        paramUserId || 
        parsedUser.userId || 
        parsedUser._id || 
        parsedUser.id || 
        null
      );
    } catch (err) {
      console.error('Error parsing user data:', err);
      return null;
    }
  };

  const userId = getUserId();
  console.log('Current userId:', userId);

  const fetchAppointments = async () => {
    console.log('Starting to fetch appointments...');
    
    if (!userId) {
      console.log('No user ID available');
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        console.log('No auth token found');
        setError('Please login to view appointments');
        setLoading(false);
        setAuthChecked(true);
        navigate('/login');
        return;
      }
      try {
        console.log('Attempting to recover user info...');
        const userResponse = await axios.get('http://localhost:4000/AppointmentController/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (userResponse.data?.userId) {
          console.log('Recovered user ID:', userResponse.data.userId);
          localStorage.setItem('userData', JSON.stringify(userResponse.data));
          window.location.reload();
          return;
        }
      } catch (err) {
        console.error('Failed to recover user info:', err);
        localStorage.removeItem('authToken');
        navigate('/login');
        return;
      }

      setError('Unable to verify your session');
      setLoading(false);
      setAuthChecked(true);
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('No authentication token found');

      console.log(`Fetching appointments for user ${userId}`);
      const response = await axios.get(
        `http://localhost:4000/AppointmentController/appointments/user/${userId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Appointments data:', response.data);
      setAppointments(response.data.appointments || []);
      setError(null);
    } catch (err) {
      console.error('Fetch error:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      
      const errorMessage = err.response?.data?.message || 
                         'Failed to load appointments. Please try again.';
      
      setError(errorMessage);
      
      if (err.response?.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        navigate('/login');
      }
    } finally {
      setLoading(false);
      setAuthChecked(true);
    }
  };

  useEffect(() => {
    if (userId || !authChecked) {
      fetchAppointments();
    }
  }, [userId, authChecked, navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) return;
    
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(
        `http://localhost:4000/AppointmentController/appointments/${id}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      setAppointments(appointments.filter(appt => appt._id !== id));
      toast.success('Appointment deleted successfully');
    } catch (err) {
      console.error('Delete error:', err);
      toast.error(err.response?.data?.message || 'Error deleting appointment');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.put(
        `http://localhost:4000/AppointmentController/appointments/${editData._id}`,
        editData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setAppointments(appointments.map(appt => 
        appt._id === editData._id ? response.data.appointment : appt
      ));
      setEditData(null);
      toast.success('Appointment updated successfully');
    } catch (err) {
      console.error('Update error:', err);
      toast.error(err.response?.data?.message || 'Error updating appointment');
    }
  };

  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleEditClick = (appointment) => {
    setEditData({
      ...appointment,
      date: formatDateForInput(appointment.date) // Format the date for the input field
    });
  };

  
  const handlePayment = (appointmentId) => {
    // In a real app, this would redirect to a payment gateway
    toast.info('Redirecting to payment gateway...');
    // Simulate payment processing
    setTimeout(() => {
      toast.success('Payment processed successfully');
      // Update appointment status to confirmed
      setAppointments(appointments.map(appt => 
        appt._id === appointmentId ? { ...appt, status: 'confirmed' } : appt
      ));
    }, 2000);
  };

  const generateBookingPDF = (booking) => {
    const doc = new jsPDF();
    let y = 20;
  
    // Header styles (same as payment receipt)
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 210, 297, 'F');
    doc.setDrawColor(30, 136, 229);
    doc.setLineWidth(1.5);
    doc.rect(15, 15, 180, 267);
  
    doc.setDrawColor(200, 230, 255);
    doc.setLineWidth(0.5);
    doc.rect(18, 18, 174, 261);
  
    // Add hospital logo (replace with your actual logo)
    doc.addImage(logo, 'SVG', 25, 25, 30, 30);
  
    // Hospital header
    doc.setFontSize(20);
    doc.setTextColor(30, 136, 229);
    doc.setFont("helvetica", "bold");
    doc.text("Evergreen Hospital", 60, 35);
  
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    doc.text("Marriyar Road kalmunai", 60, 42);
    doc.text("Phone: 0772911911 | Email: Nps@gmail.com", 60, 48);
  
    // Booking confirmation title
    doc.setFontSize(16);
    doc.setTextColor(30, 136, 229);
    doc.setFont("helvetica", "bold");
    doc.text("APPOINTMENT CONFIRMATION", 105, 65, { align: 'center' });
  
    // Date and reference
    const date = new Date().toLocaleDateString();
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Date: ${date}`, 25, 80);
    doc.text(`Reference #: ${booking._id.substring(0, 8).toUpperCase()}`, 150, 80);
  
    // Divider line
    doc.setDrawColor(30, 136, 229);
    doc.setLineWidth(0.5);
    doc.line(25, 85, 185, 85);
  
    y = 95;
  
    // Main content
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 136, 229);
    doc.text(`Appointment Details`, 25, y);
    y += 10;
  
    // Patient information
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(50);
    doc.text("PATIENT INFORMATION:", 25, y);
    y += 6;
  
    doc.setFont("helvetica", "normal");
    doc.text(`Title: ${booking.title || 'N/A'}`, 30, y);
    doc.text(`Name: ${booking.name || 'N/A'}`, 110, y);
    y += 6;
    doc.text(`Email: ${booking.email || 'N/A'}`, 30, y);
    doc.text(`Phone: ${booking.mobile || 'N/A'}`, 110, y);
    y += 8;
  
    // Appointment details
    doc.setFont("helvetica", "bold");
    doc.text("APPOINTMENT DETAILS:", 25, y);
    y += 6;
  
    doc.setFont("helvetica", "normal");
    const formattedDate = new Date(booking.date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    doc.text(`Date: ${formattedDate}`, 30, y);
    
    const formattedTime = new Date(`2000-01-01T${booking.time}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    doc.text(`Time: ${formattedTime}`, 110, y);
    y += 6;
  
    doc.text(`Status: ${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}`, 30, y);
    y += 8;
  
    // Special requirements if any
    if (booking.requirements) {
      doc.setFont("helvetica", "bold");
      doc.text("SPECIAL REQUIREMENTS:", 25, y);
      y += 6;
      
      doc.setFont("helvetica", "normal");
      const splitRequirements = doc.splitTextToSize(booking.requirements, 150);
      doc.text(splitRequirements, 30, y);
      y += splitRequirements.length * 6 + 4;
    }
  
    // Footer
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(30, 136, 229);
    doc.text("Thank you for choosing Evergreen Hospital!", 105, y, { align: 'center' });
    y += 10;
  
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    doc.text("Authorized Signature:", 130, y);
    doc.line(130, y + 2, 180, y + 2);
  
    // Save the PDF
    doc.save(`appointment_confirmation_${booking._id.substring(0, 8)}.pdf`);
  };

  if (loading && !authChecked) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-gray-700">Loading your appointments...</p>
        </div>
      </div>
    );
  }

  if (!userId && authChecked) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <div className="text-yellow-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Session Expired</h2>
          <p className="text-gray-600 mb-6">Please login to view your appointments</p>
          <button 
            onClick={() => navigate('/login')}
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (error && userId) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <div className="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Appointments</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex space-x-4">
            <button 
              onClick={() => window.location.reload()}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200"
            >
              Try Again
            </button>
            <button 
              onClick={() => navigate('/')}
              className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition duration-200"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Nav2/>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-800 flex justify-center">Appointment Details</h1>
          <p className="mt-2 text-sm text-gray-600">View and manage your appointments</p>
        </div>

        {appointments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md overflow-hidden p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No appointments found</h3>
            <p className="mt-1 text-gray-500">You haven't booked any appointments yet.</p>
            <div className="mt-6">
              <button
                onClick={() => navigate('/booking')}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Book New Appointment
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {appointments.map(appointment => (
              <div key={appointment._id} className="bg-white rounded-xl shadow-md overflow-hidden">
                {editData?._id === appointment._id ? (
                  <form onSubmit={handleUpdate} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <select
                          value={editData.title}
                          onChange={(e) => setEditData({...editData, title: e.target.value})}
                          className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          required
                        >
                          <option value="Mr">Mr</option>
                          <option value="Mrs">Mrs</option>
                          <option value="Miss">Miss</option>
                          <option value="Dr">Dr</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          value={editData.name}
                          onChange={(e) => setEditData({...editData, name: e.target.value})}
                          className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          value={editData.email}
                          onChange={(e) => setEditData({...editData, email: e.target.value})}
                          className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input
                          type="tel"
                          value={editData.mobile}
                          onChange={(e) => setEditData({...editData, mobile: e.target.value})}
                          className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input
                          type="String"
                          value={editData.date}
                          onChange={(e) => setEditData({...editData, date: e.target.value})}
                          className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                        <input
                          type="time"
                          value={editData.time}
                          onChange={(e) => setEditData({...editData, time: e.target.value})}
                          className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                          value={editData.status}
                          onChange={(e) => setEditData({...editData, status: e.target.value})}
                          className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          required
                          
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-3 pt-6">
                      <button
                        type="button"
                        onClick={() => setEditData(null)}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="px-6 py-5 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          Appointment #{appointment._id.substring(0, 8).toUpperCase()}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="px-6 py-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm text-gray-500">Title</p>
                            <p className="mt-1 text-sm font-medium text-gray-900">{appointment.title}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Full Name</p>
                            <p className="mt-1 text-sm font-medium text-gray-900">{appointment.name}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="mt-1 text-sm font-medium text-gray-900">{appointment.email}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm text-gray-500">Phone Number</p>
                            <p className="mt-1 text-sm font-medium text-gray-900">{appointment.mobile}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Date</p>
                            <p className="mt-1 text-sm font-medium text-gray-900">
                              {new Date(appointment.date).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Time</p>
                            <p className="mt-1 text-sm font-medium text-gray-900">
                              {new Date(`2000-01-01T${appointment.time}`).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {appointment.requirements && (
                        <div className="mt-6">
                          <p className="text-sm text-gray-500">Special Requirements</p>
                          <p className="mt-1 text-sm font-medium text-gray-900">{appointment.requirements}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => generateBookingPDF(appointment)}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Download PDF
                        </button>
                        
                        <button
                          //onClick={() => setEditData(appointment)} 
                          onClick={() => handleEditClick(appointment)}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                      </div>
                      
                      <div className="flex space-x-3">
                        {appointment.status === 'pending' && (
                          <Link to='/MakePayment'>
                            <button
                              onClick={() => handlePayment(appointment._id)}
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                              Pay Now
                            </button>
                          </Link>
                        )}
                        
                        <button
                          onClick={() => handleDelete(appointment._id)}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingDetails;