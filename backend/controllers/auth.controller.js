import bcrypt from "bcryptjs"
import User from '../models/user.model.js';
import genrateTokenAndSetCookie from "../utils/genrateToken.js";

export const signup = async (req,res) =>{
    try {
        const {fullName,userName,password,confirmPassword,gender} = req.body;

        if(password !== confirmPassword){
            return res.status(400).json({error:"password dont match"})
        }
        const user = await User.findOne({userName});

        if(user){
            return res.status(400).json({error:"user already exist"})
        }

        //HASH PASSWORD
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        //  avatar 

        
        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${userName}`
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${userName}`

        const newUser = new User ({
            fullName,
            userName,
            password:hashedPassword,
            gender,
            profilePic:gender ==="male" ? boyProfilePic : girlProfilePic


        });

        if(newUser){

        await genrateTokenAndSetCookie(newUser._id,res);
        await newUser.save();

        res.status(201).json({
            _id:newUser._id,
            fullName: newUser.fullName,
            userName: newUser.userName,
            profilePic: newUser.profilePic
        })

        }
        else{
            res.status(400).json({error:"Invalid user data"})
        }






    } catch (error) {
        console.log("Error in interal server ",error.message)
        res.status(500).json({error:"Internal server error"})
        
    }
}

export const login = async (req,res) =>{
    
   try {

    const {userName,password} =req.body;
    const user = await User.findOne({userName})
    const isPasswordCorrect = await bcrypt.compare(password,user?.password || "");

    if(!user || !isPasswordCorrect) {
        return res.status(400).json({error:"Invalid Credentails"})
    }
    
    genrateTokenAndSetCookie(user._id,res);

    res.status(200).json({
        _id:user._id,
        fullName:user.fullName,
        userName:user.userName,
        profilePic:user.profilePic
    })


   } catch (error) {
    console.log("Error in login server ",error.message)
    res.status(500).json({error:"Internal server error"})
    
   }
}



export const logout = (req,res) =>{
    try {
        res.cookie("jwt","",{maxAge:0});
        res.status(200).json({message:"Logout Succesfully"})
        
    } catch (error) {
        console.log("Error in login server ",error.message)
    res.status(500).json({error:"Internal server error"})
        
    }
}