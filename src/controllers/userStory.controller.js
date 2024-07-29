import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Project } from "../models/project.model.js";
import { User } from "../models/user.model.js";
import { UserStory } from "../models/userStory.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createNewUserStory = asyncHandler(async (req, res, next) => {

    const { projectId, subject, description, status } = req.body;
    
    try{

        // Check if project exists
        const project = await Project.findById(projectId);
        if (!project) {
            throw new ApiError(404, "Project not found");
        }

        let attachmentUrls = [];

            // Check for attachments and upload them to Cloudinary
            if (req.files && req.files.attachments && req.files.attachments.length > 0) {
                for (const file of req.files.attachments) {
                    const result = await uploadOnCloudinary(file.path);
                    if (result) {
                        attachmentUrls.push(result.secure_url);
                    } else {
                        throw new ApiError(500, "Error uploading attachment to Cloudinary");
                    }
                }
            }

        // create a new user story
        const newUserStory =  await UserStory.create({
            subject,
            description,
            attachments : attachmentUrls, 
            status,
        });

        // update project's user stories field
        project.userStoriesId = [...project.userStoriesId, newUserStory._id];
        await project.save(); 

        // return response
        return res
        .status(201)
        .json(new ApiResponse(200, newUserStory, "userStory created successfully"));

    }
    catch(error){
        throw new ApiError(500, "Error creating user story : " + error.message);
    }

});

export { createNewUserStory };