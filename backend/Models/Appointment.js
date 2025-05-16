import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "mgtusers",
    required: true
  },
  title: {
    type: String,
    enum: ['Mr', 'Mrs', 'Miss'],
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  mobile: {
    type: String,
    required: true
  },
  nic: {
    type: String,
    required: true
  },
  area: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  requirements: {
    type: String,
    default: ''
  }
}, { timestamps: true });

const AppointmentModel = mongoose.model('mgtAppointment', AppointmentSchema);

export default AppointmentModel;
