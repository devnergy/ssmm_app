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
loginForm.addEventListener("submit", function(e) {
    e.preventDefault();
    if (loginUsername.value === USERNAME && loginPassword.value === PASSWORD) {
        loginSection.style.display = "none";
        collectionSection.style.display = "block";
    } else {
        loginError.style.display = "block";
    }
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

    const record = { name, amount, lane, date };
    records.push(record);
    addRecordToTable(record);
    updateTotalCollection();
    updateWeeklyInsights();
    collectionForm.reset();
});

// Add a record to the table
function addRecordToTable(record) {
    const row = recordsTable.insertRow();
    row.insertCell(0).textContent = record.name;
    row.insertCell(1).textContent = record.amount;
    row.insertCell(2).textContent = record.lane;
    row.insertCell(3).textContent = record.date;
}

// Update total collection
function updateTotalCollection() {
    totalCollection = records.reduce((sum, record) => sum + record.amount, 0);
    totalCollectionEl.textContent = totalCollection;
}

// Update weekly insights
function updateWeeklyInsights() {
    const today = new Date();
    const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
    const weeklyRecords = records.filter(record => new Date(record.date) >= weekStart);

    let laneSummary = {};
    weeklyRecords.forEach(record => {
        laneSummary[record.lane] = (laneSummary[record.lane] || 0) + record.amount;
    });

    weeklyInsightsEl.innerHTML = `
        <li>Total Weekly Collection: ${weeklyRecords.reduce((sum, r) => sum + r.amount, 0)} Rs</li>
        <li>Average Collection per Day: ${(weeklyRecords.reduce((sum, r) => sum + r.amount, 0) / 7).toFixed(2)} Rs</li>
        ${Object.keys(laneSummary)
            .map(lane => <li>Lane ${lane}: ${laneSummary[lane]} Rs</li>)
            .join("")}
    `;
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
