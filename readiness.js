const user = JSON.parse(
    localStorage.getItem("careerMateUser") || "null"
);

const studentId = user?.id || user?._id;


async function loadReadiness() {

    if (!studentId) {
        alert("Please login first!");
        window.location.href = "login.html";
        return;
    }

    try {

        const response = await fetch(
            `http://localhost:5001/api/performance/analytics/${studentId}`
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Unable to load readiness");
        }

        const score = data.readinessScore;

        document.getElementById("totalQuizzes").textContent =
            data.totalQuizzes || 0;

        const feedback = document.getElementById("feedbackList");

        if (score === null || score === undefined) {

            document.getElementById("readinessScore").textContent = "N/A";

            document.getElementById("readinessLevel").textContent =
                "Not Available";

            document.getElementById("statusText").textContent =
                "Start Practising";

            document.getElementById("readinessMessage").textContent =
                data.message || "Attempt quizzes to calculate your readiness.";

            feedback.innerHTML = `
                <li>Start with aptitude and technical preparation.</li>
                <li>Attempt quizzes to measure your performance.</li>
                <li>Set daily study goals and practise consistently.</li>
            `;

            return;
        }

        // DISPLAY SCORE
        document.getElementById("readinessScore").textContent =
            score + "/100";

        document.getElementById("scoreProgress").style.width =
            Math.max(0, Math.min(100, score)) + "%";


        // DETERMINE READINESS LEVEL
        let level;
        let message;
        let recommendations;

        if (score < 40) {

            level = "Needs Improvement";
            message = "Build your foundation and practise regularly.";

            recommendations = [
                "Focus on fundamental aptitude concepts.",
                "Revise important technical subjects like DBMS and OOP.",
                "Attempt small quizzes regularly.",
                "Maintain your daily study goals."
            ];

        } else if (score < 60) {

            level = "Developing";
            message = "You're making progress! Keep improving.";

            recommendations = [
                "Practise topics where your quiz scores are low.",
                "Increase your coding practice.",
                "Revise technical interview questions.",
                "Take mock tests to improve your accuracy."
            ];

        } else {

            level = "Good";
            message = "Great progress! Keep practising to become placement-ready.";

            recommendations = [
                "Continue practising aptitude and coding questions.",
                "Prepare for company-specific interviews.",
                "Revise important technical concepts.",
                "Take regular mock tests to maintain your performance."
            ];

        }

        document.getElementById("readinessLevel").textContent = level;

        document.getElementById("statusText").textContent = level;

        document.getElementById("readinessMessage").textContent = message;

        feedback.innerHTML = recommendations
            .map(item => `<li>${item}</li>`)
            .join("");

    }

    catch (error) {

        console.error("Readiness Error:", error);

        document.getElementById("readinessScore").textContent = "--";

        document.getElementById("readinessMessage").textContent =
            "Unable to load your readiness data.";

        document.getElementById("feedbackList").innerHTML =
            `<li>${error.message}</li>`;

    }

}

loadReadiness();