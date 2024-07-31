import { Router } from 'express';
import { createNewUserStory, getProjectUserStories } from '../controllers/userStory.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/multer.middleware.js';

const userStoryRouter = Router();


// all routes are protected, only authenticated users can access them

// create new userStory
userStoryRouter.route('/new').post(

    verifyJWT,

    upload.fields([        // middleware
        {name: 'attachments', maxCount: 10},
    ]),

    createNewUserStory
)


// get all userStories for a project
userStoryRouter.route('/getalluserstories/:projectId').get(

    verifyJWT,

    getProjectUserStories
)


export default userStoryRouter;