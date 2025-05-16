import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddLostItem = () => {
    const [LostItem, setLostItem] = useState({
        item_name: '',
        description: '',
        location: '',
        date_lost: '',
        status: 'lost' // default status
    });

    const Navigate = useNavigate();
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setLostItem({ ...LostItem, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                'http://localhost:4000/api/lostitems',
                LostItem
              );
      
          if (response.data.success) {
            Navigate('/InventoryDashboard/lostitems');
          }
        } catch (error) {
          if (error.response && !error.response.data.success) {
            alert(error.response.data.error);
          } else {
            alert('An error occurred while adding the lost item.');
          }
        }
      };

    return (
        <div className="p-6 max-w-md mx-auto bg-white shadow-md rounded-lg mt-10">
            <div>
                <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">Add Lost Item</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Item Name Field */}
                    <div>
                        <label htmlFor="item_name" className="block text-sm font-medium text-gray-700">
                            Item Name
                        </label>
                        <input
                            type="text"
                            id="item_name"
                            name="item_name"
                            onChange={handleChange}
                            placeholder="Enter Item Name"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                            required
                        />
                    </div>

                    {/* Description Field */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            onChange={handleChange}
                            placeholder="Description"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                            rows={4}
                            required
                        />
                    </div>

                    {/* Location Field */}
                    <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                            Location
                        </label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            onChange={handleChange}
                            placeholder="Where was it lost?"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                            required
                        />
                    </div>

                    {/* Date Lost Field */}
                    <div>
                        <label htmlFor="date_lost" className="block text-sm font-medium text-gray-700">
                            Date Lost
                        </label>
                        <input
                            type="date"
                            id="date_lost"
                            name="date_lost"
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                            required
                        />
                    </div>

                    {/* Status Field */}
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                            Status
                        </label>
                        <select
                            id="status"
                            name="status"
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        >
                            <option value="lost">Lost</option>
                            <option value="found">Found</option>
                            <option value="returned">Returned</option>
                        </select>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
                    >
                        Add Lost Item
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddLostItem;