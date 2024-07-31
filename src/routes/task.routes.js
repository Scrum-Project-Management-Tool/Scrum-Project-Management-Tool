import { Router } from 'express';
import { createNewTask } from '../controllers/task.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/multer.middleware.js';

const taskRouter = Router();


// all routes are protected, only authenticated users can access them

// create new task
taskRouter.route('/new').post(

    verifyJWT,

    createNewTask
)


export default taskRouter;