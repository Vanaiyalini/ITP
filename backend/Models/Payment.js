import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "mgtusers",
        required: true
    },
    user: { type: String },
    email: { type: String },
    Contactno: { type: String },
    BookRef: { type: String },
    payRef: { type: String },
    cnum: { type: String },
    type: { type: String },
    cmonth: { type: String },
    cyear: { type: String },
    cvv: { type: String }
    
}, { timestamps: true });  

const PaymentModel = mongoose.model("Mgtpayments", PaymentSchema);

export default PaymentModel;
