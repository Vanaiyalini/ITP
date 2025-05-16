import React from 'react';
import Sidebar from '../Inventory/components/sidebar';
import InventorySummary from '../Inventory/components/InventorySummary';
import { Outlet } from 'react-router-dom';

const InventoryDashboard = () => {
  return (
    <>
    
    <div className='flex'>
      <Sidebar />
      <div className='flex-1 ml-64 bg-gray-100 h-screen'>
        
        <Outlet/>
              </div>
    </div></>
  );
};

export default InventoryDashboard;