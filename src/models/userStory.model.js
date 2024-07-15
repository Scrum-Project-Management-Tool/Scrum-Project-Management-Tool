import mongoose from "mongoose";

const userStorySchema = new mongoose.Schema(
    {
        assignees:[
            {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
        ],
        subject:{
            type: String,
            required: true,
            trim: true,
        },
        tag:[
            {
                type: String,
                trim: true,
            },
        ],
        description:{
            type: String,
            required: true,
            trim: true,
        },
        attachment:[
            {
                type: String,     // URL
                trim: true,
            },
        ],
        status:{
            type: String,
            enum : ['new', 'ready', 'in-progress', 'ready for test', 'done', 'archived'],
            required: true,
        },
        tasksId:[
            {
                type: Schema.Types.ObjectId,
                ref: "Task",
            },
        ],

    },
    { timestamps: true });

export const UserStory = mongoose.model("UserStory", userStorySchema);