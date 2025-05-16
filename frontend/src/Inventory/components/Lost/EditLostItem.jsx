import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditLostItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lostItem, setLostItem] = useState({
    item_name: '',
    description: '',
    location: '',
    date_lost: '',
    status: 'lost',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch existing data for the item
  useEffect(() => {
    const fetchLostItem = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/lostitems/${id}`);
        if (response.data.success) {
          const item = response.data.data;
          setLostItem({
            item_name: item.item_name,
            description: item.description,
            location: item.location,
            date_lost: item.date_lost.split('T')[0], // format for input type="date"
            status: item.status,
          });
        } else {
          setError('Lost item not found.');
        }
      } catch (err) {
        setError('Error fetching lost item details.');
      } finally {
        setLoading(false);
      }
    };

    fetchLostItem();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLostItem({ ...lostItem, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:4000/api/lostitems/${id}`, lostItem);
      if (response.data.success) {
        navigate('/InventoryDashboard/lostitems');
      } else {
        alert('Update failed. Please try again.');
      }
    } catch (err) {
      alert('An error occurred while updating the lost item.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow-md rounded-lg mt-10">
      <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">Edit Lost Item</h3>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="item_name" className="block text-sm font-medium text-gray-700">
            Item Name
          </label>
          <input
            type="text"
            id="item_name"
            name="item_name"
            value={lostItem.item_name}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={lostItem.description}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500"
            rows={4}
            required
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={lostItem.location}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500"
            required
          />
        </div>

        <div>
          <label htmlFor="date_lost" className="block text-sm font-medium text-gray-700">
            Date Lost
          </label>
          <input
            type="date"
            id="date_lost"
            name="date_lost"
            value={lostItem.date_lost}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500"
            required
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={lostItem.status}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500"
          >
            <option value="lost">Lost</option>
            <option value="found">Found</option>
            <option value="returned">Returned</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
        >
          Update Item
        </button>
      </form>
    </div>
  );
};

export default EditLostItem;