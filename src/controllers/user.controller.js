import {asyncHandler} from '../utils/asyncHandler';
import{ApiError} from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"



const registerUser = asyncHandler(async (req, res) => {


    // Algorithm for user registration
    // get user details from frontend
    // validation - not empty fields
    // check if user already exists - username, email
    // create user object - create entry in DB
    // remove password and refresh token field from response (as they are secrets)
    // check for user creation
    // return response


    // get user details from frontend   
    const {username, email, password, fullName} = req.body 

    if (
        // check if any of the fields are empty
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400, "fields cannot be empty")
    }


    // check if user already exists
    const existedUser = await User.findOne({
        $or: [{email},{username}]
    })

    if (existedUser){
        throw new ApiError(409, "User already exists")
    }



    // create user object - create entry in DB
    const user = await User.create({
        username: username.toLowerCase(),
        email,
        password,
        fullName,
        
    })

    // check if user creation was successful and then remove password and refresh token field from response (as they are secrets)
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser){
        throw new ApiError(500, "Something went wrong while registering user")
    }


    // return response
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )
   
})


export {registerUser}