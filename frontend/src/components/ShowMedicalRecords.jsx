import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const ShowMedicalReports = ({ fetchUrl }) => {
  const { user } = useUser(); // Access user details from context
  const [records, setRecords] = useState([]); // State to store medical records
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(null); // State to handle errors
  const navigate = useNavigate();

  // Fetch medical reports
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await fetch(fetchUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch records");
        }
        const data = await response.json();
        setRecords(data); // Set the fetched data
      } catch (err) {
        setError(err.message); // Set error message
      } finally {
        setLoading(false); // Set loading to false
      }
    };

    fetchRecords();
  }, [fetchUrl]); // Re-run effect when fetchUrl changes

  // Handle delete record
  const handleDelete = async (recordId) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/medical-reports/medical-reports/${recordId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete record");
      }
      // Remove the deleted record from the state
      setRecords(records.filter((record) => record._id !== recordId));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-4 text-emerald-400">
        Loading medical records...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4 text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-300 bg-opacity-50 transperent text-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-center text-blue-800 mb-6">
      🩺 Medical Reports
      </h2>

      {(user?.type === "admin" || user?.type === "doctor") && (
        <div className="mb-4 flex justify-center">
          <button
            onClick={() => navigate("/add-report")}
            className="bg-blue-400 text-white py-2 px-6 rounded-md hover:bg-blue-500 transition"
          >
            ➕ Add Report
          </button>
        </div>
      )}

      {records.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
            <thead>
              <tr className="bg-white text-black">
                <th className="py-3 px-4 border-b border-gray-700">Doctor Name</th>
                <th className="py-3 px-4 border-b border-gray-700">Patient Name</th>
                <th className="py-3 px-4 border-b border-gray-700">Diagnoses</th>
                <th className="py-3 px-4 border-b border-gray-700">Last Updated</th>
                <th className="py-3 px-4 border-b border-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record, index) => (
                <tr
                  key={record._id}
                  className={`${
                    index % 2 === 0 ? "bg-gray-300" : "bg-gray-400"
                  } hover:bg-gray-500 transition`}
                >
                  <td className="py-3 px-4 border-b border-gray-300 text-center text-black">
                  {record.DoctorID?.name || "Unknown Doctor"}

                  </td>
                  <td className="py-3 px-4 border-b border-gray-300 text-center text-black">
                  {record.PatientID?.name || "Unknown Patient"}

                  </td>
                  <td className="py-3 px-4 border-b border-gray-300 text-center text-black">
                    {record.Diagnoses.join(", ")}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-300 text-center text-black">
                    {new Date(record.LastUpdated).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-300 space-x-2 text-center text-black">
                    <button
                      onClick={() => navigate(`/medical-record/${record._id}`)}
                      className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600 transition"
                    >
                      Show
                    </button>
                    {(user?.type === "admin" || user?.type === "doctor") && (
                      <>
                        <button
                          onClick={() =>
                            navigate(`/medical-report/edit/${record._id}`)
                          }
                          className="bg-yellow-500 text-white py-1 px-3 rounded-md hover:bg-yellow-600 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(record._id)}
                          className="bg-red-600 text-white py-1 px-3 rounded-md hover:bg-red-700 transition"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-400 text-center mt-6">
          No medical records found.
        </p>
      )}
    </div>
  );
};

export default ShowMedicalReports;
