import mongoose from "mongoose";

const ScheduleSchema = new mongoose.Schema({

     userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "mgtusers",
            required: true
          },
    doctor: String,
    start: String,
    slotDate: String,
    specialOption: String,
  
});



const DoctorModel = mongoose.model("doctor", ScheduleSchema);

export default DoctorModel;
