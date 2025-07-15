const express = require("express");
const app = express();
const cors = require("cors")
const userRoutes = require('./routes/userRoutes');
const connectDB = require("./config/db");
const dotenv = require("dotenv");
dotenv.config();
connectDB();
app.use(cors())
app.use(express.json());
app.get("/hello" , (req,res)=>{
    res.json({
        "message":"hello"
    })
})

app.use("/api/users" , userRoutes)
app.listen(5000 ,()=>{
    console.log("server running")
})