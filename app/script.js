const form = document.getElementById("expenseForm");
const list = document.getElementById("expenseList");
const search = document.getElementById("search");
const chips = document.getElementById("chips");
const summary = document.getElementById("summary");
const totalAmount = document.getElementById("totalAmount");

const categories = ["All", "Food", "Transport", "Utilities", "Academic"];

const defaultExpenses = [
    { id: 1, title: "Hostel Mess Lunch", category: "Food", amount: 450, date: "2026-10-18", notes: "Weekly mess coupon" },
    { id: 2, title: "Metro Smart Card Recharge", category: "Transport", amount: 600, date: "2026-10-19", notes: "Monthly commute pass" },
    { id: 3, title: "Fiber Broadband Bill", category: "Utilities", amount: 750, date: "2026-10-20", notes: "Lab internet connection" },
    { id: 4, title: "Java Testing Reference Book", category: "Academic", amount: 850, date: "2026-10-21", notes: "TestNG & Selenium guide" }
];

let expenses = JSON.parse(localStorage.getItem("expenseTrackerItems")) || defaultExpenses;
let activeCategory = "All";
let editingId = null;

function saveExpenses() {
    localStorage.setItem("expenseTrackerItems", JSON.stringify(expenses));
}

form.addEventListener("submit", function (event) {
    event.preventDefault();
    const expense = {
        id: editingId || Date.now(),
        title: document.getElementById("title").value.trim(),
        category: document.getElementById("category").value,
        amount: Number(document.getElementById("amount").value),
        date: document.getElementById("date").value,
        notes: document.getElementById("notes").value.trim()
    };

    if (editingId) {
        expenses = expenses.map(function (x) { return x.id === editingId ? expense : x; });
        editingId = null;
        document.getElementById("saveBtn").textContent = "Save expense";
    } else {
        expenses.push(expense);
    }

    saveExpenses();
    renderExpenses();
    form.reset();
});

function renderChips() {
    chips.innerHTML = "";
    categories.forEach(function (cat) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "chip" + (cat === activeCategory ? " active" : "");
        btn.textContent = cat;
        btn.onclick = function () {
            activeCategory = cat;
            renderChips();
            renderExpenses();
        };
        chips.appendChild(btn);
    });
}

function renderExpenses() {
    const q = search.value.toLowerCase();
    const filtered = expenses.filter(function (item) {
        const matchCat = activeCategory === "All" || item.category === activeCategory;
        const matchSearch = item.title.toLowerCase().includes(q) || item.notes.toLowerCase().includes(q);
        return matchCat && matchSearch;
    });

    const total = filtered.reduce(function (sum, item) { return sum + item.amount; }, 0);
    summary.textContent = filtered.length + " of " + expenses.length + " expenses shown";
    totalAmount.textContent = "Total: Rs. " + total;

    list.innerHTML = "";
    filtered.forEach(function (item) {
        const tr = document.createElement("tr");
        tr.innerHTML =
            '<td>' + item.date + '</td>' +
            '<td><strong>' + item.title + '</strong></td>' +
            '<td><span class="tag">' + item.category + '</span></td>' +
            '<td>' + item.notes + '</td>' +
            '<td class="amt-cell">Rs. ' + item.amount + '</td>' +
            '<td>' +
            '<button class="btn-sm" onclick="editExpense(' + item.id + ')">Edit</button>' +
            '<button class="btn-sm del" onclick="deleteExpense(' + item.id + ')">Delete</button>' +
            '</td>';
        list.appendChild(tr);
    });
}

window.editExpense = function (id) {
    const item = expenses.find(function (x) { return x.id === id; });
    if (!item) return;
    document.getElementById("title").value = item.title;
    document.getElementById("category").value = item.category;
    document.getElementById("amount").value = item.amount;
    document.getElementById("date").value = item.date;
    document.getElementById("notes").value = item.notes;
    editingId = id;
    document.getElementById("saveBtn").textContent = "Update expense";
};

window.deleteExpense = function (id) {
    expenses = expenses.filter(function (x) { return x.id !== id; });
    saveExpenses();
    renderExpenses();
};

search.addEventListener("input", renderExpenses);
renderChips();
renderExpenses();
