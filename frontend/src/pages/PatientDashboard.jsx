import React from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import PatientDetails from "../components/PatientDetails";

const PatientDashboard = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleRecords = () => {
    navigate("/patient-records");
  };

  return (
    <div className="min-h-screen bg-gray-200 p-6 text-white">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-blue-800 mb-4 text-center">
          Patient Dashboard
        </h2>
        <p className="text-center text-black mb-6">
          Welcome, <span className="font-semibold text-black">{user?.name}</span>!
        </p>

        <div className="mb-6">
          <PatientDetails />
        </div>

        <div className="flex justify-center w-full gap-6 mt-4">
          <button
            onClick={handleRecords}
            className="bg-blue-800 hover:bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg transition-all"
          >
            📄 View Medical History
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-5 rounded-lg transition-all"
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
