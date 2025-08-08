import jwt from "jsonwebtoken";
import {User} from "../models/User.js";
import { asyncHandler } from "../util/asyncHandler.js";
import { ApiError } from "../util/ApiError.js";

export const protectedRoute = asyncHandler(async(req,res,next)=>{

    const token = req.cookies.jwt;
    if(!token){
        throw new ApiError(401,"unauthorized - no token found")
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)

    if(!decoded){
        throw new ApiError(401,"unauthorized - invaid token")
    }

    const user = await User.findById(decoded.user_id).select("-password");

    if(!user){
        throw new ApiError(401,"unauthorized - no user found");
    }

    req.user = user;

    next();
})