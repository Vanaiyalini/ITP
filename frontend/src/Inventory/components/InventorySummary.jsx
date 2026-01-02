import React, { useEffect, useState } from 'react';
import { FaTachometerAlt } from 'react-icons/fa';
import SummaryCard from './summaryCard';
import axios from 'axios';

export const InventorySummary = () => {
  const [medicines, setMedicines] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [lostItems, setLostItems] = useState([]);
  
  const [loading, setLoading] = useState({
    medicines: false,
    departments: false,
    lostItems: false
  });
  
  const [error, setError] = useState({
    medicines: '',
    departments: '',
    lostItems: ''
  });

  // Fetch medicines from the API
  useEffect(() => {
    const fetchMedicines = async () => {
      setLoading(prev => ({...prev, medicines: true}));
      setError(prev => ({...prev, medicines: ''}));

      try {
        const response = await axios.get('http://localhost:4000/api/medicine');
        
        if (response.data.success) {
          setMedicines(response.data.medicines);
        }
      } catch (error) {
        if (error.response) {
          setError(prev => ({
            ...prev,
            medicines: error.response.data.error || 'Failed to fetch medicine data'
          }));
        } else {
          setError(prev => ({
            ...prev,
            medicines: 'Network error. Please check your connection.'
          }));
        }
      } finally {
        setLoading(prev => ({...prev, medicines: false}));
      }
    };

    fetchMedicines();
  }, []);

  // Fetch departments from the API
  useEffect(() => {
    const fetchDepartments = async () => {
      setLoading(prev => ({...prev, departments: true}));
      setError(prev => ({...prev, departments: ''}));

      try {
        const response = await axios.get('http://localhost:4000/api/department');
        
        if (response.data.success) {
          setDepartments(response.data.departments);
        }
      } catch (error) {
        if (error.response) {
          setError(prev => ({
            ...prev,
            departments: error.response.data.error || 'Failed to fetch department data'
          }));
        } else {
          setError(prev => ({
            ...prev,
            departments: 'Network error. Please check your connection.'
          }));
        }
      } finally {
        setLoading(prev => ({...prev, departments: false}));
      }
    };

    fetchDepartments();
  }, []);

  // Fetch lost items from the API
  useEffect(() => {
    const fetchLostItems = async () => {
      setLoading(prev => ({...prev, lostItems: true}));
      setError(prev => ({...prev, lostItems: ''}));

      try {
        const response = await axios.get('http://localhost:4000/api/lostitems');
        
        if (response.data.success) {
          setLostItems(response.data.data); // Note: Using response.data.data based on your LostItemList component
        }
      } catch (error) {
        if (error.response) {
          setError(prev => ({
            ...prev,
            lostItems: error.response.data.error || 'Failed to fetch lost items data'
          }));
        } else {
          setError(prev => ({
            ...prev,
            lostItems: 'Network error. Please check your connection.'
          }));
        }
      } finally {
        setLoading(prev => ({...prev, lostItems: false}));
      }
    };

    fetchLostItems();
  }, []);

  // Calculate summary numbers
  const totalMedicines = medicines.length;
  const outOfStockMedicines = medicines.filter(med => med.quantity <= 0).length;
  const totalDepartments = departments.length;
  const totalLostItems = lostItems.length;
  const foundLostItems = lostItems.filter(item => item.status.toLowerCase() === 'found').length;
  const returnedLostItems = lostItems.filter(item => item.status.toLowerCase() === 'returned').length;

  const isLoading = loading.medicines || loading.departments || loading.lostItems;
  const hasError = error.medicines || error.departments || error.lostItems;

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="p-6">
        {error.medicines && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
            Medicine Error: {error.medicines}
          </div>
        )}
        {error.departments && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
            Department Error: {error.departments}
          </div>
        )}
        {error.lostItems && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
            Lost Items Error: {error.lostItems}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* First Section */}
      <h3 className="text-2xl font-bold">Inventory Overview</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <SummaryCard icon={<FaTachometerAlt />} text="Total Equipments" number={13} color="bg-teal-600" />
        <SummaryCard 
          icon={<FaTachometerAlt />} 
          text="Total Medicine" 
          number={totalMedicines} 
          color="bg-purple-600" 
        />
        <SummaryCard 
          icon={<FaTachometerAlt />} 
          text="Total Departments" 
          number={totalDepartments} 
          color="bg-blue-600" 
        />
        <SummaryCard 
          icon={<FaTachometerAlt />} 
          text="Lost Items" 
          number={totalLostItems} 
          color="bg-red-600" 
        />
      </div>

      {/* Second Section - Detailed Lost Items Info */}
      <div className="mt-12">
        <h3 className="text-center text-2xl font-bold">Lost Items Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <SummaryCard 
            icon={<FaTachometerAlt />} 
            text="Found Items" 
            number={foundLostItems} 
            color="bg-green-600" 
          />
          <SummaryCard 
            icon={<FaTachometerAlt />} 
            text="Returned Items" 
            number={returnedLostItems} 
            color="bg-yellow-600" 
          />
        </div>
      </div>
    </div>
  );
};

export default InventorySummary;