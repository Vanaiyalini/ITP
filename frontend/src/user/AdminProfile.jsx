import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  FaUserMd,
  FaUserInjured,
  FaHome,
  FaBirthdayCake,
  FaPhone,
  FaEnvelope,
  FaVenusMars,
  FaCalendarAlt,
  FaSave,
  FaTimes,
  FaEdit,
  FaChevronDown,
  FaUserCircle,
  FaCog,
  FaSignOutAlt
} from 'react-icons/fa';

const AdminProfile = () => {
  const [profile, setProfile] = useState({
    _id: '',
    name: '',
    email: '',
    type: '',
    mobile: '',
    gender: '',
    address: '',
    dob: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState({
    profile: false,
    update: false
  });
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
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
          confirmPassword: ''
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
    } else {
      fetchProfile();
    }

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (!event.target.closest('.profile-dropdown')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
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
        mobile: profile.mobile,
        gender: profile.gender,
        address: profile.address,
        dob: profile.dob
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

      if (response.data?.success) {
        toast.success('Profile updated successfully');
        setIsEditing(false);
        setShowDropdown(false);
        fetchProfile();
      } else {
        setError(response.data?.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Update error:', err);
      setError(err.response?.data?.message || 'Error updating profile');
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

  if (loading.profile) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="profile-dropdown relative">
      {/* Profile Dropdown Toggle */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-2 focus:outline-none"
      >
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
          {profile.type === 'doctor' ? (
            <FaUserMd className="text-blue-500 text-sm" />
          ) : (
            <FaUserInjured className="text-blue-500 text-sm" />
          )}
        </div>
        <span className="hidden md:inline text-sm font-medium text-gray-700">
          {profile.name || 'Profile'}
        </span>
        <FaChevronDown 
          className={`text-gray-500 text-xs transition-transform ${showDropdown ? 'transform rotate-180' : ''}`}
        />
      </button>

      {/* Profile Dropdown Content */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg z-50 border border-gray-200 divide-y divide-gray-100">
          {/* Profile Header */}
          <div className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                {profile.type === 'doctor' ? (
                  <FaUserMd className="text-blue-500 text-xl" />
                ) : (
                  <FaUserInjured className="text-blue-500 text-xl" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{profile.name}</h3>
                <p className="text-xs text-gray-500">{profile.email}</p>
                <p className="text-xs text-blue-600 mt-1 capitalize">{profile.type || 'admin'}</p>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-4 space-y-3 text-sm">
            <div className="flex items-center">
              <FaPhone className="text-gray-400 mr-3 flex-shrink-0" />
              <span>{profile.mobile || 'Not provided'}</span>
            </div>
            <div className="flex items-center">
              <FaVenusMars className="text-gray-400 mr-3 flex-shrink-0" />
              <span>{profile.gender || 'Not specified'}</span>
            </div>
            {profile.address && (
              <div className="flex items-start">
                <FaHome className="text-gray-400 mr-3 mt-1 flex-shrink-0" />
                <span>{profile.address}</span>
              </div>
            )}
            {profile.dob && (
              <div className="flex items-center">
                <FaBirthdayCake className="text-gray-400 mr-3 flex-shrink-0" />
                <span>{new Date(profile.dob).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="p-2">
            <button
              onClick={() => {
                setIsEditing(true);
                setShowDropdown(true);
              }}
              className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
            >
              <FaUserCircle className="mr-2 text-gray-500" />
              Edit Profile
            </button>
            <button
              onClick={() => navigate('/settings')}
              className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
            >
              <FaCog className="mr-2 text-gray-500" />
              Settings
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
            >
              <FaSignOutAlt className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Edit Profile</h3>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setError('');
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>

            {error && (
              <div className="mb-4 text-red-500 text-sm">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  readOnly
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="mobile"
                  value={profile.mobile}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">New Password (optional)</label>
                <input
                  type="password"
                  name="password"
                  value={profile.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded"
                  placeholder="Leave blank to keep current"
                />
              </div>

              {profile.password && (
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={profile.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded"
                  />
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded flex items-center"
                  disabled={loading.update}
                >
                  {loading.update ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <FaSave className="mr-1" /> Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProfile;