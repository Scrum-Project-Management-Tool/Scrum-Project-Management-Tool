import mongoose from "mongoose";

const backlogSchema = new mongoose.Schema(
    {
        userStoriesId: [
            {
                type: Schema.Types.ObjectId,
                ref: "UserStory",
            },
        ]
    }, 
    { timestamps: true });

export const Backlog = mongoose.model("Backlog", backlogSchema);    