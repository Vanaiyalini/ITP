import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const EditMedicalReport = () => {
  const { user } = useUser();
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    PatientID: "",
    DoctorID: "",
    Diagnoses: [],
    Treatments: [],
    Prescriptions: [],
    TestResults: [],
    Notes: "",
  });

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/medical-reports/medical-reports/${id}`);
        if (!response.ok) throw new Error("Failed to fetch medical report");
        const data = await response.json();
        
        setFormData({
          PatientID: data.PatientID?._id || "",
          DoctorID: data.DoctorID?._id || "",
          Diagnoses: data.Diagnoses || [],
          Treatments: data.Treatments || [],
          Prescriptions: data.Prescriptions || [],
          TestResults: data.TestResults || [],
          Notes: data.Notes || "",
        });
        
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const [patientRes, doctorRes] = await Promise.all([
          fetch("http://localhost:4000/api/medical-reports/users/patient"),
          fetch("http://localhost:4000/api/medical-reports/users/doctor"),
        ]);

        if (!patientRes.ok || !doctorRes.ok) throw new Error("Failed to fetch users");

        const patientsData = await patientRes.json();
        const doctorsData = await doctorRes.json();

        setPatients(patientsData.users || []);
        setDoctors(doctorsData.users || []);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCommaInput = (e, fieldName) => {
    const value = e.target.value
      .split(",")
      .map(str => str.trim())
      .filter(Boolean);
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:4000/api/medical-reports/medical-reports/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to update medical report");

      if (user.type === "admin") navigate("/admin-dashboard");
      else if (user.type === "doctor") navigate("/doctor-dashboard");
      else navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-4 text-emerald-300">Loading...</div>;
  if (error) return <div className="text-center py-4 text-red-400">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-300 text-white p-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-blue-800 mb-6">✏️ Edit Medical Report</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Patient */}
          <div>
            <label className="block text-sm font-semibold text-blue-300">Patient:</label>
            <select
              name="PatientID"
              value={formData.PatientID}
              onChange={handleInputChange}
              className="mt-1 w-full px-4 py-2 bg-gray-200 text-black border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select patient</option>
              {patients.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Doctor */}
          <div className="mt-4">
            <label className="block text-sm font-semibold text-blue-300">Doctor:</label>
            <select
              name="DoctorID"
              value={formData.DoctorID}
              onChange={handleInputChange}
              className="mt-1 w-full px-4 py-2 bg-gray-200 text-black border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select doctor</option>
              {doctors.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Comma-separated fields */}
          {["Diagnoses", "Treatments", "Prescriptions", "TestResults"].map((field) => (
            <div key={field} className="mt-4">
              <label className="block text-sm font-semibold text-blue-300">{field}:</label>
              <input
                type="text"
                name={field}
                value={formData[field].join(", ")}
                onChange={(e) => handleCommaInput(e, field)}
                className="mt-1 w-full px-4 py-2 bg-gray-200 text-black border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder={`Enter ${field.toLowerCase()} separated by commas`}
              />
            </div>
          ))}

          {/* Notes */}
          <div className="mt-4">
            <label className="block text-sm font-semibold text-blue-300">Notes:</label>
            <textarea
              name="Notes"
              value={formData.Notes}
              onChange={handleInputChange}
              className="mt-1 w-full px-4 py-2 bg-gray-200 text-black border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Enter any additional notes"
            />
          </div>

          {/* Submit */}
          <div className="mt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-800 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {loading ? "Updating..." : "Update Medical Report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMedicalReport;
