import mongoose, { Schema} from "mongoose";

const projectSchema = new mongoose.Schema(
    {
        assignees: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
        ],
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
        backlogId: {
            type: Schema.Types.ObjectId,
            ref: "Backlog",
            required: true,
        },
        sprintsId: [
            {
                type: Schema.Types.ObjectId,
                ref: "Sprint",
            }
        ],
        issuesId: [
            {
                type: Schema.Types.ObjectId,
                ref: "Issue",
            },
        ],
    }, 
    { timestamps: true });

export const Project = mongoose.model("Project", projectSchema);
