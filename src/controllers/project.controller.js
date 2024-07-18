import {asyncHandler} from '../utils/asyncHandler.js';
import{ApiError} from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import { Project } from "../models/project.model.js"


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


const assignProject = asyncHandler(async (req, res) => {
    
});


const getAllAssignedProjects = asyncHandler(async (req, res) => {
    
});


export {createNewProject, assignProject, getAllAssignedProjects}