const user = JSON.parse(
    localStorage.getItem("careerMateUser") || "null"
);

const studentId = user?.id || user?._id;

async function loadAnalytics() {

    if (!studentId) {
        alert("Please login first!");
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch(
            `/api/performance/analytics/${studentId}`
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Unable to load analytics");
        }

        document.getElementById("totalQuizzes").textContent =
            data.totalQuizzes || 0;

        const weakContainer = document.getElementById("weakAreas");

        if (!data.weakAreas || data.weakAreas.length === 0) {
            weakContainer.innerHTML = `
                <div class="empty">
                    <h2>🎉 No Performance Data Yet!</h2>
                    <p>Attempt some quizzes to see your topic-wise analytics here.</p>
                </div>
            `;
            return;
        }

        weakContainer.innerHTML = data.weakAreas.map(item => {

            let statusClass = "good";

            if (item.status === "Weak") {
                statusClass = "weak";
            } else if (item.status === "Needs Improvement") {
                statusClass = "average";
            }

            const score = Math.max(0, Math.min(100, Number(item.average) || 0));

            return `
                <div class="topic-card">

                    <div class="topic-top">
                        <h3>${item.topic}</h3>
                        <span class="status ${statusClass}">
                            ${item.status}
                        </span>
                    </div>

                    <div class="score">${score}%</div>

                    <div class="progress-track">
                        <div class="progress-fill"
                             style="width: ${score}%">
                        </div>
                    </div>

                </div>
            `;

        }).join("");

    } catch (error) {
        console.error("Analytics Error:", error);

        document.getElementById("weakAreas").innerHTML = `
            <div class="empty">
                Unable to load analytics: ${error.message}
            </div>
        `;
    }
}

loadAnalytics();