import express from "express";
import cors from 'cors';
import PaymentModel from "../Models/Payment.js";
const router = express.Router();
router.use(cors());



router.post("/Payment", async (req, res) => {
    const { userId, user, email, Contactno, BookRef, payRef, cnum, type, cmonth, cyear, cvv } = req.body;
    


    if (!userId || !user || !email || !Contactno || !BookRef || !payRef || !cnum || !type || !cmonth || !cyear || !cvv) {
        return res.status(400).json({ 
            success: false,
            message: "Missing required fields" 
        });
    }

    try {
        const payment = new PaymentModel({
            userId,
            user,
            email,
            Contactno,
            BookRef,
            payRef,
            cnum, 
            type,
            cmonth,
            cyear,
            cvv, 
        });

        await payment.save();


        res.status(201).json({
            success: true,
            message: "Payment processed successfully!",
            paymentId: payment._id,
            cardType: type,
            
        });

    } catch (err) {
        console.error("Payment processing error:", err);
        
        const statusCode = err.name === 'ValidationError' ? 400 : 500;
        
        res.status(statusCode).json({
            success: false,
            message: "Error processing payment",
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});


router.get("/getpayments/user/:userId", async (req, res) => {
    try {
      
        const payments = await PaymentModel.find({ userId: req.params.userId });
        
        res.json({
            success: true,
            payments: payments,
            count: payments.length
        });

    } catch (err) {
        console.error("Error getting payments:", err);
        res.status(500).json({
            success: false,
            message: "Failed to get payments"
        });
    }
});


router.get("/getpayments", async (req, res) => {
    try {
        const payment = await PaymentModel.find({});
        res.json(payment);
    } catch (err) {
        res.status(500).json({ message: "Error slots", error: err });
    }
});


router.get("/getpayments/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const payment = await PaymentModel.findById(id);
        if (!payment) {
            return res.status(404).json({ message: "Details  Not available" });
        }
        res.json(payment);
    } catch (err) {
        res.status(500).json({ message: "Error  ", error: err });
    }
});


router.delete("/deletepayments/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const deletePay = await PaymentModel.findByIdAndDelete(id);
        if (!deletePay) {
            return res.status(404).json({ message: " not found" });
        }
        res.json({ message: "Stock details deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting ", error: err });
    }
});

router.put("/updatepay/:id", async (req, res) => {
    const id = req.params.id;
    const  { user, email, Contactno,BookRef, payRef,cnum,type,cmonth,cyear,cvv} = req.body;

    try {
        const updatepay = await PaymentModel.findByIdAndUpdate(
            id, 
            { user, email, Contactno,BookRef, payRef,cnum,type,cmonth,cyear,cvv} , 
            { new: true } 
        );
        if (!updatepay) {
            return res.status(404).json({ message: " not found" });
        }
        res.json(updatepay);
    } catch (err) {
        res.status(500).json({ message: "Error updating ", error: err });
    }
});

export default router;
