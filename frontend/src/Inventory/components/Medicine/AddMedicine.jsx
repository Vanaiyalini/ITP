import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddMedicine = () => {
    const [Medicine, setMedicine] = useState({
        med_name: '',
        description: '',
        price: '',
        quantity: ''
    });

    const Navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMedicine({ ...Medicine, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.post(
            'http://localhost:4000/api/medicine/add',
            Medicine // Include the Medicine data in the request body
          );
      
          if (response.data.success) {
            Navigate('/InventoryDashboard/medicine');
          }
        } catch (error) {
          if (error.response && !error.response.data.success) {
            alert(error.response.data.error);
          } else {
            alert('An error occurred while adding the medicine.');
          }
        }
      };

    return (
        <div className="p-6 max-w-md mx-auto bg-white shadow-md rounded-lg mt-10">
            <div>
                <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">Add Medicine</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Medicine Name Field */}
                    <div>
                        <label htmlFor="med_name" className="block text-sm font-medium text-gray-700">
                            Medicine Name
                        </label>
                        <input
                            type="text"
                            id="med_name"
                            name="med_name" // Added name attribute
                            onChange={handleChange}
                            placeholder="Enter Medicine Name"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                        />
                    </div>

                    {/* Price Field */}
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                            Price
                        </label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            onChange={handleChange}
                            placeholder="Enter Price"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                    </div>

                    {/* Quantity Field */}
                    <div>
                        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                            Quantity
                        </label>
                        <input
                            type="number"
                            id="quantity"
                            name="quantity"
                            onChange={handleChange}
                            placeholder="Enter Quantity"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
                    >
                        Add Medicine
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddMedicine;