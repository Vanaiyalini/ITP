import React from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import DoctorDetails from "../components/DoctorDetails";

const DoctorDashboard = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleRecords = () => {
    navigate("/doctor-records");
  };

  return (
    <div className="min-h-screen bg-gray-200 p-6 text-white">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg mt-20">
        <h2 className="text-3xl font-bold text-blue-800 mb-4 text-center">
          Doctor Dashboard
        </h2>
        <p className="text-center text-black mb-6">
          Welcome, <span className="font-semibold text-black">Dr. {user?.name}</span>!
        </p>

        <div className="mb-6">
          <DoctorDetails />
        </div>

        <div className="flex justify-center w-full gap-6 mt-4">
          <button
            onClick={handleRecords}
            className="bg-blue-800 hover:bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg transition-all"
          >
            📄 View Medical Records
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-700 hover:bg-red-600 text-white font-semibold py-2 px-5 rounded-lg transition-all"
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
