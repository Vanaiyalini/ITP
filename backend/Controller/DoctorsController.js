import express from 'express';
import jwt from 'jsonwebtoken';
import ScheduleModel from '../Models/Doctor.js';
import cors from 'cors';

const router = express.Router();
router.use(cors());

// IMPORTANT: Use the same secret key as your login route
const JWT_SECRET = 'jiggujigurailkilambuthupaar'; // Must match your login controller

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
        return res.status(401).json({ 
            success: false,
            message: 'Authorization header missing' 
        });
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ 
            success: false,
            message: 'No token provided' 
        });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error('JWT verification failed:', err);
            return res.status(403).json({
                success: false,
                message: 'Invalid or expired token',
                error: err.message
            });
        }
        
        // Make sure the decoded token contains the expected fields
        if (!decoded.userId && !decoded._id) {
            return res.status(403).json({
                success: false,
                message: 'Malformed token payload'
            });
        }

        req.user = {
            userId: decoded.userId || decoded._id
        };
        next();
    });
};

router.post("/Schedule", authenticateToken, async (req, res) => {
    try {
        console.log('Authenticated user:', req.user); // Debug log
        
        const { doctor, slotDate, start, specialOption } = req.body;
        const userId = req.user.userId; // Get from authenticated user

        if (!doctor || !slotDate || !start || !specialOption) {
            return res.status(400).json({ 
                success: false,
                message: "All fields are required" 
            });
        }

        const existingSlot = await ScheduleModel.findOne({
            doctor,
            slotDate,
            start
        });

        if (existingSlot) {
            return res.status(400).json({ 
                success: false,
                message: "This time slot is already booked"
            });
        }

        const newSlot = new ScheduleModel({
            userId,
            doctor,
            slotDate,
            start,
            specialOption,
            status: 'available'
        });

        await newSlot.save();
        
        res.status(201).json({ 
            success: true,
            message: "Slot added successfully",
            slot: newSlot
        });

    } catch (err) {
        console.error("Server error:", err);
        res.status(500).json({ 
            success: false,
            message: "Internal server error",
            error: err.message
        });
    }
});

router.get("/getslot", async (req, res) => {
    try {
        const { doctor, date } = req.query;
        
        let query = {};
        if (doctor) query.doctor = new RegExp(doctor, 'i');
        if (date) query.slotDate = date;

        const slots = await ScheduleModel.find(query);
        
        res.json({
            success: true,
            data: slots
        });
    } catch (err) {
        console.error("Error fetching slots:", err);
        res.status(500).json({ 
            success: false,
            message: "Error retrieving slots"
        });
    }
});

export default router;