import React from 'react';

export const SummaryCard = ({ icon, text, number, color }) => {
  return (
    <div className="rounded flex bg-white shadow-md overflow-hidden">
      <div className={`text-3xl flex justify-center items-center ${color} text-white px-4`}>
        {icon}
      </div>
      <div className="pl-3 py-2 flex-1">
        <p className="text-lg font-semibold text-gray-700 truncate">{text}</p>
        <p className="text-xl font-bold text-gray-900">{number}</p>
      </div>
    </div>
  );
};

export default SummaryCard;