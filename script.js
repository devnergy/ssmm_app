const loginForm = document.getElementById("login");
const loginUsername = document.getElementById("loginUsername");
const loginPassword = document.getElementById("loginPassword");
const loginError = document.getElementById("loginError");
const loginSection = document.getElementById("loginForm");
const collectionSection = document.getElementById("collectionSection");

const collectionForm = document.getElementById("collectionForm");
const recordsTable = document.getElementById("recordsTable").querySelector("tbody");
const downloadBtn = document.getElementById("downloadBtn");
const totalCollectionEl = document.getElementById("totalCollection");
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");
const weeklyInsightsEl = document.getElementById("weeklyInsights");

let records = [];
let totalCollection = 0;

// Hardcoded credentials
const USERNAME = "ssmm";
const PASSWORD = "ssmm1237";

// Login functionality
loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: loginUsername.value,
            password: loginPassword.value
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === "Login successful") {
            loginSection.style.display = "none";
            collectionSection.style.display = "block";
            fetchRecords(); // Fetch records after login
        } else {
            loginError.style.display = "block";
        }
    })
    .catch(error => {
        console.error("Error:", error);
    });
});

// Add a new record
collectionForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const amount = parseFloat(document.getElementById("amount").value);
    const lane = parseInt(document.getElementById("lane").value);
    const date = new Date().toLocaleDateString();

    // Validation
    if (!name || isNaN(amount) || isNaN(lane) || lane < 1 || lane > 10) {
        alert("Please enter valid data. Lane number must be between 1 and 10.");
        return;
    }

    // Send the record to the backend
    fetch('http://localhost:5000/add-record', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, amount, lane, date })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === "Record added successfully") {
            fetchRecords(); // Fetch updated records
        } else {
            alert("Failed to add record.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
    });
});

// Fetch all records from the backend
function fetchRecords() {
    fetch('http://localhost:5000/records')
    .then(response => response.json())
    .then(data => {
        records = data;
        updateRecordsTable();
        updateTotalCollection();
        updateWeeklyInsights();
    })
    .catch(error => {
        console.error("Error fetching records:", error);
    });
}

// Update records table
function updateRecordsTable() {
    recordsTable.innerHTML = "";
    records.forEach(record => {
        const row = recordsTable.insertRow();
        row.insertCell(0).textContent = record.name;
        row.insertCell(1).textContent = record.amount;
        row.insertCell(2).textContent = record.lane;
        row.insertCell(3).textContent = record.date;
    });
}

// Update total collection
function updateTotalCollection() {
    fetch('http://localhost:5000/total-collection')
    .then(response => response.json())
    .then(data => {
        totalCollection = data.total || 0;
        totalCollectionEl.textContent = totalCollection;
    })
    .catch(error => {
        console.error("Error fetching total collection:", error);
    });
}

// Search functionality
searchInput.addEventListener("input", function () {
    const query = searchInput.value.toLowerCase();
    const results = records.filter(record => record.name.toLowerCase().includes(query));
    searchResults.innerHTML = results
        .map(record => <li>${record.name} (${record.amount} Rs, Lane ${record.lane})</li>)
        .join("");
});

// Download records as Excel
downloadBtn.addEventListener("click", function () {
    const headers = ["Name", "Amount", "Lane", "Date"];
    const rows = records.map(r => [r.name, r.amount, r.lane, r.date]);

    let csvContent = "data:text/csv;charset=utf-8," 
        + [headers, ...rows].map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "SSMM_Collection_Records.csv");

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

// Weekly insights (just a placeholder for now)
function updateWeeklyInsights() {
    // Calculate weekly insights (Placeholder, update with real logic later)
    const insights = `
        <p>Total Collection this Week: ${totalCollection}</p>
    `;
    weeklyInsightsEl.innerHTML = insights;
}
