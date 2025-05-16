import React from 'react'
import appointmentimg from '../assets/appointment_img.png'

const banner = () => {
  return (
    <div className='bg-blue-800 flex flex-col-reverse lg:flex-row bg-primary rounded-lg px-6 sm:px-10 md:px-14 lg:px-12 my-20 w-[1300px] mx-auto'>
    
                <div className='flex-1 py-8 sm:py-10 md:py-16 lg:py-24 lg:pl-5'>
                    <div className='text-xl sm:text-2xl md:text-3xl lg:text-5xl font-semibold text-white'>
                        <p>Book Appointment</p>
                        <p className='mt-4'>With 100+ Trusted Doctors</p>
                    </div>
                    <button  className='bg-white text-sm sm:text-base text-[#595959] px-8 py-3 rounded-full mt-6 hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-[#595959]'>
                        Create account
                    </button>
                </div>
    
                <div className='hidden md:block md:w-1/2 lg:w-[370px] relative'>
                    <img className='w-full absolute bottom-0 right-0 max-w-md' src={appointmentimg} alt="Appointment" />
                </div>
            </div>
  )
}

export default banner