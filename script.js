// ==========================================
// CAREERMATE - MAIN JAVASCRIPT
// ==========================================


// ==========================================
// 1. STUDENT REGISTRATION
// ==========================================

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async function(event) {

        event.preventDefault();

        const name = document.getElementById("registerName").value.trim();
        const email = document.getElementById("registerEmail").value.trim();
        const college = document.getElementById("collegeName").value.trim();
        const password = document.getElementById("registerPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {

            const response = await fetch(
                "/api/auth/register",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name,
                        email,
                        college,
                        password
                    })
                }
            );

            const data = await response.json();

            if (response.ok) {

                alert("Registration Successful! Please login.");

                window.location.href = "login.html";

            } else {

                alert(data.message || "Registration failed.");

            }

        } catch (error) {

            console.error("Registration Error:", error);

            alert("Cannot connect to the server. Please try again.");

        }

    });

}



// ==========================================
// 2. STUDENT LOGIN
// ==========================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function(event) {

        event.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;

        try {

            const response = await fetch(
                "/api/auth/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            if (response.ok) {

                localStorage.setItem(
                    "careerMateUser",
                    JSON.stringify(data.student)
                );

                alert("Login Successful! Welcome to CareerMate.");

                window.location.href = "dashboard.html";

            } else {

                alert(data.message || "Invalid email or password.");

            }

        } catch (error) {

            console.error("Login Error:", error);

            alert("Cannot connect to the server. Please try again.");

        }

    });

}



// ==========================================
// 3. DISPLAY STUDENT NAME ON DASHBOARD
// ==========================================

const studentName = document.getElementById("studentName");

if (studentName) {

    const savedUser = JSON.parse(
        localStorage.getItem("careerMateUser")
    );

    if (savedUser) {

        studentName.textContent = savedUser.name;

    }

}



// ==========================================
// 4. APTITUDE CATEGORY AND CHAPTERS
// ==========================================

const aptitudeTopics = {

    quantitative: {

        heading: "Quantitative Aptitude",

        description: "Master mathematical concepts for placement exams.",

        topics: [
            "Number System",
            "Percentage",
            "Profit and Loss",
            "Simple Interest",
            "Compound Interest",
            "Ratio and Proportion",
            "Average",
            "Time and Work",
            "Speed, Distance and Time",
            "Problems on Ages",
            "Permutation and Combination",
            "Probability"
        ]

    },


    reasoning: {

        heading: "Logical Reasoning",

        description: "Improve your logical thinking and problem-solving skills.",

        topics: [
            "Number Series",
            "Coding and Decoding",
            "Blood Relations",
            "Direction Sense",
            "Seating Arrangement",
            "Syllogisms",
            "Puzzles",
            "Analogy",
            "Classification",
            "Ranking and Order"
        ]

    },


    verbal: {

        heading: "Verbal Ability",

        description: "Improve your English grammar and communication skills.",

        topics: [
            "Parts of Speech",
            "Tenses",
            "Synonyms and Antonyms",
            "Sentence Correction",
            "Reading Comprehension",
            "Active and Passive Voice",
            "Direct and Indirect Speech",
            "Prepositions",
            "Vocabulary",
            "Sentence Arrangement"
        ]

    }

};



// ==========================================
// 5. DISPLAY SELECTED CATEGORY
// ==========================================

function openAptitudeCategory(category) {

    const selectedCategory = aptitudeTopics[category];

    if (!selectedCategory) return;

    const heading = document.getElementById("topicHeading");

    const description = document.getElementById("topicDescription");

    const container = document.getElementById("topicContainer");

    if (!heading || !description || !container) return;

    heading.textContent = selectedCategory.heading;

    description.textContent = selectedCategory.description;

    container.innerHTML = "";

    selectedCategory.topics.forEach(function(topic, index) {

        const card = document.createElement("div");

        card.className = "topic-card";

        const title = document.createElement("h3");

        title.textContent = `${index + 1}. ${topic}`;

        const paragraph = document.createElement("p");

        paragraph.textContent =
            "Learn concepts, formulas and practise questions.";

        const button = document.createElement("button");

        button.textContent = "Start Learning →";

        button.addEventListener("click", function() {

            openLesson(topic);

        });

        card.appendChild(title);

        card.appendChild(paragraph);

        card.appendChild(button);

        container.appendChild(card);

    });

    document.getElementById("topicSection").scrollIntoView({

        behavior: "smooth"

    });

}



// ==========================================
// 6. CURRENT QUIZ VARIABLES
// ==========================================

let currentQuiz = [];



// ==========================================
// 7. OPEN CHAPTER LESSON
// ==========================================

function openLesson(topic) {

    const lessonSection = document.getElementById("lessonSection");

    const lessonTitle = document.getElementById("lessonTitle");

    const lessonContent = document.getElementById("lessonContent");

    if (!lessonSection || !lessonTitle || !lessonContent) return;

    lessonTitle.textContent = topic;

    const lesson = window.aptitudeData
        ? window.aptitudeData[topic]
        : null;

    if (!lesson) {

        lessonContent.innerHTML = `
            <h3>Study Material</h3>
            <p>Study material for ${topic} is not available.</p>
        `;

        lessonSection.scrollIntoView({ behavior: "smooth" });

        return;

    }

    let html = "";

    html += `
        <h3>📖 Introduction</h3>
        <p>${lesson.intro || ""}</p>
    `;


    if (lesson.concepts && lesson.concepts.length > 0) {

        html += `<h3>📚 Important Concepts</h3>`;

        lesson.concepts.forEach(function(concept) {

            html += `<p>${concept}</p>`;

        });

    }


    if (lesson.formulas && lesson.formulas.length > 0) {

        html += `<h3>📌 Important Formulas</h3>`;

        lesson.formulas.forEach(function(formula) {

            html += `<p>${formula}</p>`;

        });

    }


    if (lesson.examples && lesson.examples.length > 0) {

    html += `<h3>💡 Solved Examples</h3>`;

    lesson.examples.forEach(function(example, index) {

        html += `<div class="example-box">`;
        html += `<h4>Example ${index + 1}</h4>`;

        if (typeof example === "object" && example !== null) {

            Object.entries(example).forEach(([key, value]) => {

                html += `
                    <p>
                        <strong>${key}:</strong>
                        ${Array.isArray(value) ? value.join(", ") : value}
                    </p>
                `;

            });

        } else {

            html += `<p>${example}</p>`;

        }

        html += `</div>`;

    });

}


    html += `
        <h3>📝 Test Your Knowledge</h3>

        <p>Answer the questions and check your score!</p>

        <div id="quizContainer"></div>

        <button onclick="checkQuizAnswers()">
            Submit Quiz
        </button>

        <div id="quizResult"></div>
    `;

    lessonContent.innerHTML = html;

    displayChapterQuiz(topic);

    lessonSection.scrollIntoView({

        behavior: "smooth"

    });

}



// ==========================================
// 8. DISPLAY CHAPTER QUIZ
// ==========================================

function displayChapterQuiz(topic) {

    const quizContainer = document.getElementById("quizContainer");

    if (!quizContainer) return;

    const allQuizData = window.quizData || {};

    currentQuiz = allQuizData[topic] || [];

    if (currentQuiz.length === 0) {

        quizContainer.innerHTML =
            "<p>No quiz questions available for this chapter.</p>";

        return;

    }

    quizContainer.innerHTML = "";

    currentQuiz.forEach(function(question, index) {

        const questionDiv = document.createElement("div");

        questionDiv.className = "quiz-question";

        let questionHTML = `
            <h4>${question.question}</h4>
        `;

        question.options.forEach(function(option) {

            questionHTML += `
                <label>
                    <input
                        type="radio"
                        name="question${index}"
                        value="${option}"
                    >
                    ${option}
                </label>
                <br>
            `;

        });

        questionDiv.innerHTML = questionHTML;

        quizContainer.appendChild(questionDiv);

    });

}



// ==========================================
// 9. CHECK QUIZ ANSWERS
// ==========================================
async function checkQuizAnswers() {

    if (currentQuiz.length === 0) {
        alert("No questions available!");
        return;
    }

    let score = 0;
    let resultHTML = "";

    currentQuiz.forEach(function(question, index) {

        const selected = document.querySelector(
            `input[name="question${index}"]:checked`
        );

        if (selected && selected.value === question.answer) {

            score++;

            resultHTML += `
                <div class="correct-answer">
                    <p>✅ Question ${index + 1}: Correct!</p>
                    <p>${question.explanation || ""}</p>
                </div>
            `;

        } else {

            resultHTML += `
                <div class="wrong-answer">
                    <p>❌ Question ${index + 1}: Incorrect!</p>
                    <p>Correct Answer: ${question.answer}</p>
                    <p>Explanation: ${question.explanation || ""}</p>
                </div>
            `;

        }

    });

    const quizResult = document.getElementById("quizResult");

    if (quizResult) {
        quizResult.innerHTML = `
            <h2>🎉 Your Score: ${score}/${currentQuiz.length}</h2>
            <h3>Answer Review</h3>
            ${resultHTML}
            <p id="saveStatus">Saving your performance...</p>
        `;
    }

    // SAVE RESULT TO MONGODB

    const user = JSON.parse(
        localStorage.getItem("careerMateUser") || "null"
    );

    const studentId = user?.id || user?._id;

    if (!studentId) {
        document.getElementById("saveStatus").textContent =
            "Please login again to save your score.";
        return;
    }

    try {

        const response = await fetch(
            "/api/performance/save",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    studentId: studentId,
                    category: "Aptitude",
                    topic: document.getElementById("lessonTitle").textContent,
                    score: score,
                    totalQuestions: currentQuiz.length
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        document.getElementById("saveStatus").textContent =
            "✅ Performance saved successfully!";

    } catch (error) {

        console.error("Save Performance Error:", error);

        document.getElementById("saveStatus").textContent =
            "❌ Unable to save performance: " + error.message;
    }
}
