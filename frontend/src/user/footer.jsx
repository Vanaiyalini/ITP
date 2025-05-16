import React from 'react'
import logo from '../assets/logo.svg';

const footer = () => {
  return (
    <div className='md:mx-10'>
          <div className='flex flex-col sm:grid sm:grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
            
            <div className='flex flex-col items-start'>
              <img className='mb-5 w-40' src={logo} alt="Logo" />
              <p className='w-full md:w-2/3 text-gray-600 leading-6'>
              Evergreen Hospital, Jaffna is a leading private healthcare institution committed to providing quality and affordable medical services. Equipped with modern facilities and a dedicated team of professionals, the hospital offers a range of services including general medicine, surgery, maternity care, pediatrics, emergency services, and diagnostic facilities. It serves as a trusted healthcare provider in the Northern region of Sri Lanka.
              </p>
            </div>
    
            <div className='flex flex-col'>
              <p className='text-xl font-medium mb-5'>COMPANY</p>
              <ul className='flex flex-col gap-2 text-gray-600'>
                <li>Home</li>
                <li>About us</li>
                <li>Delivery</li>
                <li>Privacy policy</li>
              </ul>
            </div>
    
            <div className='flex flex-col'>
              <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
              <ul className='flex flex-col gap-2 text-gray-600'>
                <li>0213453890</li>
                <li>Evergreen@gmail.com</li>
              </ul>
            </div>
          </div>
    
          <div className='mt-10'>
            <hr className='border-gray-300' />
            <p className='py-5 text-sm text-center text-gray-500'>
              Copyright 2024 @ Ever Green.com - All Rights Reserved.
            </p>
          </div>
        </div>
  )
}

export default footer