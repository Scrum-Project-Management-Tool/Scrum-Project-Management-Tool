import {asyncHandler} from '../utils/asyncHandler.js';
import{ApiError} from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import { Project } from "../models/project.model.js"
import { User } from "../models/user.model.js"


const createNewProject = asyncHandler(async (req, res) => {

    const { title, description } = req.body;

    console.log(req.body);

    try {
        
        // create a new project
        const project = await Project.create({
            title,
            description
        });

        // check if project was created by querying the database using the _id
        const createdProject = await Project.findById(project._id);

        if (!createdProject) {
            throw new ApiError(500, "Error creating project");
        }

        // return response
        return res.status(201).json(
            new ApiResponse(200, project, "project created successfully")
        )

    } catch (error) {
        throw new ApiError(500, "Error creating project : " + error.message);
    }

});


const assignProjectToUsers = asyncHandler(async (req, res) => {
    
    const { projectId, userIds } = req.body;

    try {
        // Check if project exists
        const project = await Project.findById(projectId);
        if (!project) {
            throw new ApiError(404, "Project not found");
        }

        // Update users' projectId field
        const users = await User.updateMany(
            { _id: { $in: userIds } },
            { $addToSet: { projectId: projectId } },
            { new: true }
        );

        if (!users) {
            throw new ApiError(500, "Error assigning project to users");
        }

        // Update project's assignees field
        project.assignees = [...new Set([...project.assignees, ...userIds])]; // Ensure no duplicates
        await project.save();

        // Return response
        return res.status(200).json(
            new ApiResponse(200, "Project assigned to users successfully"));

    } catch (error) {
        throw new ApiError(500, "Error assigning project to users: " + error.message);
    }
});

const getAllAssignedProjects = asyncHandler(async (req, res) => {
    
});


export {createNewProject, assignProjectToUsers, getAllAssignedProjects}