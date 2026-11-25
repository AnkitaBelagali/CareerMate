const mongoose = require("mongoose");

const studyGoalSchema = new mongoose.Schema({

    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true
    },

    task: {
        type: String,
        required: true,
        trim: true
    },

    subject: {
        type: String,
        required: true
    },

    studyDate: {
        type: Date,
        required: true
    },

    completed: {
        type: Boolean,
        default: false
    },

    hoursSpent: {
        type: Number,
        default: 0
    }

}, { timestamps: true });

module.exports = mongoose.model("StudyGoal", studyGoalSchema);