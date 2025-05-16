import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddEquipment = () => {
    const [equipment, setEquipment] = useState({
        equipmentName: '',
        equipmentId: '',
        department: '',
        quantity: '',
        price: ''
    });

    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/department');
                if (response.data.success) {
                    setDepartments(response.data.departments);
                }
            } catch (error) {
                setError('Failed to fetch departments');
                console.error('Error fetching departments:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDepartments();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEquipment({ ...equipment, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        
        try {
            const response = await axios.post(
                'http://localhost:4000/api/equipment/add',
                equipment
            );
        
            if (response.data.success) {
                alert('Equipment added successfully!');
                navigate('/InventoryDashboard/equipments');
            }
        } catch (error) {
            console.error('Error adding equipment:', error);
            if (error.response) {
                alert(error.response.data.error || 'Failed to add equipment');
            } else if (error.request) {
                alert('No response from server. Please try again.');
            } else {
                alert('Error: ' + error.message);
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 max-w-md mx-auto bg-white shadow-md rounded-lg mt-10">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-md mx-auto bg-white shadow-md rounded-lg mt-10">
            <div>
                <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">Add Equipment</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="equipmentName" className="block text-sm font-medium text-gray-700">
                            Equipment Name *
                        </label>
                        <input
                            type="text"
                            id="equipmentName"
                            name="equipmentName"
                            value={equipment.equipmentName}
                            onChange={handleChange}
                            placeholder="Enter Equipment Name"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="equipmentId" className="block text-sm font-medium text-gray-700">
                            Equipment ID *
                        </label>
                        <input
                            type="text"
                            id="equipmentId"
                            name="equipmentId"
                            value={equipment.equipmentId}
                            onChange={handleChange}
                            placeholder="Enter Equipment ID"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                            Department *
                        </label>
                        <select
                            id="department"
                            name="department"
                            value={equipment.department}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                            required
                        >
                            <option value="">Select Department</option>
                            {departments.map((dept) => (
                                <option key={dept._id} value={dept.dep_name}>
                                    {dept.dep_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                            Quantity *
                        </label>
                        <input
                            type="number"
                            id="quantity"
                            name="quantity"
                            value={equipment.quantity}
                            onChange={handleChange}
                            placeholder="Enter Quantity"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                            min="1"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                            Price *
                        </label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={equipment.price}
                            onChange={handleChange}
                            placeholder="Enter Price"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                            min="0"
                            step="0.01"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className={`w-full px-4 py-2 text-white rounded-md transition-colors ${
                            submitting ? 'bg-teal-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700'
                        }`}
                    >
                        {submitting ? 'Adding...' : 'Add Equipment'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddEquipment;