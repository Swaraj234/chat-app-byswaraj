import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const protectRoute = async (req,res,next) =>{
    try {
        const token = req.cookies.jwt;
        if(!token){
            return res.status(400).json({error:"Unauthorized - no token provided"})
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        
        if(!decoded){
            return res.status(400).json({error:"Unauthorized - no token provided"})
        }   

        const user = await User.findById(decoded.userId).select("-password");

        if(!user){
            return res.status(400).json({error:"User Not found"})

        }
        
        req.user = user;
        
        next();

    } catch (error) {
        console.log("error in protectedRoute middleware",error.message)
        res.status(500).json({error:"Internal Server error"})
        
    }
}

export default protectRoute;