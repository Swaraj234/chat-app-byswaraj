import path from 'path'
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.route.js";
import userRoutes from "./routes/user.routes.js";
import { app,server} from "./socket/socket.js";


import connectToMongoDB from "./db/connectToMongoDB.js";




const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

dotenv.config();


app.use(express.json()); //to parse the incominng req with json{from req.body}
app.use(cookieParser());

app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoutes);
app.use("/api/user",userRoutes);


app.use(express.static(path.join(__dirname,"/frontend/dist")));
app.get("*",(req,res) =>{
    res.sendFile(path.join(__dirname,"frontend", "dist", "index.html"))
})

// app.get("/",(req,res)=>{
//     //root route http://localhost:5000/
//     res.send("hello world");
// });


server.listen(PORT,()=>{
    connectToMongoDB();
    console.log(`server is running on ${PORT}`);
})
