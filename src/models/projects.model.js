import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        visibility:{
            type: String,
            enum : ['public','private'],
            required: true,
        },
        assignee: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
        ],
        backlogId: {
            type: Schema.Types.ObjectId,
            ref: "Backlog",
            required: true,
        },
        userStoriesId: [
            {
                type: Schema.Types.ObjectId,
                ref: "UserStory",
            },
        ],
        taskId: [
            {
                type: Schema.Types.ObjectId,
                ref: "Task",
            },
        ],
    }, 
    { timestamps: true });

export const Project = mongoose.model("Project", projectSchema);
