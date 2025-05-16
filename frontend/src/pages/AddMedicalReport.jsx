// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useUser } from "../context/UserContext";

// const AddMedicalReport = () => {
//   const { user } = useUser();
//   const [patients, setPatients] = useState([]);
//   const [doctors, setDoctors] = useState([]);
//   const [formData, setFormData] = useState({
//     PatientID: "",
//     DoctorID: "",
//     Diagnoses: [],
//     Treatments: [],
//     Prescriptions: [],
//     TestResults: [],
//     Notes: "",
//   });
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const patientsResponse = await fetch("http://localhost:4000/api/medical-reports/users/patient");
//         if (!patientsResponse.ok) throw new Error("Failed to fetch patients");
//         const patientsData = await patientsResponse.json();
//         setPatients(patientsData.users || []);

//         const doctorsResponse = await fetch("http://localhost:4000/api/medical-reports/users/doctor");
//         if (!doctorsResponse.ok) throw new Error("Failed to fetch doctors");
//         const doctorsData = await doctorsResponse.json();
//         setDoctors(doctorsData.users || []);
//       } catch (err) {
//         setError(err.message);
//       }
//     };

//     fetchUsers();
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);

//     try {
//       const response = await fetch("http://localhost:4000/api/medical-reports/medical-reports", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       if (!response.ok) throw new Error("Failed to create medical report");

//       const data = await response.json();
//       if (user.type === "admin") navigate("/admin-dashboard");
//       else if (user.type === "doctor") navigate("/doctor-dashboard");
//       else navigate("/");
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   if (error) {
//     return <div className="text-center py-4 text-red-400">Error: {error}</div>;
//   }

//   if (patients.length === 0 || doctors.length === 0) {
//     return <div className="text-center py-4 text-emerald-300">Fetching data...</div>;
//   }

//   return (
//     <div className="min-h-screen bg-gray-900 text-white p-6">
//       <div className="max-w-4xl mx-auto bg-gray-800 p-8 rounded-2xl shadow-lg">
//         <h2 className="text-3xl font-bold text-center text-emerald-400 mb-6">➕ Add Medical Report</h2>
//         <form onSubmit={handleSubmit} className="space-y-5">
//           {/* Select Fields */}
//           <SelectField label="Patient" name="PatientID" value={formData.PatientID} onChange={handleInputChange} options={patients} />
//           <SelectField label="Doctor" name="DoctorID" value={formData.DoctorID} onChange={handleInputChange} options={doctors} />

//           {/* Text Input Fields */}
//           <TextArrayInput label="Diagnoses" name="Diagnoses" value={formData.Diagnoses} setFormData={setFormData} formData={formData} />
//           <TextArrayInput label="Treatments" name="Treatments" value={formData.Treatments} setFormData={setFormData} formData={formData} />
//           <TextArrayInput label="Prescriptions" name="Prescriptions" value={formData.Prescriptions} setFormData={setFormData} formData={formData} />
//           <TextArrayInput label="Test Results" name="TestResults" value={formData.TestResults} setFormData={setFormData} formData={formData} />

//           {/* Notes */}
//           <div>
//             <label className="block text-sm font-semibold text-emerald-300">Notes:</label>
//             <textarea
//               name="Notes"
//               value={formData.Notes}
//               onChange={handleInputChange}
//               className="mt-1 w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-emerald-500"
//               placeholder="Enter additional notes"
//             />
//           </div>

//           {/* Submit */}
//           <button
//             type="submit"
//             className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400"
//           >
//             Create Medical Report
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// // Reusable Components
// const SelectField = ({ label, name, value, onChange, options }) => (
//   <div>
//     <label className="block text-sm font-semibold text-emerald-300">{label}:</label>
//     <select
//       name={name}
//       value={value}
//       onChange={onChange}
//       className="mt-1 w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-emerald-500"
//       required
//     >
//       <option value="">Select {label.toLowerCase()}</option>
//       {options.map((opt) => (
//         <option key={opt._id} value={opt._id}>
//           {opt.name}
//         </option>
//       ))}
//     </select>
//   </div>
// );

// const TextArrayInput = ({ label, name, value, formData, setFormData }) => (
//   <div>
//     <label className="block text-sm font-semibold text-emerald-300">{label}:</label>
//     <input
//       type="text"
//       name={name}
//       value={value.join(", ")}
//       onChange={(e) =>
//         setFormData({
//           ...formData,
//           [name]: e.target.value.split(",").map((item) => item.trim()),
//         })
//       }
//       className="mt-1 w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-emerald-500"
//       placeholder={`Enter ${label.toLowerCase()} separated by commas`}
//       required
//     />
//   </div>
// );

// export default AddMedicalReport;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const AddMedicalReport = () => {
  const { user } = useUser();
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    PatientID: "",
    DoctorID: "",
    Diagnoses: [],
    Treatments: [],
    Prescriptions: [],
    TestResults: [],
    Notes: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const patientsResponse = await fetch("http://localhost:4000/api/medical-reports/users/patient");
        if (!patientsResponse.ok) throw new Error("Failed to fetch patients");
        const patientsData = await patientsResponse.json();
        setPatients(patientsData.users || []);

        const doctorsResponse = await fetch("http://localhost:4000/api/medical-reports/users/doctor");
        if (!doctorsResponse.ok) throw new Error("Failed to fetch doctors");
        const doctorsData = await doctorsResponse.json();
        setDoctors(doctorsData.users || []);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("http://localhost:4000/api/medical-reports/medical-reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to create medical report");

      const data = await response.json();
      if (user.type === "admin") navigate("/admin-dashboard");
      else if (user.type === "doctor") navigate("/doctor-dashboard");
      else navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) {
    return <div className="text-center py-8 text-red-500 bg-white rounded-lg shadow-md mx-auto max-w-md p-4">Error: {error}</div>;
  }

  if (patients.length === 0 || doctors.length === 0) {
    return <div className="text-center py-8 text-blue-800">Loading patient and doctor data...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-200 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-blue-800 p-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center">Add Medical Report</h2>
        </div>
        
        <div className="p-6 md:p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Select Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SelectField 
                label="Patient" 
                name="PatientID" 
                value={formData.PatientID} 
                onChange={handleInputChange} 
                options={patients} 
              />
              <SelectField 
                label="Doctor" 
                name="DoctorID" 
                value={formData.DoctorID} 
                onChange={handleInputChange} 
                options={doctors} 
              />
            </div>

            {/* Text Input Fields */}
            <div className="space-y-6">
              <TextArrayInput 
                label="Diagnoses" 
                name="Diagnoses" 
                value={formData.Diagnoses} 
                setFormData={setFormData} 
                formData={formData} 
                placeholder="e.g. Diabetes, Hypertension"
              />
              <TextArrayInput 
                label="Treatments" 
                name="Treatments" 
                value={formData.Treatments} 
                setFormData={setFormData} 
                formData={formData} 
                placeholder="e.g. Physical therapy, Medication"
              />
              <TextArrayInput 
                label="Prescriptions" 
                name="Prescriptions" 
                value={formData.Prescriptions} 
                setFormData={setFormData} 
                formData={formData} 
                placeholder="e.g. Metformin 500mg, Lisinopril 10mg"
              />
              <TextArrayInput 
                label="Test Results" 
                name="TestResults" 
                value={formData.TestResults} 
                setFormData={setFormData} 
                formData={formData} 
                placeholder="e.g. HbA1c: 6.5%, LDL: 100 mg/dL"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Clinical Notes</label>
              <textarea
                name="Notes"
                value={formData.Notes}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter detailed clinical notes..."
                rows={4}
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-blue-800 hover:bg-blue-600 text-white py-3 px-4 rounded-md font-medium text-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Save Medical Report
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Reusable Components
const SelectField = ({ label, name, value, onChange, options }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
      required
    >
      <option value="">Select {label.toLowerCase()}</option>
      {options.map((opt) => (
        <option key={opt._id} value={opt._id}>
          {opt.name}
        </option>
      ))}
    </select>
  </div>
);

const TextArrayInput = ({ label, name, value, formData, setFormData, placeholder }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type="text"
      name={name}
      value={value.join(", ")}
      onChange={(e) =>
        setFormData({
          ...formData,
          [name]: e.target.value.split(",").map((item) => item.trim()),
        })
      }
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
      placeholder={placeholder}
      required
    />
    <p className="mt-1 text-xs text-gray-500">Separate multiple items with commas</p>
  </div>
);

export default AddMedicalReport;