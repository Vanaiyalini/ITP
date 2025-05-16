import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema({
    userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "mgtusers",
                required: true
              },

    email: String,
    username: String,
    msg: String,
    type:String,
   
});



const ContactModel = mongoose.model("ContactUS", ContactSchema);

export default ContactModel;
