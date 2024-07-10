# Scrum-Project-Management-Tool
Scrum Project Management Tool for Agile Teams inspired by Taiga.io

thw=ese changes were made by diya.
// models/user.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    project_id: {
        type: String
    },
    task_id: {
        type: String
    },
    sprint_id: {
        type: String
    }
});

module.exports = mongoose.model('User', UserSchema);
