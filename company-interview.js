const companies = [
    {
        name: "TCS",
        fullName: "Tata Consultancy Services",
        logo: "🏢",
        questions: 50,
        rounds: ["NQT / Aptitude", "Technical Interview", "Managerial Round", "HR Interview"]
    },
    {
        name: "Infosys",
        fullName: "Infosys Limited",
        logo: "💼",
        questions: 45,
        rounds: ["Online Assessment", "Technical Interview", "HR Interview"]
    },
    {
        name: "Wipro",
        fullName: "Wipro Limited",
        logo: "🌐",
        questions: 40,
        rounds: ["Aptitude Test", "Technical Interview", "Business Discussion", "HR"]
    },
    {
        name: "Accenture",
        fullName: "Accenture PLC",
        logo: "🚀",
        questions: 45,
        rounds: ["Cognitive Assessment", "Technical Assessment", "Communication Assessment", "Interview"]
    },
    {
        name: "Cognizant",
        fullName: "Cognizant Technology Solutions",
        logo: "💻",
        questions: 40,
        rounds: ["Aptitude", "Technical Assessment", "Technical Interview", "HR"]
    },
    {
        name: "Capgemini",
        fullName: "Capgemini Technology Services",
        logo: "⚡",
        questions: 40,
        rounds: ["Game-Based Aptitude", "Technical Test", "Technical Interview", "HR"]
    },
    {
        name: "Amazon",
        fullName: "Amazon",
        logo: "📦",
        questions: 50,
        rounds: ["Online Assessment", "Technical Interview", "Leadership Principles", "HR"]
    },
    {
        name: "Google",
        fullName: "Google",
        logo: "🔍",
        questions: 50,
        rounds: ["Online Assessment", "Technical Interviews", "Googleyness & Leadership"]
    }
];

const companyContainer = document.getElementById("companyContainer");

companyContainer.innerHTML = companies.map((company, index) => `
    <div class="company-card">
        <div class="company-icon">${company.logo}</div>
        <h2>${company.name}</h2>
        <p>${company.fullName}</p>
        <p>📚 ${company.questions}+ Practice Questions</p>
        <button onclick="showCompany(${index})">
            Explore Questions →
        </button>
    </div>
`).join("");

const questionBank = {

    TCS: {
        technical: [
            { q: "What is the difference between JDK, JRE and JVM?", a: "JDK is used for development, JRE provides the runtime environment, and JVM executes Java bytecode.", important: true },
            { q: "Explain normalization in DBMS.", a: "Normalization organizes database tables to reduce redundancy and improve data integrity.", important: true },
            { q: "What is the difference between an array and a linked list?", a: "Arrays use contiguous memory, while linked lists use nodes connected through pointers." }
        ],
        aptitude: [
            { q: "A train 120m long crosses a pole in 6 seconds. Find its speed.", a: "Speed = 120/6 = 20 m/s or 72 km/hr.", important: true },
            { q: "Find the next number: 3, 6, 12, 24, ?", a: "48. Each number is multiplied by 2." }
        ],
        hr: [
            { q: "Why do you want to join TCS?", a: "Discuss TCS's learning opportunities, global projects and career growth.", important: true },
            { q: "Are you comfortable working in different locations?", a: "Give an honest answer and explain your flexibility." }
        ]
    },

    Infosys: {
        technical: [
            { q: "What is a pointer in programming?", a: "A pointer is a variable that stores the memory address of another variable.", important: true },
            { q: "Explain the SDLC phases.", a: "Requirement analysis, planning, design, development, testing, deployment and maintenance." },
            { q: "What is the difference between SQL and NoSQL?", a: "SQL databases use structured tables; NoSQL databases support flexible data models." }
        ],
        aptitude: [
            { q: "A person buys an item for ₹800 and sells it for ₹1000. Find the profit percentage.", a: "Profit = 200. Profit percentage = 25%.", important: true },
            { q: "Find the average of the first five natural numbers.", a: "Average = (1+2+3+4+5)/5 = 3." }
        ],
        hr: [
            { q: "Why do you want to work at Infosys?", a: "Talk about its technology services, learning culture and professional development." },
            { q: "How do you handle failure?", a: "Explain how you identify mistakes, learn from them and improve." }
        ]
    },

    Wipro: {
        technical: [
            { q: "What is the difference between process and thread?", a: "A process is an independent program in execution. A thread is a smaller execution unit within a process.", important: true },
            { q: "Explain primary key and foreign key.", a: "A primary key uniquely identifies a record. A foreign key links records between tables." },
            { q: "What is exception handling?", a: "It is a mechanism for handling runtime errors using constructs such as try, catch and finally." }
        ],
        aptitude: [
            { q: "If 5 workers complete a task in 10 days, how many days will 10 workers take?", a: "5 days, assuming equal work efficiency.", important: true },
            { q: "Find the missing number: 5, 10, 20, 40, ?", a: "80. Each number is doubled." }
        ],
        hr: [
            { q: "Why Wipro?", a: "Explain your interest in Wipro's technology services and opportunities to develop your skills." },
            { q: "How do you manage multiple deadlines?", a: "Prioritize tasks, create a schedule and track progress." }
        ]
    },

    Accenture: {
        technical: [
            { q: "What is cloud computing?", a: "Cloud computing provides computing services such as storage, servers and databases over the internet.", important: true },
            { q: "What is an API?", a: "An API allows different software applications to communicate with each other." },
            { q: "What is Agile methodology?", a: "Agile is an iterative software development approach involving collaboration and continuous delivery." }
        ],
        aptitude: [
            { q: "A product costs ₹1500 after a 25% discount. Find its original price.", a: "Original price = 1500/0.75 = ₹2000.", important: true },
            { q: "What is 15% of 600?", a: "90." }
        ],
        hr: [
            { q: "Why Accenture?", a: "Discuss its technology consulting work, innovation and opportunities to learn." },
            { q: "Describe a situation where you worked in a team.", a: "Explain the situation, your contribution and the result." }
        ]
    },

    Cognizant: {
        technical: [
            { q: "What is the difference between stack and queue?", a: "Stack follows LIFO, while queue follows FIFO.", important: true },
            { q: "What are joins in SQL?", a: "Joins combine rows from two or more tables using related columns." },
            { q: "What is object-oriented programming?", a: "OOP organizes programs around objects containing data and methods." }
        ],
        aptitude: [
            { q: "A car travels 240 km in 4 hours. Find its average speed.", a: "240/4 = 60 km/hr." },
            { q: "Find the simple interest on ₹5000 at 10% for 2 years.", a: "SI = (5000 × 10 × 2)/100 = ₹1000.", important: true }
        ],
        hr: [
            { q: "Why Cognizant?", a: "Explain your interest in its IT services, client projects and learning opportunities." },
            { q: "How quickly can you learn a new technology?", a: "Describe how you use documentation, practice and projects to learn." }
        ]
    },

    Capgemini: {
        technical: [
            { q: "What is the difference between compiler and interpreter?", a: "A compiler translates a program before execution; an interpreter executes instructions during runtime.", important: true },
            { q: "What is an operating system?", a: "An operating system manages hardware, software resources and processes." },
            { q: "Explain polymorphism with an example.", a: "Polymorphism allows the same interface or method name to represent different behaviours." }
        ],
        aptitude: [
            { q: "If the ratio of two numbers is 2:3 and their sum is 50, find the numbers.", a: "20 and 30.", important: true },
            { q: "Find 30% of 450.", a: "135." }
        ],
        hr: [
            { q: "Why do you want to join Capgemini?", a: "Discuss its technology projects, collaborative culture and career opportunities." },
            { q: "What motivates you?", a: "Talk about learning, solving problems and achieving meaningful goals." }
        ]
    },

    Amazon: {
        technical: [
            { q: "Explain the time complexity of binary search.", a: "O(log n), because the search space is halved at every step.", important: true },
            { q: "What is a hash table?", a: "A data structure that stores key-value pairs using a hash function." },
            { q: "How would you detect a cycle in a linked list?", a: "Use Floyd's slow and fast pointer algorithm." }
        ],
        aptitude: [
            { q: "Find the missing number: 1, 4, 9, 16, ?", a: "25. These are consecutive perfect squares.", important: true },
            { q: "A shop offers 20% discount on ₹2500. Find the selling price.", a: "₹2000." }
        ],
        hr: [
            { q: "Which Amazon Leadership Principle do you relate to most?", a: "Choose a principle such as Customer Obsession or Ownership and explain with an example.", important: true },
            { q: "Tell me about a time you solved a difficult problem.", a: "Explain the situation, your actions and the measurable result." }
        ]
    },

    Google: {
        technical: [
            { q: "How would you find duplicates in an array?", a: "Use a hash set to track previously visited elements.", important: true },
            { q: "What is the difference between BFS and DFS?", a: "BFS explores level by level using a queue; DFS explores deeply using recursion or a stack." },
            { q: "Explain Big O notation.", a: "Big O describes how an algorithm's time or space requirements grow with input size." }
        ],
        aptitude: [
            { q: "You have 8 balls and one is heavier. How can you find it using two weighings?", a: "Divide into groups of 3, 3 and 2. Weigh two groups of 3. If equal, weigh the remaining two balls; otherwise weigh two balls from the heavier group.", important: true },
            { q: "Find the next number: 1, 1, 2, 3, 5, 8, ?", a: "13. This is the Fibonacci sequence." }
        ],
        hr: [
            { q: "Why Google?", a: "Discuss your interest in solving large-scale problems, innovation and Google's products." },
            { q: "Tell me about a project you are proud of.", a: "Explain the problem, technologies used, your contribution and outcome.", important: true }
        ]
    }
};

function showCompany(index) {
    const company = companies[index];
    selectedCompany = company.name;

    document.getElementById("companyDetails").innerHTML = `
        <h2>${company.logo} ${company.name} Interview Preparation</h2>
        <p>${company.fullName}</p>

        <h3>Interview Rounds</h3>

        <div class="round-list">
            ${company.rounds.map((round, i) => `
                <div class="round-item">
                    <span>Round ${i + 1}</span>
                    <strong>${round}</strong>
                </div>
            `).join("")}
        </div>

        <h3 class="question-heading">📚 Practice Question Bank</h3>

        <div class="question-tabs">
            <button onclick="showQuestions('technical')">Technical</button>
            <button onclick="showQuestions('aptitude')">Aptitude</button>
            <button onclick="showQuestions('hr')">HR Questions</button>
        </div>

        <div id="questionsContainer"></div>
    `;

    document.getElementById("companyDetails").scrollIntoView({
        behavior: "smooth"
    });

    showQuestions("technical");
}

function showQuestions(category) {

    const questions = questionBank[selectedCompany][category];

    const container = document.getElementById("questionsContainer");

    container.innerHTML = questions.map((item, index) => `
        <div class="question-card">

            <h4>
                ${index + 1}. ${item.q}
                ${item.important ? '<span class="important">⭐ Important</span>' : ''}
            </h4>

            <button class="answer-btn"
                onclick="toggleAnswer(${index}, '${category}')">
                Show Answer
            </button>

            <p class="answer-text"
                id="answer-${category}-${index}"
                style="display:none;">
                ${item.a}
            </p>

            <label class="completed-label">
                <input type="checkbox"
                    onchange="updateCompleted(this)">
                Mark as Completed
            </label>

        </div>
    `).join("");
}

function toggleAnswer(index, category) {
    const answer = document.getElementById(
        `answer-${category}-${index}`
    );

    answer.style.display =
        answer.style.display === "none" ? "block" : "none";
}

function updateCompleted(checkbox) {
    const card = checkbox.closest(".question-card");

    card.classList.toggle("question-completed", checkbox.checked);
}