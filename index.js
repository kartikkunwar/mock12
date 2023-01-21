const cors=require("cors");
const express=require("express");


const {connection}=require("./config/db")
const {signupRouter}=require("./routes/userrouter")

const app=express();

app.use(express.json());
app.use(cors({
    origin:"*"
}))
app.use("/user",signupRouter)

app.listen(7700,async()=>{
    try{
      await connection;
      console.log("connected to database")
    }
    catch(err){
        console.log(err);
        console.log("connection error")
    }
    console.log("connection establised")
})