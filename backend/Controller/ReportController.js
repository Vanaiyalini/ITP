import express from 'express';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../Models/User.js';
import Appointment from '../Models/Appointment.js';
import Payment from '../Models/Payment.js';
import Contact from '../Models/Contact.js';
import { authenticateUser } from './UserController.js';

const router = express.Router();

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../public/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

router.post('/generate-detailed-report', authenticateUser, async (req, res) => {
  try {
    const { userData, appointmentData, paymentData, contactData } = req.body;

    // Create a new PDF document
    const doc = new PDFDocument();
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=User-Report-${userData._id}.pdf`);

    // Pipe the PDF to the response
    doc.pipe(res);

    // Add content to the PDF
    doc.fontSize(20).text('User Report', { align: 'center' });
    doc.moveDown();

    // User Information
    doc.fontSize(16).text('User Information');
    doc.fontSize(12).text(`Name: ${userData.name}`);
    doc.text(`Email: ${userData.email}`);
    doc.text(`Type: ${userData.type}`);
    doc.text(`Birth Date: ${userData.birthDate ? new Date(userData.birthDate).toLocaleDateString() : 'Not set'}`);
    doc.text(`NIC Number: ${userData.nic || 'Not set'}`);
    doc.text(`Address: ${userData.address || 'Not set'}`);
    doc.moveDown();

    // Appointments
    if (appointmentData && appointmentData.length > 0) {
      doc.fontSize(16).text('Appointments');
      appointmentData.forEach(appointment => {
        doc.fontSize(12).text(`Date: ${new Date(appointment.date).toLocaleDateString()}`);
        doc.text(`Doctor: ${appointment.doctorName}`);
        doc.text(`Status: ${appointment.status}`);
        doc.moveDown(0.5);
      });
      doc.moveDown();
    }

    // Payments
    if (paymentData && paymentData.length > 0) {
      doc.fontSize(16).text('Payment History');
      paymentData.forEach(payment => {
        doc.fontSize(12).text(`Date: ${new Date(payment.date).toLocaleDateString()}`);
        doc.text(`Amount: $${payment.amount}`);
        doc.text(`Status: ${payment.status}`);
        doc.moveDown(0.5);
      });
      doc.moveDown();
    }

    // Contact Messages
    if (contactData && contactData.length > 0) {
      doc.fontSize(16).text('Contact Messages');
      contactData.forEach(message => {
        doc.fontSize(12).text(`Date: ${new Date(message.createdAt).toLocaleDateString()}`);
        doc.text(`Type: ${message.type || 'General'}`);
        doc.text(`Subject: ${message.msg || 'No subject'}`);
        doc.text(`Status: ${message.status || 'Pending'}`);
        doc.moveDown(0.5);
      });
      doc.moveDown();
    }

    // Finalize the PDF
    doc.end();
  } catch (error) {
    console.error('Report generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating report'
    });
  }
});

export default router; 