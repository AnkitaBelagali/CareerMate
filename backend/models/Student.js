const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    college: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    }

}, { timestamps: true });

module.exports = mongoose.model("Student", studentSchema);