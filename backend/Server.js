import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv"; 
import PaymentOperations from './Controller/PaymentOperations.js';
import ContactusOperations from './Controller/ContactusOperations.js';
import UserController from './Controller/UserController.js';
import ReportController from './Controller/ReportController.js';

import departmentRouter from './Inventory/routes/department.js';
import medicineRouter from './Inventory/routes/medicine.js';
import equipmentRouter from './Inventory/routes/equipmentRoutes.js';
import lostItemRoutes from './Inventory/routes/lost.js';

import DoctorsController from './Controller/DoctorsController.js'
import Appointmentcontroller from './Controller/Appointmentcontroller.js'
import MedicalReportRoutes from './routes/MedicalReportRoutes.js'

dotenv.config();
const app = express();

app.use('/uploads', express.static('public/uploads'));

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.options('*', cors());
app.use(express.json()); 

app.use("/PaymentOperations", PaymentOperations);
app.use("/ContactusOperations", ContactusOperations);
app.use("/UserController", UserController);
app.use("/DoctorsController", DoctorsController);
app.use("/Appointmentcontroller", Appointmentcontroller);
app.use("/ReportController", ReportController);

app.use('/api/department', departmentRouter);
app.use('/api/medicine', medicineRouter);
app.use('/api/equipment', equipmentRouter);
app.use('/api/lostitems', lostItemRoutes);




app.use("/api/medical-reports", MedicalReportRoutes);

mongoose.connect(process.env.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.log("MongoDB connection error:", err));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
