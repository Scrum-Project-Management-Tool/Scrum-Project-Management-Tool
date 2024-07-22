import { Router } from 'express';
import { createNewProject, assignProjectToUsers, getAllAssignedProjects, } from '../controllers/project.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';

const projectRouter = Router();


// all routes are protected, only authenticated users can access them

// create new project
projectRouter.route('/new').post(

    verifyJWT,

    createNewProject
)

// assign project to user
projectRouter.route('/assign').post(

    verifyJWT,

    assignProjectToUsers
)

// get all projects
projectRouter.route('/allAssigned').get((req, res) => {

    verifyJWT,

    getAllAssignedProjects
})


export default projectRouter;