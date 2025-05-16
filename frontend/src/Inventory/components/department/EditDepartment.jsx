import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const EditDepartment = () => {
  const { id } = useParams();
  const [department, setDepartment] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartment = async () => {
      setLoading(true);
      setError(''); // Clear any previous errors
      try {
        const response = await axios.get(`http://localhost:4000/api/department/${id}`);
        console.log(response.data);
  
        if (response.data.success) {
          setDepartment(response.data.department);
        }
      } catch (error) {
        if (error.response) {
          setError(
            error.response.data.error ||
            'An error occurred while fetching the department.'
          );
        } else if (error.request) {
          setError('Network error. Please check your connection.');
        } else {
          setError('An unexpected error occurred.');
        }
      } finally {
        setLoading(false);
      }
    };
  
    fetchDepartment();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDepartment({ ...department, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:4000/api/department/${id}`,
        department
      );
      if (response.data.success) {
        navigate('/InventoryDashboard/department');
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        alert(error.response.data.error);
      } else {
        alert('An error occurred while updating the department.');
      }
    }
  };

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="p-6 max-w-md mx-auto bg-white shadow-md rounded-lg mt-10">
          <div>
            <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">Edit Department</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Department Name Field */}
              <div>
                <label htmlFor="dep_name" className="block text-sm font-medium text-gray-700">
                  Department Name
                </label>
                <input
                  type="text"
                  id="dep_name"
                  name="dep_name"
                  onChange={handleChange}
                  value={department.dep_name || ''}
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
                  value={department.description || ''}
                  placeholder="Description"
                  className="mt-4 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  rows={4}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="mt-4 w-full px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
              >
                Edit Department
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default EditDepartment;