import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    type: String,
    password: String,
 
    
  
});



const UserModel = mongoose.model("mgtusers", UserSchema);

export default UserModel;
