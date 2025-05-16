import express from 'express';
const router = express.Router();
import {
  createMedicalReport,
  getMedicalReports,
  getMedicalReportById,
  updateMedicalReport,
  deleteMedicalReport,
  getMedicalRecordsByPatientId,
  getMedicalRecordsByDoctorId,
  searchMedicalRecords,
  getUsersByRole,
} from '../Controller/MedicalReportController.js';



// CRUD routes for Medical Reports
router.post("/medical-reports", createMedicalReport);
router.get("/medical-reports", getMedicalReports);
router.get(
  "/medical-reports/:id",
  getMedicalReportById
);
router.put("/medical-reports/:id", updateMedicalReport);
router.delete(
  "/medical-reports/:id",
  deleteMedicalReport
);

// Additional routes
router.get(
  "/medical-report/patient/:patientId",
  getMedicalRecordsByPatientId
); // Get records by Patient ID
router.get(
  "/medical-report/doctor/:doctorId",
  getMedicalRecordsByDoctorId
); // Get records by Doctor ID
router.get(
  "/medical-report/search",
  searchMedicalRecords
); // Search medical records


// Get all users by role
router.get("/users/:type", getUsersByRole);

export default router;
