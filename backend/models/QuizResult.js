const mongoose = require("mongoose");

const quizResultSchema = new mongoose.Schema({

    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true
    },

    category: {
        type: String,
        required: true,
        enum: [
            "Aptitude",
            "Technical",
            "Coding",
            "Interview",
            "Mock Test"
        ]
    },

    topic: {
        type: String,
        required: true
    },

    score: {
        type: Number,
        required: true,
        min: 0
    },

    totalQuestions: {
        type: Number,
        required: true,
        min: 1
    },

    percentage: {
        type: Number,
        required: true
    },

    attemptedAt: {
        type: Date,
        default: Date.now
    }

}, { timestamps: true });

module.exports = mongoose.model("QuizResult", quizResultSchema);