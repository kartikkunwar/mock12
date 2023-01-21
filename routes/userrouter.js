const express=require("express");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");

const {SignupModel}=require("../model/signupmodel")

const signupRouter=express.Router();

signupRouter.get("/",async(req,res)=>{
    try{
       const x=await SignupModel.find()
       res.send(x);
    }
    catch(err){
        console.log(err);
        res.send(err)
    }
})

signupRouter.post("/getprofile",async(req,res)=>{
    const {email}=req.body; 
    try{
       const x=await SignupModel.find({email})
       res.send(x);
    }
    catch(err){
        console.log(err);
        res.send("no user found")
    }
})

signupRouter.post("/calculate",async(req,res)=>{
    const {amount,year}=req.body;
    let interest=7.1;
    const x=1+(Number(interest)/100);
    const y=(x**Number(year));
    const z=((y-1)/(Number(interest)/100));
    const final=Math.ceil(amount*z);
    const inamount=Math.ceil(amount*year);
    const intgained=Math.ceil(final-inamount);
    try{
       res.send({"totalinvestmentamount":inamount,"interestgained":intgained,"maturityvalue":final});
    }
    catch(err){
        console.log(err);
        res.send({"msg":"invalid request"})
    }
})

signupRouter.post("/signup",async(req,res)=>{
    const {name,email,password}=req.body;
    const getuser=await SignupModel.find({email})
    if(getuser.length>0){
        res.send("user already registered")
    }else{
        try{
            const time=new Date();
            // const timestamp=time.getTime()
            bcrypt.hash(password,10,async (error,hash)=>{
                const newperson=new SignupModel({name,email,timestamp:time,password:hash})
                await newperson.save();
                res.send({"msg":"user registered successfully"})
            })
         }
         catch(err){
             console.log(err);
             res.send({"msg":"user registration failed"})
         }
    }
    
})

signupRouter.post("/login",async(req,res)=>{
    const {email,password}=req.body;
    try{
       const user=await SignupModel.find({email})
       if(user.length>0){
        const hashedpass=user[0].password
        bcrypt.compare(password,hashedpass,(err,result)=>{
            if(result){
                const token=jwt.sign({"userID":user[0]._id},"kartik")
                res.send({'msg':"login successful",'token':token,'user':user})
            }else{
                res.send({"msg":"login failed"})
            }
        })
       }else{
        res.send({"msg":"wrong credentials"})
       }
    }
    catch(err){
        console.log(err);
        res.send(err)
    }
})

signupRouter.delete("/delete/:userID",async(req,res)=>{
    const id=req.params.userID
    try{
        await SignupModel.findByIdAndDelete({_id:id})
        res.send({"msg":"user deleted"})
    }
    catch(err){
        console.log(err);
        res.send({"msg":"invalid request"})
    }
})

module.exports={signupRouter}