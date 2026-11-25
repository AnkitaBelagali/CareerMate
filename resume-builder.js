function generateResume() {

    const getValue = (id) =>
        document.getElementById(id).value.trim();

    const name = getValue("fullName");
    const email = getValue("email");

    if (!name || !email) {
        alert("Please enter your name and email address!");
        return;
    }

    const data = {
        name,
        email,
        phone: getValue("phone"),
        location: getValue("location"),
        linkedin: getValue("linkedin"),
        github: getValue("github"),
        summary: getValue("summary"),
        degree: getValue("degree"),
        college: getValue("college"),
        graduation: getValue("graduation"),
        cgpa: getValue("cgpa"),
        skills: getValue("skills"),
        projects: getValue("projects"),
        experience: getValue("experience"),
        certifications: getValue("certifications"),
        achievements: getValue("achievements")
    };

    localStorage.setItem("careerMateResume", JSON.stringify(data));

    const escapeHTML = (value) =>
        value.replace(/[&<>"']/g, char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[char]);

    const section = (title, content) => {
        if (!content) return "";

        return `
            <div class="preview-section">
                <h3>${title}</h3>
                <p>${escapeHTML(content).replace(/\n/g, "<br>")}</p>
            </div>
        `;
    };

    document.getElementById("resumePreview").innerHTML = `

        <div class="resume-document">

            <div class="resume-header">
                <h1>${escapeHTML(data.name)}</h1>

                <p>
                    ${[data.email, data.phone, data.location]
                        .filter(Boolean).map(escapeHTML).join(" | ")}
                </p>

                <p>
                    ${[data.linkedin, data.github]
                        .filter(Boolean).map(escapeHTML).join(" | ")}
                </p>
            </div>

            ${section("PROFESSIONAL SUMMARY", data.summary)}

            ${section("EDUCATION",
                [data.degree, data.college, data.graduation, data.cgpa]
                    .filter(Boolean).join("\n"))}

            ${section("TECHNICAL SKILLS", data.skills)}

            ${section("PROJECTS", data.projects)}

            ${section("INTERNSHIPS & EXPERIENCE", data.experience)}

            ${section("CERTIFICATIONS", data.certifications)}

            ${section("ACHIEVEMENTS", data.achievements)}

        </div>
    `;

    alert("Your resume has been generated successfully!");
}


function downloadResume() {

    const preview = document.getElementById("resumePreview");

    if (!preview.querySelector(".resume-document")) {
        alert("Please generate your resume first!");
        return;
    }

    const printWindow = window.open("", "_blank");

    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>CareerMate Resume</title>

            <style>
                body {
                    font-family: Arial, sans-serif;
                    padding: 35px;
                    color: #292344;
                }

                .resume-header {
                    text-align: center;
                    border-bottom: 2px solid #6257e8;
                    padding-bottom: 15px;
                }

                .resume-header h1 {
                    font-size: 28px;
                    color: #29234d;
                }

                .resume-section h3,
                .preview-section h3 {
                    color: #6257e8;
                    border-bottom: 1px solid #ddd;
                    padding-bottom: 6px;
                    margin-top: 22px;
                }

                .preview-section p {
                    line-height: 1.6;
                    white-space: normal;
                }

                @media print {
                    body {
                        padding: 15px;
                    }
                }
            </style>
        </head>

        <body>
            ${preview.innerHTML}
        </body>
        </html>
    `);

    printWindow.document.close();

    printWindow.onload = function () {
        printWindow.focus();
        printWindow.print();
    };
}