import express from "express";
import AppointmentModel from "../Models/Appointment.js";
import cors from 'cors';
import jwt from 'jsonwebtoken';
import PDFDocument from 'pdfkit';


const router = express.Router();
router.use(cors());

const JWT_SECRET = 'jiggujigurailkilambuthupaar';


const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      success: false,
      message: 'Authentication token required' 
    });
  }

  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

router.post("/Appointment", authenticateUser, async (req, res) => {
    const { title, name, email, mobile, nic, area, gender, date, time, requirements } = req.body;
    const requiredFields = ['title', 'name', 'email', 'mobile', 'nic', 'area', 'gender', 'date', 'time'];
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
        return res.status(400).json({ 
            success: false,
            message: `Missing required fields: ${missingFields.join(', ')}`
        });
    }

    try {
        const appointment = new AppointmentModel({
            userId: req.userId, // Get from authenticated user
            title,
            name,
            email,
            mobile,
            nic,
            area, 
            gender,
            date,
            time,
            status: 'pending', // Default status
            requirements: requirements || ""
        });

        await appointment.save();

        res.status(201).json({
            success: true,
            message: "Appointment booked successfully!",
            appointmentId: appointment._id
        });

    } catch (err) {
        console.error("Appointment processing error:", err);
        const statusCode = err.name === 'ValidationError' ? 400 : 500;
        res.status(statusCode).json({
            success: false,
            message: err.message || "Error processing appointment"
        });
    }
});

/// Get all appointments for admin
router.get("/appointments", authenticateUser, async (req, res) => {
    try {
      const appointments = await AppointmentModel.find({});
      res.json({ 
        success: true, 
        count: appointments.length,
        appointments 
      });
    } catch (err) {
      console.error("Error fetching all appointments:", err);
      res.status(500).json({ 
        success: false, 
        message: "Error fetching bookings",
        error: err.message 
      });
    }
});

// Get appointments for specific user
router.get("/appointments/user/:userId", authenticateUser, async (req, res) => {
    try {
      console.log(`Fetching appointments for user ${req.params.userId} (authenticated as ${req.userId})`);
      
      if (req.params.userId !== req.userId) {
        return res.status(403).json({ 
          success: false, 
          message: "Unauthorized access" 
        });
      }

      const appointments = await AppointmentModel.find({ userId: req.params.userId })
        .sort({ date: -1, time: -1 });

      console.log(`Found ${appointments.length} appointments`);
      res.json({ 
        success: true,
        count: appointments.length,
        appointments 
      });
    } catch (err) {
      console.error("Error fetching user appointments:", err);
      res.status(500).json({ 
        success: false, 
        message: "Error fetching appointments",
        error: err.message 
      });
    }
});

// Get single appointment
router.get("/appointments/:id", authenticateUser, async (req, res) => {
    try {
      const appointment = await AppointmentModel.findById(req.params.id);
      
      if (!appointment) {
        return res.status(404).json({ 
          success: false, 
          message: "Appointment not found" 
        });
      }

      if (appointment.userId !== req.userId) {
        return res.status(403).json({ 
          success: false, 
          message: "Unauthorized access" 
        });
      }

      res.json({ 
        success: true, 
        appointment 
      });
    } catch (err) {
      console.error("Error fetching appointment:", err);
      res.status(500).json({ 
        success: false, 
        message: "Error fetching appointment",
        error: err.message 
      });
    }
});

// Delete appointment
router.delete("/appointments/:id", authenticateUser, async (req, res) => {
    try {
      const appointment = await AppointmentModel.findOneAndDelete({
        _id: req.params.id,
        userId: req.userId
      });

      if (!appointment) {
        return res.status(404).json({ 
          success: false, 
          message: "Appointment not found or unauthorized" 
        });
      }

      res.json({ 
        success: true, 
        message: "Appointment deleted successfully" 
      });
    } catch (err) {
      console.error("Error deleting appointment:", err);
      res.status(500).json({ 
        success: false, 
        message: "Error deleting appointment",
        error: err.message 
      });
    }
});

// Update appointment
router.put("/appointments/:id", authenticateUser, async (req, res) => {
    try {
      const { title, email, mobile, nic, area, gender, date, time, status, requirements } = req.body;

      const appointment = await AppointmentModel.findOneAndUpdate(
        { _id: req.params.id, userId: req.userId },
        { title, email, mobile, nic, area, gender, date, time, status, requirements },
        { new: true, runValidators: true }
      );

      if (!appointment) {
        return res.status(404).json({ 
          success: false, 
          message: "Appointment not found or unauthorized" 
        });
      }

      res.json({ 
        success: true, 
        message: "Appointment updated successfully",
        appointment 
      });
    } catch (err) {
      console.error("Error updating appointment:", err);
      res.status(500).json({ 
        success: false, 
        message: "Error updating appointment",
        error: err.message 
      });
    }
});

// Generate PDF
router.get("/appointments/pdf/:id", authenticateUser, async (req, res) => {
    try {
      const appointment = await AppointmentModel.findOne({
        _id: req.params.id,
        userId: req.userId
      });

      if (!appointment) {
        return res.status(404).json({ 
          success: false, 
          message: "Appointment not found" 
        });
      }

      const doc = new PDFDocument();
      const filename = `Appointment-${appointment._id}.pdf`;
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      
      doc.pipe(res);
      
      // PDF styling
      doc.font('Helvetica-Bold')
         .fontSize(20)
         .text('Appointment Details', { align: 'center' })
         .moveDown(1);
      
      doc.font('Helvetica')
         .fontSize(14);
      
      // Appointment details
      doc.text(`Title: ${appointment.title}`);
      doc.text(`Name: ${appointment.name}`);
      doc.text(`Email: ${appointment.email}`);
      doc.text(`Phone: ${appointment.mobile}`);
      doc.text(`NIC: ${appointment.nic}`);
      doc.text(`Address: ${appointment.area}`);
      doc.text(`Gender: ${appointment.gender}`);
      doc.text(`Date: ${new Date(appointment.date).toLocaleDateString()}`);
      doc.text(`Time: ${appointment.time}`);
      doc.text(`Status: ${appointment.status}`);
      doc.text(`Requirements: ${appointment.requirements || 'None'}`);
      
      doc.end();
    } catch (err) {
      console.error("Error generating PDF:", err);
      res.status(500).json({ 
        success: false, 
        message: "Error generating PDF",
        error: err.message 
      });
    }
});



export default router;