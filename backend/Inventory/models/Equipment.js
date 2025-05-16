import mongoose from "mongoose";

const equipmentSchema = new mongoose.Schema({
  equipmentName: { type: String, required: true },
  equipmentId: { type: String, required: true },
  department: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Equipment = mongoose.model("Equipment", equipmentSchema);
export default Equipment;