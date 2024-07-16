import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
    
    try {
        // get token from request headers or cookies
        const token = req.cookies?.accessToken || req.headers["authorization"]?.replace('Bearer', '')
    
        // if token is not present, throw an error
        if(!token){
            throw new ApiError(401, "Unauthorized request")
        }
    
        // verify the token using the secret key
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        // find the user from the DB using the decoded token
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        // if user is not found, throw an error
        if(!user){
            throw new ApiError(404, "User not found")
        }
    
        // set the user in the request object
        req.user = user;
    
        // call the next middleware
        next()
    } catch (error) {
        throw new ApiError(401, "invalid access token")
    }

});