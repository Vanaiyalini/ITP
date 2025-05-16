import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './Nav2';
import logo from '../assets/logo.svg';
import { 
  FaUserMd,
  FaUserInjured,
  FaEnvelope,
  FaSave,
  FaTimes,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaHeadset,
  FaFilePrescription,
  FaFileDownload,
  FaUserCircle,
  FaEdit,
  FaHistory,
  FaFileAlt
} from 'react-icons/fa';
import Myrequests from '../ContactUs/Myrequests';


const Profile = () => {
  const [profile, setProfile] = useState({
    _id: '',
    name: '',
    email: '',
    type: '',
    password: '',
    confirmPassword: '',
    birthDate: '',
    nic: '',
    address: '',
    contactMessages: []
  });
  
  const [loading, setLoading] = useState({
    profile: false,
    update: false,
    report: false,
    contact: false
  });
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const fetchProfile = async () => {
    setLoading(prev => ({ ...prev, profile: true }));
    setError('');

    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('Please login to view profile');
      navigate('/login');
      return;
    }

    try {
      const response = await axios.get('http://localhost:4000/UserController/getUser', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data?.success) {
        const userData = response.data.user;
        setProfile({
          ...userData,
          password: '',
          confirmPassword: '',
          birthDate: userData.birthDate || '',
          nic: userData.nic || '',
          address: userData.address || ''
        });
        localStorage.setItem('userData', JSON.stringify(userData));
      }
    } catch (err) {
      console.error('Profile fetch error:', err);
      if (err.response?.status === 401) {
        handleLogout();
        setError('Session expired. Please login again.');
      } else {
        setError(err.response?.data?.message || 'Failed to load profile.');
      }
    } finally {
      setLoading(prev => ({ ...prev, profile: false }));
    }
  };

  const fetchContactMessages = async () => {
    setLoading(prev => ({ ...prev, contact: true }));
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      if (!profile._id) {
        console.error('No user ID found');
        return;
      }

      const response = await axios.get(`http://localhost:4000/ContactusOperations/getmsg/user/${profile._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data?.success) {
        // Ensure we're setting the messages array even if it's empty
        const messages = response.data.data || [];
        setProfile(prev => ({
          ...prev,
          contactMessages: messages
        }));
      } else {
        console.error('Failed to fetch contact messages:', response.data?.message);
        setProfile(prev => ({
          ...prev,
          contactMessages: []
        }));
      }
    } catch (err) {
      console.error('Error fetching contact messages:', err);
      if (err.response?.status === 401) {
        handleLogout();
      } else if (err.response?.status === 500) {
        console.error('Server error:', err.response?.data?.message);
      }
      setProfile(prev => ({
        ...prev,
        contactMessages: []
      }));
    } finally {
      setLoading(prev => ({ ...prev, contact: false }));
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      setProfile({
        ...userData,
        password: '',
        confirmPassword: ''
      });
      fetchContactMessages();
    } else {
      fetchProfile();
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, update: true }));
    setError('');

    if (profile.password && profile.password !== profile.confirmPassword) {
      setError("Passwords don't match");
      setLoading(prev => ({ ...prev, update: false }));
      return;
    }

    if (profile.password && profile.password.length < 8) {
      setError("Password must be at least 8 characters");
      setLoading(prev => ({ ...prev, update: false }));
      return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('Please login to update profile');
      navigate('/login');
      return;
    }

    try {
      const updateData = {
        name: profile.name,
        email: profile.email,
        birthDate: profile.birthDate,
        nic: profile.nic,
        address: profile.address
      };

      if (profile.password) {
        updateData.password = profile.password;
      }

      const response = await axios.put(
        `http://localhost:4000/UserController/updateUser/${profile._id}`,
        updateData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        toast.success('Profile updated successfully');
        setIsEditing(false);
        setProfile(prev => ({
          ...prev,
          ...response.data.user,
          password: '',
          confirmPassword: ''
        }));
        localStorage.setItem('userData', JSON.stringify(response.data.user));
      } else {
        setError(response.data.message || 'Failed to update profile');
        toast.error(response.data.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Update error:', err);
      const errorMessage = err.response?.data?.message || 'Error updating profile';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(prev => ({ ...prev, update: false }));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const generateReport = async () => {
    setLoading(prev => ({ ...prev, report: true }));
    setError('');
    
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Please login to generate report');
        navigate('/login');
        return;
      }

      // Fetch all required data
      const [appointmentsResponse, paymentsResponse, contactsResponse] = await Promise.all([
        axios.get(`http://localhost:4000/Appointmentcontroller/appointments/user/${profile._id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        axios.get(`http://localhost:4000/PaymentOperations/getpayments/user/${profile._id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        axios.get(`http://localhost:4000/ContactusOperations/getmsg/user/${profile._id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const response = await axios.post('http://localhost:4000/ReportController/generate-detailed-report', {
        userData: profile,
        appointmentData: appointmentsResponse.data.appointments || [],
        paymentData: paymentsResponse.data.payments || [],
        contactData: contactsResponse.data.data || []
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        responseType: 'blob'
      });

      if (response.status === 200) {
        // Create a download link
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `User-Report-${profile._id}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        toast.success('Report generated successfully');
      } else {
        throw new Error('Failed to generate report');
      }
    } catch (err) {
      console.error('Detailed report generation error:', err);
      setError(err.response?.data?.message || 'Error generating report');
      toast.error('Failed to generate report');
    } finally {
      setLoading(prev => ({ ...prev, report: false }));
    }
  };

  if (loading.profile) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error && !isEditing) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">
                {profile.type === 'doctor' ? (
                  <FaUserMd className="text-blue-500 text-5xl" />
                ) : (
                  <FaUserInjured className="text-blue-500 text-5xl" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{profile.name}</h1>
                <p className="text-gray-600 capitalize">{profile.type}</p>
                <p className="text-gray-500">{profile.email}</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <FaEdit className="mr-2" /> Edit Profile
              </button>
              <button
                onClick={generateReport}
                disabled={loading.report}
                className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                {loading.report ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <FaFileDownload className="mr-2" /> Generate Report
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Information Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaUserCircle className="mr-2 text-blue-500" /> Profile Information
            </h2>
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={profile.password}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Birth Date</label>
                  <input
                    type="date"
                    name="birthDate"
                    value={profile.birthDate ? profile.birthDate.split('T')[0] : ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">NIC Number</label>
                  <input
                    type="text"
                    name="nic"
                    value={profile.nic}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter NIC number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea
                    name="address"
                    value={profile.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    placeholder="Enter your address"
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                  <span className="text-gray-600">Name</span>
                  <span className="font-medium">{profile.name}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                  <span className="text-gray-600">Email</span>
                  <span className="font-medium">{profile.email}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                  <span className="text-gray-600">Account Type</span>
                  <span className="font-medium capitalize">{profile.type}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                  <span className="text-gray-600">Birth Date</span>
                  <span className="font-medium">
                    {profile.birthDate ? new Date(profile.birthDate).toLocaleDateString() : 'Not set'}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                  <span className="text-gray-600">NIC Number</span>
                  <span className="font-medium">{profile.nic || 'Not set'}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                  <span className="text-gray-600">Address</span>
                  <span className="font-medium">{profile.address || 'Not set'}</span>
                </div>
              </div>
            )}
          </div>

 
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaHistory className="mr-2 text-blue-500" /> Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => navigate('/bookingdetails')}
                className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <FaCalendarAlt className="text-blue-500 text-2xl mb-2" />
                <span className="text-sm font-medium text-gray-700">My Appointments</span>
              </button>
              <button 
                onClick={() => navigate('/Mypayments')}
                className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              >
                <FaMoneyBillWave className="text-green-500 text-2xl mb-2" />
                <span className="text-sm font-medium text-gray-700">Payment History</span>
              </button>
              <button 
                onClick={() => navigate('/Contact')}
                className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <FaHeadset className="text-purple-500 text-2xl mb-2" />
                <span className="text-sm font-medium text-gray-700">Contact Support</span>
              </button>
              <button 
                onClick={() => navigate('/prescriptions')}
                className="flex flex-col items-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
              >
                <FaFilePrescription className="text-yellow-500 text-2xl mb-2" />
                <span className="text-sm font-medium text-gray-700">My Prescriptions</span>
              </button>


              {profile.type === 'doctor' && (
                <button 
                  onClick={() => navigate('/ScheduleAdd')}
                  className="w-full py-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition-colors"
                >
                  Add Slots
                </button>
              )}
            </div>
          </div>


          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaFileAlt className="mr-2 text-blue-500" /> Recent Activity
            </h2>
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-md">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">Last Report Generated</span>
                  <span className="text-sm text-gray-500">2 days ago</span>
                </div>
                <p className="text-sm text-gray-600">Detailed user report with all activities</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-md">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">Last Appointment</span>
                  <span className="text-sm text-gray-500">1 week ago</span>
                </div>
                <p className="text-sm text-gray-600">Regular checkup with Dr. Smith</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-md">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">Last Payment</span>
                  <span className="text-sm text-gray-500">2 weeks ago</span>
                </div>
                <p className="text-sm text-gray-600">Payment for consultation services</p>
              </div>
            </div>
          </div>


          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaEnvelope className="mr-2 text-blue-500" /> Contact Messages
            </h2>
            <Myrequests/>
         
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;