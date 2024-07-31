import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { UserStory } from "../models/userStory.model.js";
import { Task } from "../models/task.model.js";

const createNewTask = asyncHandler(async (req, res, next) => {

    const { userStoryId, subject, status } = req.body;

    try{
        // check if user story exists
        const userStory = await UserStory.findById(userStoryId);

        if (!userStory) {
            throw new ApiError(404, "User story not found");
        }

        // create a new task
        const newTask = await Task.create({
            subject,
            status
        });

        // update user story's tasks field
        userStory.tasksId = [...userStory.tasksId, newTask._id];
        await userStory.save();

        // return response
        return res
        .status(201)
        .json(new ApiResponse(200, newTask, "task created successfully"));

    }
    catch(error){
        throw new ApiError(500, "Error creating task : " + error.message);
    }
    
    
    
    


});


export { createNewTask };