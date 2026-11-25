const API_URL = "/api/study-goals";


// GET LOGGED-IN STUDENT
const currentUser = JSON.parse(
    localStorage.getItem("careerMateUser") || "null"
);

const studentId = currentUser?.id || currentUser?._id;

if (!studentId) {

    alert("Please login first!");

    window.location.href = "login.html";

}


// DISPLAY STUDENT NAME
document.getElementById("studentName").textContent =
    currentUser?.name || "Student";


// SET DEFAULT DATE
const today = new Date().toLocaleDateString("en-CA");

document.getElementById("goalDate").value = today;
document.getElementById("goalDate").min = today;

document.getElementById("historyDate").value = "";


// STORE GOALS
let studyGoals = [];


// FETCH STUDY GOALS
async function loadStudyGoals() {

    try {

        const response = await fetch(`${API_URL}/${studentId}`);

        const goals = await response.json();

        if (!response.ok) {
            throw new Error(goals.message || "Unable to load goals");
        }

        studyGoals = goals;

        displayStudyGoals();

        updateGoalStatistics();

    } catch (error) {

        document.getElementById("studyGoalList").innerHTML =
            `<p class="empty-goals">${error.message}</p>`;

        console.error(error);

    }

}


// ADD NEW STUDY GOAL
document.getElementById("studyGoalForm").addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        const task = document.getElementById("goalTask").value.trim();

        const subject = document.getElementById("goalSubject").value;

        const studyDate = document.getElementById("goalDate").value;

        const hoursSpent = Number(
            document.getElementById("goalHours").value
        );

        if (!task || !subject || !studyDate) {
            alert("Please fill all the fields.");
            return;
        }

        if (!Number.isFinite(hoursSpent) || hoursSpent < 0 || hoursSpent > 24) {
            alert("Study hours must be between 0 and 24.");
            return;
        }

        try {

            const response = await fetch(API_URL, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    studentId,
                    task,
                    subject,
                    studyDate,
                    hoursSpent

                })

            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Unable to add goal");
            }

            alert("Study goal added successfully! 🎉");

            document.getElementById("studyGoalForm").reset();

            document.getElementById("goalDate").value = today;

            document.getElementById("goalHours").value = 1;

            await loadStudyGoals();

        } catch (error) {

            alert(error.message);

        }

    }
);


// DISPLAY STUDY GOALS
function displayStudyGoals() {

    const container = document.getElementById("studyGoalList");

    const selectedDate = document.getElementById("historyDate").value;

    let filteredGoals = studyGoals;

    if (selectedDate) {

        filteredGoals = studyGoals.filter(goal => {

            const goalDate = new Date(goal.studyDate)
                .toLocaleDateString("en-CA");

            return goalDate === selectedDate;

        });

    }

    if (filteredGoals.length === 0) {

        container.innerHTML = `
            <p class="empty-goals">
                No study goals found for this date. Add a new goal!
            </p>
        `;

        return;

    }

    container.innerHTML = filteredGoals.map(goal => {

        const date = new Date(goal.studyDate).toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric",
                timeZone: "UTC"
            }
        );

        return `

            <div class="study-goal-card">

                <div class="study-goal-info">

                    <span class="goal-subject">
                        ${escapeHTML(goal.subject)}
                    </span>

                    <h3>${escapeHTML(goal.task)}</h3>

                    <p>📅 ${date}</p>

                    <p>⏱️ ${goal.hoursSpent} Study Hours</p>

                </div>

                <div class="study-goal-actions">

                    <span class="${goal.completed ? "completed-label" : "pending-label"}">

                        ${goal.completed ? "✓ Completed" : "Pending"}

                    </span>

                    <button
                        onclick="toggleGoal('${goal._id}', ${!goal.completed})"
                        class="complete-btn"
                    >
                        ${goal.completed ? "Mark Pending" : "Mark Complete"}
                    </button>

                    <button
                        onclick="deleteGoal('${goal._id}')"
                        class="delete-goal-btn"
                    >
                        Delete
                    </button>

                </div>

            </div>

        `;

    }).join("");

}


// PREVENT HTML INJECTION IN DISPLAYED TEXT
function escapeHTML(value) {

    return String(value).replace(/[&<>"']/g, character => {

        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[character];

    });

}


// UPDATE STATISTICS
function updateGoalStatistics() {

    const total = studyGoals.length;

    const completed = studyGoals.filter(
        goal => goal.completed
    ).length;

    const pending = total - completed;

    const hours = studyGoals.reduce(
        (sum, goal) => sum + Number(goal.hoursSpent || 0),
        0
    );

    document.getElementById("totalGoals").textContent = total;

    document.getElementById("completedGoals").textContent = completed;

    document.getElementById("pendingGoals").textContent = pending;

    document.getElementById("totalHours").textContent =
        hours.toFixed(1);

}


// MARK COMPLETE OR PENDING
async function toggleGoal(id, completed) {

    try {

        const response = await fetch(`${API_URL}/${id}`, {

            method: "PATCH",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                studentId,
                completed

            })

        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Unable to update goal");
        }

        await loadStudyGoals();

    } catch (error) {

        alert(error.message);

    }

}


// DELETE STUDY GOAL
async function deleteGoal(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this study goal?"
    );

    if (!confirmDelete) return;

    try {

        const response = await fetch(`${API_URL}/${id}`, {

            method: "DELETE",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                studentId
            })

        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Unable to delete goal");
        }

        await loadStudyGoals();

    } catch (error) {

        alert(error.message);

    }

}


// FILTER HISTORY BY DATE
document.getElementById("historyDate").addEventListener(
    "change",
    displayStudyGoals
);


// INITIAL LOAD
loadStudyGoals();