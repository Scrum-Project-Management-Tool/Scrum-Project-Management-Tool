import mongoose from "mongoose";

const issueSchema = new mongoose.Schema(
    {
        assignee:{
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        subject: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        tag: [
            {
                type: String,
                trim: true,
            },
        ],
        attachment: [
            {
                type: String,     // URL
                trim: true,
            },
        ],
        status: {
            type: String,
            enum : ['new','in-progress', 'ready for test', 'closed', 'needs info', 'rejected', 'postponed'],
            required: true,
        },
        type:{
            type: String,
            enum : ['bug','question', 'enhancement'],
            required: true,
        },
        severity: {
            type: String,
            enum : ['wishlist', 'minor','normal', 'important', 'critical'],
            required: true,
        },
        priority: {
            type: String,
            enum : ['low','medium', 'high'],
            required: true,
        },
    }, 
    { timestamps: true }
);

export const Issue = mongoose.model("Issue", issueSchema);