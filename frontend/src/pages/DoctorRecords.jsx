import React from "react";
import ShowMedicalReports from "../components/ShowMedicalRecords";
import { useUser } from "../context/UserContext";

function DoctorRecords() {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-gray-200 text-white p-6">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
       
        <ShowMedicalReports
          fetchUrl={`http://localhost:4000/api/medical-reports/medical-report/doctor/${user._id}`}
        />
      </div>
    </div>
  );
}

export default DoctorRecords;
