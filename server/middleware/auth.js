import jwt from "jsonwebtoken";
import User from "../models/users.js";


// middleware to protect routes
export const protectRoute= async (req, res, next)=>{
    try{
        const token=req.headers.token

        if (!token) {
            return res.json({ success: false, message: "Token must be provided" });
        }
        
        const decode=jwt.verify(token, process.env.JWT_KEY)

        const user=await User.findById(decode.userId).select("-password")
        if(!user){
            return res.json({success:false, message:"user not found"})
        }
        req.user=user
        next();
    }catch (error){
        console.log(error.message)

        res.json({success:false, message:error.message})
    }
}
