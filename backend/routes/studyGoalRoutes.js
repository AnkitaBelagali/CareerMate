const express = require("express");
const mongoose = require("mongoose");
const StudyGoal = require("../models/StudyGoal");

const router = express.Router();

// GET ALL STUDY GOALS FOR A STUDENT
router.get("/:studentId", async (req, res) => {
    try {
        const { studentId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(studentId)) {
            return res.status(400).json({
                message: "Invalid student ID"
            });
        }

        const goals = await StudyGoal.find({
            studentId: studentId
        }).sort({ studyDate: -1, createdAt: -1 });

        res.status(200).json(goals);

    } catch (error) {
        res.status(500).json({
            message: "Unable to fetch study goals",
            error: error.message
        });
    }
});


// ADD A NEW STUDY GOAL
router.post("/", async (req, res) => {
    try {
        const {
            studentId,
            task,
            subject,
            studyDate,
            hoursSpent
        } = req.body;

        if (
            !studentId ||
            !mongoose.Types.ObjectId.isValid(studentId) ||
            !task ||
            !subject ||
            !studyDate
        ) {
            return res.status(400).json({
                message: "Please provide all required details"
            });
        }

        const hours = Number(hoursSpent || 0);

        if (!Number.isFinite(hours) || hours < 0 || hours > 24) {
            return res.status(400).json({
                message: "Study hours must be between 0 and 24"
            });
        }

        const goal = new StudyGoal({
            studentId,
            task,
            subject,
            studyDate: new Date(`${studyDate}T00:00:00`),
            hoursSpent: hours
        });

        await goal.save();

        res.status(201).json({
            message: "Study goal added successfully!",
            goal
        });

    } catch (error) {
        res.status(500).json({
            message: "Unable to add study goal",
            error: error.message
        });
    }
});


// MARK STUDY GOAL AS COMPLETED OR PENDING
router.patch("/:id", async (req, res) => {
    try {
        const { completed, hoursSpent, studentId } = req.body;

        if (!studentId || !mongoose.Types.ObjectId.isValid(studentId)) {
            return res.status(400).json({
                message: "Valid student ID is required"
            });
        }

        const goal = await StudyGoal.findOne({
            _id: req.params.id,
            studentId
        });

        if (!goal) {
            return res.status(404).json({
                message: "Study goal not found"
            });
        }

        if (typeof completed === "boolean") {
            goal.completed = completed;
        }

        if (hoursSpent !== undefined) {
            const hours = Number(hoursSpent);

            if (!Number.isFinite(hours) || hours < 0 || hours > 24) {
                return res.status(400).json({
                    message: "Study hours must be between 0 and 24"
                });
            }

            goal.hoursSpent = hours;
        }

        await goal.save();

        res.status(200).json({
            message: "Study goal updated successfully!",
            goal
        });

    } catch (error) {
        res.status(500).json({
            message: "Unable to update study goal",
            error: error.message
        });
    }
});


// DELETE A STUDY GOAL
router.delete("/:id", async (req, res) => {
    try {
        const { studentId } = req.body;

        if (!studentId || !mongoose.Types.ObjectId.isValid(studentId)) {
            return res.status(400).json({
                message: "Valid student ID is required"
            });
        }

        const goal = await StudyGoal.findOneAndDelete({
            _id: req.params.id,
            studentId
        });

        if (!goal) {
            return res.status(404).json({
                message: "Study goal not found"
            });
        }

        res.status(200).json({
            message: "Study goal deleted successfully!"
        });

    } catch (error) {
        res.status(500).json({
            message: "Unable to delete study goal",
            error: error.message
        });
    }
});

module.exports = router;