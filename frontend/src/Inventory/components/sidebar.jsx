import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaTachometerAlt, FaCalendarAlt, FaCogs, FaUsers } from 'react-icons/fa';

const Sidebar = () => {
  return (
    <div className="text-black h-screen fixed left-0 top-0 bottom-0 space-y-2 w-64 bg-white">
      
      <div className="bg-blue-800 h-12 flex items-center justify-center">
        <h3 className="text-2xl text-center font-pacific text-white">Inventory</h3>
      </div>
      <div>
        <NavLink
          to="/InventoryDashboard"
          className={({ isActive }) =>
            `${isActive ? "bg-blue-400 text-white" : "text-black hover:bg-blue-200"} flex items-center space-x-4 block py-2.5 px-4 rounded`
          }
          end
        >
          <FaTachometerAlt />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/InventoryDashboard/equipments"
          className={({ isActive }) =>
            `${isActive ? "bg-blue-400 text-white" : "text-black hover:bg-blue-200"} flex items-center space-x-4 block py-2.5 px-4 rounded`
          }
        >
          <FaCalendarAlt />
          <span>Equipments</span>
        </NavLink>

        <NavLink
          to="/InventoryDashboard/medicine"
          className={({ isActive }) =>
            `${isActive ? "bg-blue-400 text-white" : "text-black hover:bg-blue-200"} flex items-center space-x-4 block py-2.5 px-4 rounded`
          }
        >
          <FaCogs />
          <span>Medicine</span>
        </NavLink>

        <NavLink
          to="/InventoryDashboard/department"
          className={({ isActive }) =>
            `${isActive ? "bg-blue-400 text-white" : "text-black hover:bg-blue-200"} flex items-center space-x-4 block py-2.5 px-4 rounded`
          }
        >
          <FaUsers />
          <span>Department</span>
        </NavLink>


        <NavLink
  to="/InventoryDashboard/lostitems"
  className={({ isActive }) =>
    `${isActive ? "bg-blue-400 text-white" : "text-black hover:bg-blue-200"} flex items-center space-x-4 block py-2.5 px-4 rounded`
  }
>
  <FaCogs />
  <span>Lost Items</span>
</NavLink>
      </div>
    </div>
  );
};

export default Sidebar;