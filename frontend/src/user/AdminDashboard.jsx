import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiHome, 
  FiUsers, 
  FiSettings, 
  FiLogOut, 
  FiMenu, 
  FiX,
  FiDollarSign,
  FiCalendar,
  FiMessageSquare,
  FiTrendingUp,
  FiUserPlus,
  FiUserCheck,
  FiAlertCircle
} from 'react-icons/fi';
import { FaTachometerAlt, FaUserMd } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminProfile from './AdminProfile';
import axios from 'axios';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    totalDoctors: 0,
    totalPayments: 0,
    totalBookings: 0,
    totalComplaints: 0,
    recentPayments: [],
    recentComplaints: [],
    userGrowth: 0,
    doctorGrowth: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const headers = {
        'Authorization': `Bearer ${token}`
      };

      // Fetch all users and filter doctors
      const usersResponse = await axios.get('http://localhost:4000/UserController/users', { headers });
      const allUsers = usersResponse.data.users;
      const doctors = allUsers.filter(user => user.type === 'doctor');

      // Fetch appointments
      const appointmentsResponse = await axios.get('http://localhost:4000/AppointmentController/appointments', { headers });
      
      // Fetch payments
      const paymentsResponse = await axios.get('http://localhost:4000/PaymentOperations/getpayments', { headers });

      // Fetch complaints
      const complaintsResponse = await axios.get('http://localhost:4000/ContactusOperations/getAllMessages', { headers });
      const complaints = complaintsResponse.data.data || [];
      const recentComplaints = complaints
        .filter(msg => msg.type === 'complaint')
        .slice(0, 5);

      // Calculate growth (mock data for now - you should implement actual growth calculation)
      const userGrowth = 12.5; // This should be calculated based on previous month's data
      const doctorGrowth = 8.2; // This should be calculated based on previous month's data

      setDashboardStats({
        totalUsers: allUsers.length,
        totalDoctors: doctors.length,
        totalPayments: paymentsResponse.data.payments?.length || 0,
        totalBookings: appointmentsResponse.data.count || 0,
        totalComplaints: complaints.length,
        recentPayments: paymentsResponse.data.payments?.slice(0, 5) || [],
        recentComplaints,
        userGrowth,
        doctorGrowth
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast.error('Failed to load dashboard statistics');
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handleNavigation = (path) => {
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    if (!token) {
      toast.error('Please login first');
      navigate('/login');
      return;
    }
    navigate(path);
  };

  const StatCard = ({ title, value, icon: Icon, trend, color }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
        {trend && (
          <p className={`text-sm mt-2 ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
            <FiTrendingUp className="inline mr-1" />
            {trend}% from last month
          </p>
        )}
      </div>
      <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
        <Icon className={`text-2xl ${color}`} />
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`bg-gradient-to-b from-blue-500 to-blue-900 text-white ${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 flex flex-col fixed h-full shadow-xl z-10`}>
        <div className="p-4 flex justify-between items-center border-b border-blue-700">
          {sidebarOpen && <h1 className="text-2xl font-bold whitespace-nowrap">Admin Panel</h1>}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="p-2 rounded-lg hover:bg-blue-700 transition-colors"
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        <nav className="mt-8 flex-1 space-y-2 px-2">
          {/* Navigation Items */}
          <button
            onClick={() => navigate('/PayementDetails')} 
            className="flex items-center w-full p-3 rounded-lg hover:bg-blue-700 transition-colors group"
          >
            <FiDollarSign size={22} className="flex-shrink-0 group-hover:scale-110 transition-transform" />
            {sidebarOpen && <span className="ml-4 text-lg font-medium whitespace-nowrap">Payments</span>}
          </button>

          <button
            onClick={() => navigate('/UserDetails')}
            className="flex items-center w-full p-3 rounded-lg hover:bg-blue-700 transition-colors group"
          >
            <FiUsers size={22} className="flex-shrink-0 group-hover:scale-110 transition-transform" />
            {sidebarOpen && <span className="ml-4 text-lg font-medium whitespace-nowrap">Users</span>}
          </button>

          <button
            onClick={() => navigate('/bookingTable')}
            className="flex items-center w-full p-3 rounded-lg hover:bg-blue-700 transition-colors group"
          >
            <FiCalendar size={22} className="flex-shrink-0 group-hover:scale-110 transition-transform" />
            {sidebarOpen && <span className="ml-4 text-lg font-medium whitespace-nowrap">Bookings</span>}
          </button>

          <button
            onClick={() => navigate('/Admincheck')}
            className="flex items-center w-full p-3 rounded-lg hover:bg-blue-700 transition-colors group"
          >
            <FiMessageSquare size={22} className="flex-shrink-0 group-hover:scale-110 transition-transform" />
            {sidebarOpen && <span className="ml-4 text-lg font-medium whitespace-nowrap">Complaint Tickets</span>}
          </button>

          <button
            onClick={() => navigate('/InventoryDashboard')}
            className="flex items-center w-full p-3 rounded-lg hover:bg-blue-700 transition-colors group"
          >
            <FaTachometerAlt size={22} className="flex-shrink-0 group-hover:scale-110 transition-transform" />
            {sidebarOpen && <span className="ml-4 text-lg font-medium whitespace-nowrap">Inventory</span>}
          </button>

            {/* medical reports*/}
            <button
            onClick={() => navigate('/admin-records')}
            className="flex items-center w-full p-4 hover:bg-blue-700 transition-colors"
          >
            <FiCalendar size={20} className="flex-shrink-0" />
            {sidebarOpen && <span className="ml-3 whitespace-nowrap">Medical Reports</span>}
          </button>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-blue-700">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full p-3 rounded-lg hover:bg-blue-700 transition-colors group"
          >
            <FiLogOut size={22} className="flex-shrink-0 group-hover:scale-110 transition-transform" />
            {sidebarOpen && <span className="ml-4 text-lg font-medium whitespace-nowrap">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        {/* Top Navigation Bar */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-2xl font-semibold text-gray-800 capitalize">
            {window.location.pathname.split('/').pop() || 'Dashboard'}
          </h2>
          <div className="flex items-center space-x-4">
            <AdminProfile />
          </div>
        </header>
        
        {/* Content Area */}
        <main className="flex-1 overflow-auto p-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total Users"
                value={dashboardStats.totalUsers}
                icon={FiUsers}
                trend={dashboardStats.userGrowth}
                color="text-blue-500"
              />
              <StatCard
                title="Total Doctors"
                value={dashboardStats.totalDoctors}
                icon={FaUserMd}
                trend={dashboardStats.doctorGrowth}
                color="text-green-500"
              />
              {/* <StatCard
                title="Total Payments"
                value={`$${dashboardStats.totalPayments}`}
                icon={FiDollarSign}
                color="text-purple-500"
              /> */}
              <StatCard
                title="Total Bookings"
                value={dashboardStats.totalBookings}
                icon={FiCalendar}
                color="text-orange-500"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Payments Table */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">Recent Payments</h3>
                  <button 
                    onClick={() => navigate('/PayementDetails')}
                    className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                  >
                    View All
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-gray-500 text-sm">
                        <th className="pb-4">User</th>
                        <th className="pb-4">Amount</th>
                        <th className="pb-4">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardStats.recentPayments.map((payment) => (
                        <tr key={payment._id} className="border-t border-gray-100">
                          <td className="py-4">{payment.userName || 'N/A'}</td>
                          <td className="py-4">${payment.amount}</td>
                          <td className="py-4">{new Date(payment.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recent Complaints Table */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">Recent Complaints</h3>
                  <button 
                    onClick={() => navigate('/Admincheck')}
                    className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                  >
                    View All
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-gray-500 text-sm">
                        <th className="pb-4">User</th>
                        <th className="pb-4">Type</th>
                        <th className="pb-4">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardStats.recentComplaints.map((complaint) => (
                        <tr key={complaint._id} className="border-t border-gray-100">
                          <td className="py-4">{complaint.username || 'N/A'}</td>
                          <td className="py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              complaint.type === 'complaint' ? 'bg-red-100 text-red-800' : 
                              complaint.type === 'feedback' ? 'bg-green-100 text-green-800' : 
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {complaint.type}
                            </span>
                          </td>
                          <td className="py-4">{new Date(complaint.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;