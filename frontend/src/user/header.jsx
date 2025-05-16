import React from 'react';
import Headerimg from '../assets/header_img.png';
import groupimg from '../assets/group_profiles.png';
import arrowicon from '../assets/arrow_icon.svg';

const header = () => {
  return (
    <div className="bg-blue-800 rounded-lg px-6 md:px-10 lg:px-20 py-10 md:py-16 my-10 w-[1300px] mx-auto">
      <div className="flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 flex flex-col items-start justify-center gap-6">
          <h1 className="text-3xl md:text-4xl lg:text-5xl text-white font-bold leading-tight">
            Book Appointment <br className="hidden md:block" /> With Trusted Doctors
          </h1>
          
          <div className="flex flex-col md:flex-row items-center gap-4 text-white text-opacity-90">
            <img className="w-28" src={groupimg} alt="Group profiles" />
            <p className="text-sm md:text-base">
              Simply browse through our extensive list of trusted doctors,
              <br className="hidden sm:block" /> schedule your appointment hassle-free.
            </p>
          </div>
          
          <button className="flex items-center gap-2 bg-white text-blue-900 px-8 py-3 rounded-full font-medium hover:scale-105 transition-transform mt-6">
            Book appointment <img className="w-3" src={arrowicon} alt="Arrow icon" />
          </button>
        </div>

        <div className="md:w-1/2 mt-10 md:mt-0">
          <img 
            className="w-full h-auto rounded-lg" 
            src={Headerimg} 
            alt="Doctors team" 
          />
        </div>
      </div>
    </div>
  );
};

export default header;