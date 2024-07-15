import mongoose, { Schema} from "mongoose";
const sprintSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true,
            trim: true,
        },
        startDate:{
            type: Date,
            required: true,
        },
        endDate:{
            type: Date,
            required: true,
        },
        userStoriesId:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "UserStory",
            },
        ],
    },
    {timestamps: true})

export const Sprint = mongoose.model("Sprint", sprintSchema);