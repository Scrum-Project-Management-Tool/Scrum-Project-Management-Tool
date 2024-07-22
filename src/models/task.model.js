import mongoose, { Schema} from "mongoose";

const taskSchema = new mongoose.Schema(
    {
        assignees: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: false,
            },
        ],
        subject:{
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
        },
    }, 
    { timestamps: true });

export const Task = mongoose.model("Task", taskSchema);
