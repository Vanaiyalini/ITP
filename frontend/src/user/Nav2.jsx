import React, { useEffect, useState } from 'react';
import logo from '../assets/logo.svg';
import { Link } from 'react-router-dom';

const Nav2 = () => {
  const [userType, setUserType] = useState('');

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData && userData.type) {
      setUserType(userData.type);
    }
  }, []);
  return (
    <>
        <div className="flex items-center justify-between px-4 py-3bg-gradient-to-tr from-blue-50 to-white p-4w-[1200px] mx-auto ">
      <img src={logo} alt="Ever Green Logo" className="h-20 w-20"/>

      <div className="hidden md:flex items-center space-x-8">
        <ul className="flex space-x-8">
            
          <li className="text-gray-700 hover:text-blue-800 font-medium cursor-pointer">HOME</li>
          <Link to='/availability'> <li className="text-gray-700 hover:text-blue-800 font-medium cursor-pointer">ALL DOCTORS</li></Link>
          {userType === 'patient' && (
        <Link to='/patient-records'>
          <li className="text-gray-700 hover:text-blue-800 font-medium cursor-pointer">
            PATIENT RECORDS
          </li>
        </Link>
      )}

      {userType === 'doctor' && (
        <Link to='/doctor-records'>
          <li className="text-gray-700 hover:text-blue-800 font-medium cursor-pointer">
            DOCTOR RECORDS
          </li>
        </Link>
      )}
          <Link to = '/AboutUsPage'>
          <li className="text-gray-700 hover:text-blue-800 font-medium cursor-pointer">ABOUT</li>
          </Link>
          <li className="text-gray-700 hover:text-blue-800 font-medium cursor-pointer">CONTACT</li>
            <Link to="/home" 
            className="bg-blue-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
               >Logout</Link>
                          
                        
        </ul>
      </div>
       
  
        
    </div>

    <div className='mt-0 w-[1200px] mx-auto  border-t border-gray-400 my-8'>

    </div>
    </>
    
  );
}

export default Nav2;