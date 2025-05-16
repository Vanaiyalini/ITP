import React from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import AdminDetails from "../components/AdminDetails"; // Example child component

const AdminDashboardMedical = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleRecords = () => {
    navigate("/admin-records");
  };

  return (
    <div className="min-h-screen bg-gray-200 text-white p-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg mt-20">
        <h2 className="text-3xl font-bold text-center text-blue-800 mb-6">
          Admin Dashboard
        </h2>
        <p className="text-center text-black">Welcome, Admin {user?.name}!</p>

        <AdminDetails />
        <div className="flex justify-center w-full gap-4 mt-6">
          <button
            onClick={handleRecords}
            className="mt-4 bg-blue-800 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            See My Medical History
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardMedical;
