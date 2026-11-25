const express = require("express");
const router = express.Router();

const QuizResult = require("../models/QuizResult");
const StudyGoal = require("../models/StudyGoal");

// SAVE QUIZ RESULT
router.post("/save", async (req, res) => {
    try {
        const {
            studentId,
            category,
            topic,
            score,
            totalQuestions
        } = req.body;

        if (!studentId || !category || !topic ||
            score === undefined || !totalQuestions) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const percentage = Math.round(
            (Number(score) / Number(totalQuestions)) * 100
        );

        const result = await QuizResult.create({
            studentId,
            category,
            topic,
            score,
            totalQuestions,
            percentage
        });

        res.status(201).json({
            message: "Performance saved successfully",
            result
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// GET WEAK AREAS AND READINESS SCORE
router.get("/analytics/:studentId", async (req, res) => {
    try {
        const { studentId } = req.params;

        const results = await QuizResult.find({ studentId });

        const goals = await StudyGoal.find({ studentId });

        if (results.length === 0) {
            return res.json({
                weakAreas: [],
                readinessScore: null,
                message: "Complete a quiz to calculate your readiness score."
            });
        }

        // GROUP RESULTS BY TOPIC
        const topicData = {};

        results.forEach(result => {
            if (!topicData[result.topic]) {
                topicData[result.topic] = [];
            }

            topicData[result.topic].push(result.percentage);
        });

        const weakAreas = Object.keys(topicData)
            .map(topic => {
                const scores = topicData[topic];

                const average = Math.round(
                    scores.reduce((a, b) => a + b, 0) / scores.length
                );

                return {
                    topic,
                    average,
                    status: average < 40
                        ? "Weak"
                        : average < 60
                        ? "Needs Improvement"
                        : "Good"
                };
            })
            .filter(item => item.average < 60);

        // CATEGORY PERFORMANCE
        const categoryData = {};

        results.forEach(result => {
            if (!categoryData[result.category]) {
                categoryData[result.category] = [];
            }

            categoryData[result.category].push(result.percentage);
        });

        const categoryScores = Object.keys(categoryData).map(category => {
            const scores = categoryData[category];

            return Math.round(
                scores.reduce((a, b) => a + b, 0) / scores.length
            );
        });

        const quizAverage = Math.round(
            categoryScores.reduce((a, b) => a + b, 0) /
            categoryScores.length
        );

        // STUDY CONSISTENCY
        let readinessScore = quizAverage;

        if (goals.length > 0) {
            const completedGoals = goals.filter(
                goal => goal.completed
            ).length;

            const consistency = Math.round(
                (completedGoals / goals.length) * 100
            );

            readinessScore = Math.round(
                (quizAverage * 0.8) + (consistency * 0.2)
            );
        }

        res.json({
            weakAreas,
            categoryScores: categoryData,
            readinessScore,
            totalQuizzes: results.length
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;