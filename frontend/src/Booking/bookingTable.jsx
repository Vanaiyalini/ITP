import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BookingTable = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
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

  const getAuthHeader = () => {
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    return {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      }
    };
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get(
          'http://localhost:4000/AppointmentController/appointments',
          getAuthHeader()
        );
        setBookings(res.data?.appointments || []);
      } catch (err) {
        handleApiError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleApiError = (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('token');
      navigate('/login');
    } else {
      const msg = err?.response?.data?.message || 'An error occurred';
      setError(msg);
      toast.error(msg);
    }
  };

  const handleEdit = (booking) => {
    setEditingId(booking._id);
    setEditForm({
      title: booking.title || '',
      name: booking.name || '',
      email: booking.email || '',
      mobile: booking.mobile || '',
      nic: booking.nic || '',
      area: booking.area || '',
      gender: booking.gender || '',
      date: booking.date ? new Date(booking.date).toISOString().split('T')[0] : '',
      time: booking.time || '',
      requirements: booking.requirements || ''
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        `http://localhost:4000/AppointmentController/appointments/${editingId}`,
        editForm,
        getAuthHeader()
      );

      if (res.status === 200) {
        setBookings((prev) =>
          prev.map((b) => (b._id === editingId ? { ...b, ...editForm } : b))
        );
        setEditingId(null);
        toast.success('Booking updated successfully');
      } else {
        toast.error('Failed to update booking');
      }
    } catch (err) {
      handleApiError(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return;

    try {
      const res = await axios.delete(
        `http://localhost:4000/AppointmentController/appointments/${id}`,
        getAuthHeader()
      );

      if (res.status === 200 || res.status === 204) {
        setBookings((prev) => prev.filter((b) => b._id !== id));
        toast.success('Booking deleted successfully');
      } else {
        toast.error('Failed to delete booking');
      }
    } catch (err) {
      handleApiError(err);
    }
  };

  if (loading) return <div className="text-center py-8">Loading bookings...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-blue-800 mb-6">Booking Management</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b">Title & Name</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Mobile</th>
              <th className="py-2 px-4 border-b">NIC</th>
              <th className="py-2 px-4 border-b">Area</th>
              <th className="py-2 px-4 border-b">Gender</th>
              <th className="py-2 px-4 border-b">Date</th>
              <th className="py-2 px-4 border-b">Time</th>
              <th className="py-2 px-4 border-b">Requirements</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id} className="hover:bg-gray-50">
                {editingId === booking._id ? (
                  <>
                    <td className="py-2 px-4 border-b">
                      <select name="title" value={editForm.title} onChange={handleEditChange} className="block w-full p-1 border rounded mb-1">
                        <option value="Mr">Mr</option>
                        <option value="Mrs">Mrs</option>
                        <option value="Miss">Miss</option>
                      </select>
                      <input name="name" value={editForm.name} onChange={handleEditChange} className="block w-full p-1 border rounded" />
                    </td>
                    <td className="py-2 px-4 border-b">
                      <input name="email" value={editForm.email} onChange={handleEditChange} className="w-full p-1 border rounded" />
                    </td>
                    <td className="py-2 px-4 border-b">
                      <input name="mobile" value={editForm.mobile} onChange={handleEditChange} className="w-full p-1 border rounded" />
                    </td>
                    <td className="py-2 px-4 border-b">
                      <input name="nic" value={editForm.nic} onChange={handleEditChange} className="w-full p-1 border rounded" />
                    </td>
                    <td className="py-2 px-4 border-b">
                      <input name="area" value={editForm.area} onChange={handleEditChange} className="w-full p-1 border rounded" />
                    </td>
                    <td className="py-2 px-4 border-b">
                      <select name="gender" value={editForm.gender} onChange={handleEditChange} className="w-full p-1 border rounded">
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </td>
                    <td className="py-2 px-4 border-b">
                      <input type="date" name="date" value={editForm.date} onChange={handleEditChange} className="w-full p-1 border rounded" />
                    </td>
                    <td className="py-2 px-4 border-b">
                      <input name="time" value={editForm.time} onChange={handleEditChange} className="w-full p-1 border rounded" />
                    </td>
                    <td className="py-2 px-4 border-b">
                      <input name="requirements" value={editForm.requirements} onChange={handleEditChange} className="w-full p-1 border rounded" />
                    </td>
                    <td className="py-2 px-4 border-b">
                      <div className="flex gap-2">
                        <button onClick={handleUpdate} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded">Save</button>
                        <button onClick={() => setEditingId(null)} className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded">Cancel</button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="py-2 px-4 border-b">{booking.title} {booking.name}</td>
                    <td className="py-2 px-4 border-b">{booking.email}</td>
                    <td className="py-2 px-4 border-b">{booking.mobile}</td>
                    <td className="py-2 px-4 border-b">{booking.nic}</td>
                    <td className="py-2 px-4 border-b">{booking.area}</td>
                    <td className="py-2 px-4 border-b">{booking.gender}</td>
                    <td className="py-2 px-4 border-b">{new Date(booking.date).toLocaleDateString()}</td>
                    <td className="py-2 px-4 border-b">{booking.time}</td>
                    <td className="py-2 px-4 border-b">{booking.requirements}</td>
                    <td className="py-2 px-4 border-b">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(booking)} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded">Edit</button>
                        <button onClick={() => handleDelete(booking._id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">Delete</button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {bookings.length === 0 && (
        <div className="text-center py-8 text-gray-500">No bookings found</div>
      )}
    </div>
  );
};

export default BookingTable;
