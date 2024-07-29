import mongoose, { Schema} from "mongoose";

const projectSchema = new mongoose.Schema(
    {
        assignees: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: false,
            },
        ],
        title: {
            type: String,
            required: true,
            //trim: true,
        },
        description: {
            type: String,
            required: true,
            //trim: true,
        },
        userStoriesId: [
            {
                type: Schema.Types.ObjectId,
                ref: "UserStory",
            },
        ],
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
