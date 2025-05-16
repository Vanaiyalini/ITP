import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const EditEquipment = () => {
  const { id } = useParams();
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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch departments
        const deptResponse = await axios.get('http://localhost:4000/api/department');
        if (deptResponse.data.success) {
          setDepartments(deptResponse.data.departments);
        }

        // Fetch equipment details
        const equipResponse = await axios.get(`http://localhost:4000/api/equipment/${id}`);
        if (equipResponse.data.success) {
          setEquipment(equipResponse.data.equipment);
        }
      } catch (error) {
        setError(error.response?.data?.error || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEquipment({ ...equipment, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:4000/api/equipment/${id}`,
        equipment
      );
  
      if (response.data.success) {
        navigate('/InventoryDashboard/equipments');
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.error || 'Failed to update equipment');
      } else {
        alert('An error occurred while updating the equipment.');
      }
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
        <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">Edit Equipment</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Equipment Name Field */}
          <div>
            <label htmlFor="equipmentName" className="block text-sm font-medium text-gray-700">
              Equipment Name
            </label>
            <input
              type="text"
              id="equipmentName"
              name="equipmentName"
              onChange={handleChange}
              value={equipment.equipmentName || ''}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          {/* Equipment ID Field */}
          <div>
            <label htmlFor="equipmentId" className="block text-sm font-medium text-gray-700">
              Equipment ID
            </label>
            <input
              type="text"
              id="equipmentId"
              name="equipmentId"
              onChange={handleChange}
              value={equipment.equipmentId || ''}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          {/* Department Field - Now a select dropdown */}
          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700">
              Department
            </label>
            <select
              id="department"
              name="department"
              onChange={handleChange}
              value={equipment.department || ''}
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
              value={equipment.quantity || ''}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              min="1"
              required
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
              value={equipment.price || ''}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              min="0"
              step="0.01"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
          >
            Update Equipment
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditEquipment;