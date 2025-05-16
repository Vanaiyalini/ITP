import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddDepartment = () => {
    const [Department, setDepartment] = useState({
        dep_name: '',
        description: ''
    });

    const Navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDepartment({ ...Department, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.post(
            'http://localhost:4000/api/department/add',
            Department // Include the Department data in the request body
          );
      
          if (response.data.success) {
            Navigate('/InventoryDashboard/department');
          }
        } catch (error) {
          if (error.response && !error.response.data.success) {
            alert(error.response.data.error);
          } else {
            alert('An error occurred while adding the department.');
          }
        }
      };

    return (
        <div className="p-6 max-w-md mx-auto bg-white shadow-md rounded-lg mt-10">
            <div>
                <h3 className="text-2xl font-bold text-center mb-6 text-blue-800">Add Department</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Department Name Field */}
                    <div>
                        <label htmlFor="dep_name" className="block text-sm font-medium text-gray-700">
                            Department Name
                        </label>
                        <input
                            type="text"
                            id="dep_name"
                            name="dep_name" // Added name attribute
                            onChange={handleChange}
                            placeholder="Enter Department Name"
                            className="mt-4 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                            className="mt-4 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                            rows={4}
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors mt-1"
                    >
                        Add Department
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddDepartment;