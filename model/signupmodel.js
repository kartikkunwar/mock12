const mongoose=require("mongoose");
mongoose.set(`strictQuery`,true);

const SignupSchema=mongoose.Schema({
    name:String,
    email:String,
    timestamp:String,
    password:String
})

const SignupModel=mongoose.model('mocktest',SignupSchema)

module.exports={SignupModel};