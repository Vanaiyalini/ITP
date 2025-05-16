import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema({
    med_name: { type: String, required: true }, // Medicine name (required)
    description: { type: String }, // Description of the medicine
    price: { type: Number, required: true }, // Price of the medicine (required)
    quantity: { type: Number, required: true }, // Quantity of the medicine (required)
    createdAt: { type: Date, default: Date.now }, // Timestamp for creation
    updatedAt: { type: Date, default: Date.now } // Timestamp for updates
});

// Middleware to update the `updatedAt` field before saving
medicineSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Create the Medicine model
const Medicine = mongoose.model("Medicine", medicineSchema);

export default Medicine;