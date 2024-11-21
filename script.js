// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyB0cx-i5QdifQwK3WUIlzx_TG2bxC8Ys6A",
    authDomain: "http://ssmm-app.firebaseapp.com",
    databaseURL: "YOUR_DATABASE_URL",
    projectId: "ssmm-app",
    storageBucket: "http://ssmm-app.firebasestorage.app",
    messagingSenderId: "1054335387793",
    appId: "1:1054335387793:web: 4619e0db13c11d8dd09730",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const auth = firebase.auth();

// Login System
const loginSection = document.getElementById("login-section");
const appSection = document.getElementById("app-section");
const loginBtn = document.getElementById("loginBtn");
const loginError = document.getElementById("loginError");

let currentUser = null;

loginBtn.addEventListener("click", () => {
    const loginId = document.getElementById("loginId").value.trim();
    const password = document.getElementById("password").value.trim();

    db.ref(users/${loginId}).once("value", (snapshot) => {
        const user = snapshot.val();
        if (user && user.password === password) {
            currentUser = user.name;
            loginSection.classList.add("hidden");
            appSection.classList.remove("hidden");
        } else {
            loginError.textContent = "Invalid ID or Password!";
        }
    });
});

// Add Record to Firebase
document.getElementById("collectionForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const amount = parseFloat(document.getElementById("amount").value);
    const lane = parseInt(document.getElementById("lane").value);
    const date = new Date().toLocaleDateString();

    db.ref("records").push({ name, amount, lane, date, addedBy: currentUser });
    document.getElementById("collectionForm").reset();
});

// Fetch Records
db.ref("records").on("value", (snapshot) => {
    const recordsTable = document.getElementById("recordsTable").querySelector("tbody");
    const records = snapshot.val();
    recordsTable.innerHTML = "";

    for (const key in records) {
        const record = records[key];
        const row = recordsTable.insertRow();
        row.insertCell(0).textContent = record.name;
        row.insertCell(1).textContent = record.amount;
        row.insertCell(2).textContent = record.lane;
        row.insertCell(3).textContent = record.date;
        row.insertCell(4).textContent = record.addedBy || "Unknown";

        const actionsCell = row.insertCell(5);
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = () => db.ref(records/${key}).remove();
        actionsCell.appendChild(deleteBtn);
    }
});

// Add Chart Logic Here (Reuse existing chart code).

// Edit Record
function editRecord(recordId, record) {
    document.getElementById("name").value = record.name;
    document.getElementById("amount").value = record.amount;
    document.getElementById("lane").value = record.lane;
    db.ref(records/${recordId}).remove();
}

// Delete Record
function deleteRecord(recordId) {
    db.ref(records/${recordId}).remove();
}

// Update Chart
function updateChart() {
    db.ref("records").once("value", (snapshot) => {
        const records = snapshot.val();
        const laneTotals = {};

        for (const key in records) {
            const record = records[key];
            laneTotals[record.lane] = (laneTotals[record.lane] || 0) + record.amount;
        }

        const lanes = Object.keys(laneTotals);
        const totals = Object.values(laneTotals);

        const ctx = collectionChart.getContext("2d");
        new Chart(ctx, {
            type: "bar",
            data: {
                labels: lanes.map((l) => Lane ${l}),
                datasets: [
                    {
                        label: "Total Collection (Rs)",
                        data: totals,
                        backgroundColor: "rgba(0, 123, 255, 0.5)",
                        borderColor: "rgba(0, 123, 255, 1)",
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true },
                },
            },
        });
    });
}

// Export Records
exportRecordsBtn.addEventListener("click", () => {
    alert("Export functionality to be added as per backend integration.");
});