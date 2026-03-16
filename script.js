// ==========================
// TOPIC DATABASE
// ==========================
const topicDatabase = {
    "AC Circuits": {
        summary: "AC circuits use alternating current where the direction of current changes periodically. They are used in power systems and household electricity.",
        difficulty: "Medium",
        time: "2 Hours",
        book: "Basic Electrical Engineering – VK Mehta",
        pdf: "AC-CIRCUIT.pdf",
        video: "https://youtu.be/eQNMh8h9wbA?si=e6cmGcI8NgOYuDUE"
    },
    "DC Circuits": {
        summary: "DC circuits use direct current where current flows only in one direction. Common examples include batteries and electronic circuits.",
        difficulty: "Easy",
        time: "1.5 Hours",
        book: "Electrical Technology – BL Theraja",
        pdf: "DC NETWORKS.pdf",
        video: "https://youtu.be/UtxZguC2OtE?si=8nrmlaMIFuD_sbc0"
    },
    "Kirchhoff Law": {
        summary: "Kirchhoff's laws help analyse complex electrical circuits. KCL deals with current at nodes and KVL deals with voltage around loops.",
        difficulty: "Medium",
        time: "2 Hours",
        book: "Engineering Circuit Analysis – Hayt",
        pdf: "Kirchoffs-law.pdf",
        video: "https://www.youtube.com/watch?v=7m1rC9mNq3A"
    },
    "Three-phase": {
        summary: "Three-phase system is an electrical power distribution method that uses three alternating currents, each set 120 degrees apart, to provide a consistent and balanced power supply.",
        difficulty: "Hard",
        time: "3 Hour",
        book: "Basic Electrical Engineering – VK Mehta",
        pdf: "Three-phase.pdf",
        video: "https://www.youtube.com/watch?v=8c0KfHhLh6k"
    }
};

const topicOrder = ["AC Circuits", "DC Circuits", "Kirchhoff Law", "Ohm Law"];

// ==========================
// DASHBOARD UTILITIES
// ==========================
function updateDashboard() {
    const completedTopics = document.querySelectorAll("#planList input:checked").length;
    document.getElementById("topicCount").textContent = completedTopics;

    const notes = Object.keys(localStorage).filter(key => key.startsWith("notes_"));
    document.getElementById("notesCount").textContent = notes.length;

    const tasks = document.querySelectorAll("#planList input");
    const percent = tasks.length ? Math.round((completedTopics / tasks.length) * 100) : 0;
    document.getElementById("planProgress").textContent = percent + '%';
}

// ==========================
// TOPIC GUIDANCE
// ==========================
const topicSelect = document.getElementById("topic");
topicSelect.addEventListener("change", showTopicInfo);

function showTopicInfo() {
    const topicName = topicSelect.value;
    if (topicName === "Select Topic") return;

    const data = topicDatabase[topicName];
    if (!data) return;

    document.getElementById("topicSummary").textContent = data.summary;
    document.getElementById("topicDifficulty").textContent = data.difficulty;
    document.getElementById("topicTime").textContent = data.time;
    document.getElementById("topicBook").textContent = data.book;

    const resources = document.getElementById("topicResources");
    resources.innerHTML = `
        <h3 style="margin-bottom: 1.5rem; color: white;">📚 Resources</h3>
        <a href="${data.pdf}" target="_blank" class="resource-link">
            <i class="fas fa-file-pdf"></i> Download Notes PDF
        </a>
        <a href="${data.video}" target="_blank" class="resource-link">
            <i class="fab fa-youtube"></i> Watch Video Lecture
        </a>
    `;

    localStorage.setItem("lastStudiedTopic", topicName);
    loadReminder();
}

// ==========================
// STUDY PLAN GENERATOR (Quick)
// ==========================
document.getElementById("generatePlan").addEventListener("click", () => {
    const course = document.getElementById("course").value;
    const subject = document.getElementById("subject").value;
    const topic = topicSelect.value;

    if (course === "Select Course" || subject === "Select Subject" || topic === "Select Topic") {
        document.getElementById("planOutput").innerHTML = '<div style="color: #ef4444;">Please select course, subject and topic.</div>';
        return;
    }

    document.getElementById("planOutput").innerHTML = `
        <div style="background: rgba(16, 185, 129, 0.2); padding: 1.5rem; border-radius: 12px; border: 1px solid rgba(16, 185, 129, 0.3);">
            <strong>📚 Study Plan Generated!</strong><br><br>
            Course: <strong>${course}</strong><br>
            Subject: <strong>${subject}</strong><br>
            Topic: <strong>${topic}</strong><br><br>
            <strong>Recommended Schedule:</strong><br>
            - Read theory (30 min)<br>
            - Watch video (20 min)<br>
            - Practice problems (40 min)<br>
            - Review notes (10 min)
        </div>
    `;
});

// ==========================
// EXAM STUDY PLAN GENERATOR
// ==========================
document.getElementById("generateStudyPlanBtn").addEventListener("click", generateStudyPlan);

function generateStudyPlan() {
    const totalTopics = parseInt(document.getElementById("topics").value);
    const examDate = document.getElementById("examDate").value;
    const suggestion = document.getElementById("suggestion");
    const planList = document.getElementById("planList");

    planList.innerHTML = "";
    if (!totalTopics || !examDate) {
        alert("Please enter topics and exam date");
        return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const exam = new Date(examDate);
    const diff = exam - today;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (days <= 0) {
        alert("Exam date must be in future");
        return;
    }

    const topicsPerDay = Math.ceil(totalTopics / days);
    suggestion.innerHTML = `
        <div style="background: rgba(99, 102, 241, 0.2); padding: 1.5rem; border-radius: 12px; margin-top: 1rem; border: 1px solid rgba(99, 102, 241, 0.3);">
            🎯 Recommended: Study <strong>${topicsPerDay}</strong> topics per day for ${days} days
        </div>
    `;

    let topicNumber = 1;
    for (let day = 1; day <= days && topicNumber <= totalTopics; day++) {
        let li = document.createElement("li");
        li.className = "plan-item";

        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.addEventListener("change", updateDashboard);

        li.appendChild(checkbox);

        let topicsToday = [];
        for (let j = 0; j < topicsPerDay && topicNumber <= totalTopics; j++) {
            topicsToday.push("Topic " + topicNumber);
            topicNumber++;
        }

        let text = document.createElement("span");
        text.innerHTML = `<strong>Day ${day}</strong> → ${topicsToday.join(", ")}`;
        li.appendChild(text);

        planList.appendChild(li);
    }

    updateDashboard();
    document.getElementById("daysLeft").textContent = `${days} days left`;
}
// ==========================
// NOTES SYSTEM (LocalStorage)
// ==========================
const notesInput = document.getElementById("notesInput");
const saveNotesBtn = document.getElementById("saveNotes");
const viewNotesBtn = document.getElementById("viewNotes");
const deleteNotesBtn = document.getElementById("deleteNotes");
const savedNotes = document.getElementById("savedNotes");

// Save notes
saveNotesBtn.addEventListener("click", () => {
    const topic = topicSelect.value;
    if (topic === "Select Topic") {
        alert("Please select a topic first");
        return;
    }
    const notes = notesInput.value.trim();
    if (!notes) {
        alert("Notes are empty!");
        return;
    }
    localStorage.setItem("notes_" + topic, notes);
    alert("✅ Notes saved successfully!");
    updateDashboard();
});

// View notes
viewNotesBtn.addEventListener("click", () => {
    const topic = topicSelect.value;
    if (topic === "Select Topic") {
        alert("Please select a topic first");
        return;
    }
    const saved = localStorage.getItem("notes_" + topic);
    if (saved) {
        savedNotes.textContent = saved;
        savedNotes.style.display = "block";
    } else {
        savedNotes.textContent = "No notes saved for this topic yet.";
        savedNotes.style.display = "block";
    }
});

// Delete notes
deleteNotesBtn.addEventListener("click", () => {
    const topic = topicSelect.value;
    if (topic === "Select Topic") {
        alert("Please select a topic first");
        return;
    }
    if (confirm("Delete notes for this topic?")) {
        localStorage.removeItem("notes_" + topic);
        notesInput.value = "";
        savedNotes.style.display = "none";
        alert("🗑️ Notes deleted!");
        updateDashboard();
    }
});

// Auto-load notes when topic changes
topicSelect.addEventListener("change", () => {
    const topic = topicSelect.value;
    const saved = localStorage.getItem("notes_" + topic);
    if (saved) {
        notesInput.value = saved;
    } else {
        notesInput.value = "";
    }
});
