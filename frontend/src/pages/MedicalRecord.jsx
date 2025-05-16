import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";

function MedicalRecord() {
  const { id } = useParams();
  const { user } = useUser();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const reportRef = useRef();

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/api/medical-reports/medical-reports/${id}`
        );
        if (!response.ok) throw new Error("Failed to fetch record");
        const data = await response.json();
        setRecord(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRecord();
  }, [id]);

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/medical-reports/medical-reports/${id}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error("Failed to delete record");
      handleDashboard();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDashboard = () => {
    switch (user?.type) {
      case "patient":
        navigate("/patient-dashboard");
        break;
      case "doctor":
        navigate("/doctor-dashboard");
        break;
      case "admin":
        navigate("/admin-dashboard");
        break;
      default:
        navigate("/");
    }
  };

  const handleGenerateReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Medical Record Report", 14, 22);
    doc.setFontSize(12);
    doc.setTextColor(100);

    const tableColumn = ["Label", "Value"];
    const tableRows = [
      ["Patient Name", record?.PatientID?.name],
      ["Doctor Name", record?.DoctorID?.name],
      ["Date Created", new Date(record?.DateCreated).toLocaleDateString()],
      ["Last Updated", new Date(record?.LastUpdated).toLocaleDateString()],
      ["Diagnoses", record?.Diagnoses?.join(", ")],
      ["Treatments", record?.Treatments?.join(", ")],
      ["Prescriptions", record?.Prescriptions?.join(", ")],
      ["Test Results", record?.TestResults?.join(", ")],
      ["Notes", record?.Notes],
    ];

    try {
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 30,
        theme: "striped",
      });
      doc.save(`medical_report_${record?.PatientID?.name}.pdf`);
    } catch (error) {
      console.error("Error generating the table:", error);
    }
  };

  if (loading)
    return (
      <div className="text-center py-8 text-emerald-400">
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="text-center py-8 text-red-500">
        Error: {error}
      </div>
    );

  if (!record)
    return (
      <div className="text-center py-8 text-gray-400">
        No record found.
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-300 text-gray-200 p-6">
      <div
        ref={reportRef}
        className="bg-white border border-gray-300 p-8 rounded-xl"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-800">
          Medical Record Details
        </h2>

        <div className="divide-y divide-gray-700">
          <Detail label="Patient Name" value={record.PatientID?.name || 'Unknown'} />
          <Detail label="Doctor Name" value={record.DoctorID?.name || 'Unknown'} />
          <Detail
            label="Date Created"
            value={new Date(record.DateCreated).toLocaleDateString()}
          />
          <Detail
            label="Last Updated"
            value={new Date(record.LastUpdated).toLocaleDateString()}
          />
          <Detail label="Diagnoses" value={record.Diagnoses.join(", ")} />
          <Detail label="Treatments" value={record.Treatments.join(", ")} />
          <Detail label="Prescriptions" value={record.Prescriptions.join(", ")} />
          <Detail label="Test Results" value={record.TestResults.join(", ")} />
          <Detail label="Notes" value={record.Notes} />
        </div>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        {(user?.type === "admin" || user?.type === "doctor") && (
          <>
            <button
              onClick={() => navigate(`/medical-report/edit/${record._id}`)}
              className="bg-amber-500 hover:bg-amber-600 text-white font-medium px-6 py-2 rounded-lg transition-colors"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-2 rounded-lg transition-colors"
            >
              Delete
            </button>
          </>
        )}
        <button
          onClick={handleGenerateReport}
          className="bg-blue-800 hover:bg-blue-600 text-white font-medium px-6 py-2 rounded-lg transition-colors"
        >
          Generate Report
        </button>
        <button
          onClick={handleDashboard}
          className="bg-blue-800 hover:bg-blue-600 text-white font-medium px-6 py-2 rounded-lg transition-colors"
        >
          Dashboard
        </button>
      </div>
    </div>
  );
}

// Moved Detail component outside of MedicalRecord component
function Detail({ label, value }) {
  return (
    <div className="py-4">
      <h3 className="text-lg font-semibold text-blue-500">
        {label}:
      </h3>
      <p className="text-gray-500">{value}</p>
    </div>
  );
}

export default MedicalRecord;