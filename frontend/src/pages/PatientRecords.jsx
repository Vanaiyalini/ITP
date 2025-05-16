import React from "react";
import ShowMedicalReports from "../components/ShowMedicalRecords";
import { useUser } from "../context/UserContext";

const PatientRecords = () => {
  const { user } = useUser(); // Access user details from context

  return (
    <div className="min-h-screen p-6 bg-gray-200">
      <div
        className="max-w-5xl mx-auto rounded-2xl p-8 bg-white mt-20"
      >
       
        <ShowMedicalReports
          fetchUrl={`http://localhost:4000/api/medical-reports/medical-report/patient/${user._id}`}
        />
      </div>
    </div>
  );
};

export default PatientRecords;
