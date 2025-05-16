import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const EditMedicine = () => {
  const { id } = useParams();
  const [medicine, setMedicine] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch medicine details from the API
  useEffect(() => {
    const fetchMedicine = async () => {
      setLoading(true);
      setError(''); // Clear any previous errors
      try {
        const response = await axios.get(`http://localhost:4000/api/medicine/${id}`);
  
        if (response.data.success) {
          setMedicine(response.data.medicine);
        }
      } catch (error) {
        if (error.response) {
          setError(
            error.response.data.error ||
            'An error occurred while fetching the medicine.'
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
  
    fetchMedicine();
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMedicine({ ...medicine, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:4000/api/medicine/${id}`,
        medicine
      );
  
      if (response.data.success) {
        navigate('/InventoryDashboard/medicine');
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        alert(error.response.data.error);
      } else {
        alert('An error occurred while updating the medicine.');
      }
    }
  };

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
        </div>
      ) : (
        <div className="p-6 max-w-md mx-auto bg-white shadow-md rounded-lg mt-10">
          <div>
            <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">Edit Medicine</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Medicine Name Field */}
              <div>
                <label htmlFor="med_name" className="block text-sm font-medium text-gray-700">
                  Medicine Name
                </label>
                <input
                  type="text"
                  id="med_name"
                  name="med_name"
                  onChange={handleChange}
                  value={medicine.med_name || ''}
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
                  value={medicine.description || ''}
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
                  value={medicine.price || ''}
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
                  value={medicine.quantity || ''}
                  placeholder="Enter Quantity"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
              >
                Update Medicine
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default EditMedicine;