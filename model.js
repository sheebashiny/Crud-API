import mongoose from "mongoose";

const schemaName = mongoose.Schema({
    cname: String,
    email: String,
    Dob:Date,
    Age:Number,
    salary:Number,
    Did:Number,
    designation:String,
    pincode:Number,
    pancard:String,
    cstatus:Number,
    mobileNo:Number,
    AuthKey:String,
    username:String,
    oldpassword:String,
    password:String,
    confirmpassword:String,
    newpassword:String,
})

export default mongoose.model('customer', schemaName);