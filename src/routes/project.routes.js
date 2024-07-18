import { Router } from 'express';
import { createNewProject, assignProject, getAllAssignedProjects, } from '../controllers/project.controller.js';

const projectRouter = Router();

// create new project
projectRouter.route('/new').post(
    createNewProject
)

// assign project to user
projectRouter.route('/assign').post(
    assignProject
)

// get all projects
projectRouter.route('/allAssigned').get((req, res) => {
    getAllAssignedProjects
})


export default projectRouter;