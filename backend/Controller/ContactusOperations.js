import express from "express";
import cors from 'cors';
import ContactModel from "../Models/Contact.js";

const router = express.Router();
router.use(cors());

// Error response helper
const errorResponse = (res, status, message, error = null) => {
    return res.status(status).json({
        success: false,
        message,
        error: process.env.NODE_ENV === 'development' ? error?.message : undefined
    });
};

// POST - Create new message
router.post("/contact", async (req, res) => {
    const { userId, username, type, email, msg } = req.body;

    // Validate required fields
    const requiredFields = { userId, username, email, msg, type };
    for (const [field, value] of Object.entries(requiredFields)) {
        if (!value) {
            return errorResponse(res, 400, `Missing required field: ${field}`);
        }
    }

    try {
        const newMsg = new ContactModel({ userId, username, email, type, msg });
        await newMsg.save();

        return res.status(201).json({
            success: true,
            message: "Message submitted successfully!",
            data: {
                id: newMsg._id,
                username,
                email,
                type,
                msg
            }
        });

    } catch (err) {
        console.error("Message submission error:", err);
        const status = err.name === 'ValidationError' ? 400 : 500;
        return errorResponse(res, status, "Error processing message", err);
    }
});

// GET - All messages for a user
router.get("/getmsg/user/:userId", async (req, res) => {
    try {
        const messages = await ContactModel.find({ userId: req.params.userId })
            .sort({ createdAt: -1 }) // Newest first
            .lean();

        if (!messages.length) {
            return res.status(200).json({
                success: true,
                message: "No messages found for this user",
                data: [],
                count: 0
            });
        }

        return res.json({
            success: true,
            message: "Messages retrieved successfully",
            data: messages,
            count: messages.length
        });

    } catch (err) {
        console.error("Error getting messages:", err);
        return errorResponse(res, 500, "Failed to get messages", err);
    }
});

// GET - Single message by ID
router.get("/getmsg/:id", async (req, res) => {
    try {
        const message = await ContactModel.findById(req.params.id).lean();
        
        if (!message) {
            return errorResponse(res, 404, "Message not found");
        }

        return res.json({
            success: true,
            message: "Message retrieved successfully",
            data: message
        });

    } catch (err) {
        console.error("Error getting message:", err);
        return errorResponse(res, 500, "Error getting message", err);
    }
});

// PUT - Update message
router.put("/updatemsg/:id", async (req, res) => {
    const { id } = req.params;
    const { msg, type } = req.body; // Only allow updating these fields

    if (!msg || !type) {
        return errorResponse(res, 400, "Both 'msg' and 'type' are required");
    }

    try {
        const updatedMsg = await ContactModel.findByIdAndUpdate(
            id,
            { msg, type },
            { new: true, runValidators: true }
        ).lean();

        if (!updatedMsg) {
            return errorResponse(res, 404, "Message not found");
        }

        return res.json({
            success: true,
            message: "Message updated successfully",
            data: updatedMsg
        });

    } catch (err) {
        console.error("Error updating message:", err);
        return errorResponse(res, 500, "Error updating message", err);
    }
});

// DELETE - Remove message
router.delete("/deletemsg/:id", async (req, res) => {
    try {
        const deletedMsg = await ContactModel.findByIdAndDelete(req.params.id).lean();
        
        if (!deletedMsg) {
            return errorResponse(res, 404, "Message not found");
        }

        return res.json({
            success: true,
            message: "Message deleted successfully",
            data: { id: deletedMsg._id }
        });

    } catch (err) {
        console.error("Error deleting message:", err);
        return errorResponse(res, 500, "Error deleting message", err);
    }
});

// Add this to your backend routes
router.get("/getAllMessages", async (req, res) => {
    try {
        const messages = await ContactModel.find()
            .sort({ createdAt: -1 }) // Newest first
            .lean();

        return res.json({
            success: true,
            message: "All messages retrieved successfully",
            data: messages,
            count: messages.length
        });

    } catch (err) {
        console.error("Error getting all messages:", err);
        return errorResponse(res, 500, "Failed to get messages", err);
    }
});

export default router;