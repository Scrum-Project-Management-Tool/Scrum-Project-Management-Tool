import {asyncHandler} from '../utils/asyncHandler.js';
import{ApiError} from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js"


const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)

        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken

        // save the user with refresh token in DB (validateBeforeSave: false - to avoid validation error)
        await user.save({validateBeforeSave: false})

        return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens : " + error)
    }
}


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
        [username, email, password, fullName].some((field) => field?.trim() === "")
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

const loginUser = asyncHandler(async (req, res) => {
    // Algorithm for user login

    // request body se data lao
    // username or email based access 
    // check if user exists - username
    // check if password is correct
    // generate JWT token (access and refresh token)
    // send JWT token to cookie
    // return response


    // access data from request body
    const {email, username, password} = req.body

    // check if username or email is provided
    if(!username && !email){
        throw new ApiError(400, "Username or email is required")
    }

    // check if user exists - username or email
    const user = await User.findOne({
        $or:[{username}, {email}]
    })

    // usernmae or email not found then return user not found
    if (!user){
        throw new ApiError(404, "User not found")
    }

    // check if password is correct
    const isPasswordValid = await user.isPasswordCorrect(password)

    // if password incorrect then return invalid credentials
    if(!isPasswordValid){
        throw new ApiError(401, "Invalid credentials")
    }

    // generate JWT token (access and refresh token)
    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)

    // we dont want to send password and refresh token in cookie
    const loggedInUser =  await User.findById(user._id).select("-password -refreshToken")

    // send JWT token to cookie

    // makes the cookie modifiable only by the web server
    const options ={
        httpOnly: true, 
        secure: true,
    }

    // return response 
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {user: loggedInUser, accessToken, refreshToken},
            "User logged in successfully"
        )
    )
});

const logoutUser = asyncHandler(async (req, res) => {
    
    // Algorithm for user logout

    // clear the cookie
    // return response



   await User.findByIdAndUpdate(
    req.user._id,
    {
        $set: {
            refreshToken: undefined
        }
    }, 
    {
        new: true
    },
  )

  const options ={
    httpOnly: true, 
    secure: true,
}

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        new ApiResponse(200, {}, "User logged out successfully")
    )

})


export {registerUser, loginUser, logoutUser}