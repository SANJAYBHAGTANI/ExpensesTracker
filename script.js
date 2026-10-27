// local storage  AND WINDOW ONLOAD
let allTransactions = JSON.parse(localStorage.getItem("savedTransactions")) || [];
let UserNewBudget = JSON.parse(localStorage.getItem("savedUserNewBudget")) || [];

window.onload = function () {
    if (UserNewBudget.length > 0) {
        const latestBudget = UserNewBudget[UserNewBudget.length - 1];

        if (NewBudgetAmount) {
            NewBudgetAmount.innerText = `₹${latestBudget.NEW_BUDGET}`;
        }

        if (AsideBalanace) {
            AsideBalanace.innerText = `₹${latestBudget.NEW_BUDGET}`;
        }
    }
    const savedName = localStorage.getItem("savedUserName");
    const savedImage = localStorage.getItem("savedUserImage");

    if (savedName !== null) {
        userName.value = savedName;
    }

    if (savedImage) {
        userAvatar.src = savedImage;
    }

    renderTransactions(allTransactions);
};

const transactionTableBody = document.querySelector("#transactionTableBody");

function renderTransactions(transactionsArray) {
    transactionTableBody.innerHTML = "";

    if (transactionsArray.length === 0) {
        transactionTableBody.innerHTML = `<tr><td colspan="4" style="text-align: center; padding: 15px;">No transactions found!! </td></tr>`;
        return;
    }

    [...transactionsArray].reverse().forEach((txn, index) => {
        const row = document.createElement("tr");

        const isIncome = txn.TransctionType === "Income" || txn.TransctionType === "income";
        const amountSign = isIncome ? "+" : "-";
        const amountColor = isIncome ? "#22c55e" : "#ef4444"; 

        row.innerHTML = `
            <td>${txn.UserDescription}</td>
            <td>${txn.TransctrionCategory}</td>
            <td>${txn.TransctionDate}</td>
            <td class="amount-column" style="color: ${amountColor}; font-weight: 600;">
                ${amountSign}₹${txn.TransctionAmount}
            </td>
            <td>
                <button class="delete-btn" data-index="${index}" style="background: #ef4444; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Delete</button>
            </td>
        `;

        transactionTableBody.appendChild(row);
    });
    attachDeleteEvents();
}


function attachDeleteEvents() {
    const deleteButtons = document.querySelectorAll(".delete-btn");

    deleteButtons.forEach(button => {
        button.addEventListener("click", () => {
            const index = Number(button.dataset.index);

            allTransactions.splice(index, 1);
            localStorage.setItem(
                "savedTransactions",
                JSON.stringify(allTransactions)
            );

            renderTransactions(allTransactions);
        });
    });
}




// set budget button
const setBudgetBtn = document.querySelector("#setBudgetBtn");
const SetBudgetPannel = document.querySelector("#customModal");
const modalCancel = document.querySelector("#modalCancel");
const NewBudget = document.querySelector("#modalConfirm")
// const PureModal = document.querySelector(".modal")

// update input value
const modalInputAmount = document.querySelector("#modalInput");
const ModalMonth = document.querySelector("#ModalMonth");
const alertNewBudget = document.querySelector("#alertNewBudget");
const BudgetForm = document.querySelector(".BudgetForm");

// Asidepannel budget and dashbord Budget
const AsideBalanace = document.querySelector("#sidebarBalance");

const NewBudgetAmount = document.querySelector("#balanceAmount");

setBudgetBtn.addEventListener("click", (e) => {
    e.preventDefault()
    SetBudgetPannel.style.display = "block";
})

modalCancel.addEventListener("click",(e) => {
    e.preventDefault()
    SetBudgetPannel.style.display="none";
})

NewBudget.addEventListener("click",(e) => {
    e.preventDefault()

    const InputAmount = modalInputAmount.value;
    const InputMonth = ModalMonth.value.trim();

    if(InputAmount==""){
        alertNewBudget.innerText = "please sir... input NewBudget !!"
        setTimeout(() => {
            alertNewBudget.innerHTML = "";
        },2000);
        return;
    }

    const UserInputBudgetAll = {
        NEW_BUDGET : InputAmount,
        WHICH_MONTH : InputMonth
    }
    
    console.log(UserInputBudgetAll);
    NewBudgetAmount.innerText = `₹${InputAmount}`;
    AsideBalanace.innerText = `₹${InputAmount}`;
    BalanceAmount.innerText = `₹${InputAmount}`;

    UserNewBudget.push(UserInputBudgetAll);
    localStorage.setItem("savedUserNewBudget", JSON.stringify(UserNewBudget));

    alertNewBudget.innerText = "New Budget Added Successfully!!"
    setTimeout(() => {
            alertNewBudget.innerHTML = "";
            modalInputAmount.value="";
            SetBudgetPannel.style.display="none";
        },1000);

    

})
modalInputAmount.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        NewBudget.click(); 
    }
});

// set/Update button
const RefreshBtn = document.querySelector("#RefreshBtn");
const customModalRefresh = document.querySelector("#customModalRefresh");
const SecondModalConfirm = document.querySelector("#SecondModalConfirm");

RefreshBtn.addEventListener("click", (e) => {
    e.preventDefault()
    customModalRefresh.style.display = "block";
})

// All refresh Modal 
SecondModalConfirm.addEventListener("click", (e) => {
    e.preventDefault();

    const confirmClear = confirm(
        "Are you sure? All transactions and budget data will be deleted."
    );

    if (!confirmClear) return;

    allTransactions = [];
    localStorage.removeItem("savedTransactions");

    UserNewBudget = [];
    localStorage.removeItem("savedUserNewBudget");

    if (NewBudgetAmount) NewBudgetAmount.innerText = "₹ 00";
    if (AsideBalanace) AsideBalanace.innerText = "₹ 00";
    if (ExpenseAmount) ExpenseAmount.innerText = "₹0";
    if (BalanceAmount) BalanceAmount.innerText = "₹0";
    if (TransctionAmount) TransctionAmount.innerText = "0";

    renderTransactions(allTransactions);

    customModalRefresh.style.display = "none";

    alert("All data cleared successfully!");
});


// new task input all
const Description = document.querySelector("#transDesc");
const Amount = document.querySelector("#transAmount");
const Type = document.querySelector(".transType");
const Category = document.querySelector("#transCategory");
const Datee = document.querySelector("#TransDate");
const Time = document.querySelector("#TransTime");

const NewTaskButton = document.querySelector(".submit-btn");
const alertTaskForm = document.querySelector("#alertTaskForm");
const MoreTaskAdded = document.querySelector("#MoreTaskAdded");
const alerTaskPannel = document.querySelector("#alerTaskPannel");
const quickAddForm = document.querySelector("#quickAddForm");

// EXPENSE BALANCE TRANSCTION PANNEL BOX
const ExpenseAmount = document.querySelector("#expenseAmount");
const BalanceAmount = document.querySelector("#netBalanceAmount");
const TransctionAmount = document.querySelector("#transactionCount");

function updateDashboardData() {
    let totalIncome = 0;
    let totalExpense = 0;

    allTransactions.forEach(txn => {
        const type = String(txn.TransctionType).toLowerCase();
        const amount = Number(txn.TransctionAmount) || 0;

        if (type === "income") {
            totalIncome += amount;
        } else if (type === "expense") {
            totalExpense += amount;
        }
    });

    // Latest budget includes all added income
    const currentBudget = UserNewBudget.length > 0
        ? Number(UserNewBudget[UserNewBudget.length - 1].NEW_BUDGET) || 0
        : 0;

    // Available balance = current budget - expenses
    const netBalance = currentBudget - totalExpense;

    if (ExpenseAmount) {
        ExpenseAmount.innerText = `₹${totalExpense}`;
    }

    if (NewBudgetAmount) {
        NewBudgetAmount.innerText = `₹${currentBudget}`;
    }

    if (BalanceAmount) {
        BalanceAmount.innerText = `₹${netBalance}`;
    }

    if (AsideBalanace) {
        AsideBalanace.innerText = `₹${netBalance}`;
    }

    if (TransctionAmount) {
        TransctionAmount.innerText = allTransactions.length;
    }
}




window.addEventListener("load", () => {
    updateDashboardData();
});



NewTaskButton.addEventListener("click", (e) => {
    e.preventDefault();

    const DescriptionValue = Description.value.trim();
    const Amountvalue = Amount.value;
    const Typevalue = Type.value;
    const Categoryvalue = Category.value;
    const DateValue = Datee.value;
    const Timevalue = Time.value;

    // Validate required fields
    if (
        DescriptionValue === "" ||
        Amountvalue === "" ||
        Typevalue === "" ||
        Categoryvalue === "" ||
        DateValue === ""
    ) {
        alertTaskForm.innerText =
            "Please fill in all required fields!";

        setTimeout(() => {
            alertTaskForm.innerText = "";
        }, 2000);

        return;
    }

    const amountNumber = Number(Amountvalue);
    const transactionType = Typevalue.toLowerCase();

    // Validate amount
    if (!Number.isFinite(amountNumber) || amountNumber <= 0) {
        alertTaskForm.innerText =
            "Please enter a valid amount!";

        setTimeout(() => {
            alertTaskForm.innerText = "";
        }, 2000);

        return;
    }

    // Get current budget
    const currentBudget = UserNewBudget.length > 0
        ? Number(
            UserNewBudget[UserNewBudget.length - 1].NEW_BUDGET
        ) || 0
        : 0;

    // Calculate current expenses
    let totalExpense = 0;

    allTransactions.forEach(txn => {
        if (
            String(txn.TransctionType).toLowerCase() === "expense"
        ) {
            totalExpense += Number(txn.TransctionAmount) || 0;
        }
    });

    // Available balance before this transaction
    const availableBalance = currentBudget - totalExpense;

    // Validate expense
    if (transactionType === "expense") {

        // Budget not set
        if (currentBudget <= 0) {
            alert(
                "Aapka budget set nahi hai. Please sabse pehle budget add karo!"
            );
            return;
        }

        // Insufficient balance
        if (amountNumber > availableBalance) {
            alert(
                `Insufficient Balance!\n` +
                `Available Balance: ₹${Math.max(0, availableBalance)}\n` +
                `Please enter a lower expense amount.`
            );
            return;
        }
    }

    // Create transaction
    const NewTransctionData = {
        UserDescription: DescriptionValue,
        TransctionAmount: amountNumber,
        TransctionType: Typevalue,
        TransctrionCategory: Categoryvalue,
        TransctionDate: DateValue,
        TransctionTime: Timevalue
    };

    // Add income to budget
    if (transactionType === "income") {

        const updatedBudget = currentBudget + amountNumber;

        const newBudgetObj = {
            NEW_BUDGET: updatedBudget,
            WHICH_MONTH: "Current"
        };

        UserNewBudget.push(newBudgetObj);

        localStorage.setItem(
            "savedUserNewBudget",
            JSON.stringify(UserNewBudget)
        );
    }

    // Save transaction
    allTransactions.push(NewTransctionData);

    localStorage.setItem(
        "savedTransactions",
        JSON.stringify(allTransactions)
    );

    // Update dashboard, sidebar and transaction count
    updateDashboardData();
    updateExpenseBreakdown();

    // Success message
    alerTaskPannel.innerHTML =
        "Yeah! Transaction added successfully!";

    MoreTaskAdded.style.display = "block";

    setTimeout(() => {
        alerTaskPannel.innerHTML = "";
    }, 2500);

    // Reset form
    quickAddForm.reset();
});





// More Task Add PANNEL
const modalMore = document.querySelector("#modalMore");

modalMore.addEventListener("click", (e) => {
    e.preventDefault();

    MoreTaskAdded.style.display = "none";
    transactionPanel.style.display="block";
    NewTaskTab.classList.add("active");
    alertTaskForm.innerHTML = " yeah..Brothe add new Task !!";

    setTimeout(()=>{
            alertTaskForm.innerHTML = "";
        },2500);


});



// Click on Transction Tab
const transactionTab = document.querySelector("#transactionTab");
const dashboardTab = document.querySelector("#dashboardTab");
const incomeTab = document.querySelector("#incomeTab")
const expensesTab = document.querySelector("#expensesTab");
const NewTaskTab =document.querySelector("#NewTaskTab");

// area pannel
const summaryGrid = document.querySelector(".summary-grid")
const DashboardPannel = document.querySelector(".expense-panel");
const transactionPanel = document.querySelector(".transaction-panel")
const historyPanel = document.querySelector(".history-panel");


// Dashboard button
dashboardTab.addEventListener("click", (e) => {
    e.preventDefault();

    DashboardPannel.style.display = "block";
    transactionPanel.style.display = "none";
    historyPanel.style.display = "none";

    dashboardTab.classList.add("active");
    transactionTab.classList.remove("active");
    incomeTab.classList.remove("active");
    expensesTab.classList.remove("active");
    NewTaskTab.classList.remove("active");
});


// All Transactions button
transactionTab.addEventListener("click", (e) => {
    e.preventDefault();

    DashboardPannel.style.display = "none";
    transactionPanel.style.display = "none";
    historyPanel.style.display = "block";

    // Show all transactions
    renderTransactions(allTransactions);

    transactionTab.classList.add("active");
    dashboardTab.classList.remove("active");
    incomeTab.classList.remove("active");
    expensesTab.classList.remove("active");
    NewTaskTab.classList.remove("active");
});


// Income button
incomeTab.addEventListener("click", (e) => {
    e.preventDefault();

    DashboardPannel.style.display = "none";
    transactionPanel.style.display = "none";
    historyPanel.style.display = "block";

    // Only Income transactions
    const incomeTransactions = allTransactions.filter(txn =>
        txn.TransctionType.toLowerCase() === "income"
    );

    renderTransactions(incomeTransactions);

    incomeTab.classList.add("active");
    dashboardTab.classList.remove("active");
    transactionTab.classList.remove("active");
    expensesTab.classList.remove("active");
    NewTaskTab.classList.remove("active");
});

// Expenses button
expensesTab.addEventListener("click", (e) => {
    e.preventDefault();

    DashboardPannel.style.display = "none";
    transactionPanel.style.display = "none";
    historyPanel.style.display = "block";

    // Only Expense transactions
    const expenseTransactions = allTransactions.filter(txn =>
        txn.TransctionType.toLowerCase() === "expense"
    );

    renderTransactions(expenseTransactions);

    expensesTab.classList.add("active");
    dashboardTab.classList.remove("active");
    transactionTab.classList.remove("active");
    incomeTab.classList.remove("active");
    NewTaskTab.classList.remove("active");
});

// Add Task button
NewTaskTab.addEventListener("click", (e) => {
    e.preventDefault();

    transactionPanel.style.display = "block";
    DashboardPannel.style.display = "none";
    historyPanel.style.display = "none";

    NewTaskTab.classList.add("active");
    dashboardTab.classList.remove("active");
    transactionTab.classList.remove("active");
    incomeTab.classList.remove("active");
    expensesTab.classList.remove("active");
});





const userAvatar = document.querySelector("#userAvatar");
const userName = document.querySelector("#userName");
const imageUpload = document.querySelector("#imageUpload");


userName.addEventListener("input", () => {
    localStorage.setItem("savedUserName", userName.value);
});


imageUpload.addEventListener("change", (event) => {
    const file = event.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
        alert("Please select a valid image!");
        imageUpload.value = "";
        return;
    }

    if (file.size > 2 * 1024 * 1024) {
        alert("Brother, image size must be less than 2 MB!");
        imageUpload.value = "";
        return;
    }

    const reader = new FileReader();

    reader.onload = function () {
        try {
            const imageData = reader.result;

            localStorage.setItem("savedUserImage", imageData);

            userAvatar.src = imageData;

        } catch (error) {
            alert("Image save nahi hui. Please try a smaller image.");
        }
    };

    reader.readAsDataURL(file);
});


document.addEventListener("DOMContentLoaded", () => {
    const menuBtn = document.getElementById("mobileMenuBtn"); 
    const sidebar = document.getElementById("sidebar");
    
    let overlay = document.querySelector(".overlay");
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.className = "overlay";
        document.body.appendChild(overlay);
    }

    if (menuBtn && sidebar) {
        menuBtn.addEventListener("click", () => {
            sidebar.classList.toggle("open");
            overlay.classList.toggle("show");
        });

        // Close sidebar when clicking on overlay
        overlay.addEventListener("click", () => {
            sidebar.classList.remove("open");
            overlay.classList.remove("show");
        });

        // Close sidebar when clicking any navigation link on mobile
        const navLinks = sidebar.querySelectorAll(".nav-btn");
        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                if (window.innerWidth <= 1024) {
                    sidebar.classList.remove("open");
                    overlay.classList.remove("show");
                }
            });
        });
    }
});








/* ================================
   EXPENSE BREAKDOWN PIE CHART
================================ */

let expensePieChart = null;

const timeRangeSelect = document.getElementById("timeRangeSelect");
const chartArea = document.getElementById("chartArea");
const categoryList = document.getElementById("categoryList");

const chartColors = [
    "#8b5cf6",
    "#06b6d4",
    "#f59e0b",
    "#ef4444",
    "#22c55e",
    "#ec4899",
    "#64748b",
    "#14b8a6",
    "#f97316",
    "#6366f1"
];

// YYYY-MM-DD ko local date ki tarah parse karo
function parseTransactionDate(dateString) {
    if (!dateString) return null;

    const parts = String(dateString).split("-");

    if (parts.length === 3 && parts[0].length === 4) {
        const date = new Date(
            Number(parts[0]),
            Number(parts[1]) - 1,
            Number(parts[2])
        );

        return Number.isNaN(date.getTime()) ? null : date;
    }

    const date = new Date(dateString);

    return Number.isNaN(date.getTime()) ? null : date;
}

function isInSelectedRange(transactionDate, range, now) {
    if (!transactionDate) return false;

    const year = now.getFullYear();
    const month = now.getMonth();

    // Aaj ke din ke baad ka data include nahi karna
    const today = new Date(year, month, now.getDate());
    const date = new Date(
        transactionDate.getFullYear(),
        transactionDate.getMonth(),
        transactionDate.getDate()
    );

    if (date > today) return false;

    const currentMonthStart = new Date(year, month, 1);
    const nextMonthStart = new Date(year, month + 1, 1);

    switch (range) {
        case "This Month":
            return date >= currentMonthStart && date < nextMonthStart;

        case "Last Month": {
            const lastMonthStart = new Date(year, month - 1, 1);
            return date >= lastMonthStart && date < currentMonthStart;
        }

        case "Last 3 Month": {
            const start = new Date(year, month - 2, 1);
            return date >= start && date < nextMonthStart;
        }

        case "Last 6 Months": {
            const start = new Date(year, month - 5, 1);
            return date >= start && date < nextMonthStart;
        }

        case "This Year":
            return date >= new Date(year, 0, 1) &&
                   date < new Date(year + 1, 0, 1);

        case "All Time":
            return true;

        default:
            return date >= currentMonthStart && date < nextMonthStart;
    }
}



function updateExpenseBreakdown() {
    if (!chartArea || !categoryList || !timeRangeSelect) return;

    const selectedRange = timeRangeSelect.value;
    const now = new Date();

    // 1. Sirf Expense transactions select karo
    const filteredExpenses = allTransactions.filter(txn => {
        const type = String(txn.TransctionType || "")
            .trim()
            .toLowerCase();

        if (type !== "expense") return false;

        const transactionDate = parseTransactionDate(
            txn.TransctionDate
        );

        return isInSelectedRange(
            transactionDate,
            selectedRange,
            now
        );
    });

    // 2. Category-wise expense total nikalo
    const categoryTotals = {};

    filteredExpenses.forEach(txn => {
        const category = String(
            txn.TransctrionCategory || "Others"
        ).trim() || "Others";

        const amount = Number(txn.TransctionAmount) || 0;

        if (amount > 0) {
            categoryTotals[category] =
                (categoryTotals[category] || 0) + amount;
        }
    });

    // 3. Chart ka data
    const labels = Object.keys(categoryTotals);
    const values = Object.values(categoryTotals);

    const colors = labels.map(
        (_, index) => chartColors[index % chartColors.length]
    );

    // 4. Purana chart remove karo
    if (expensePieChart) {
        expensePieChart.destroy();
        expensePieChart = null;
    }

    chartArea.innerHTML = "";
    categoryList.innerHTML = "";

    // 5. Agar expense nahi mila
    if (labels.length === 0) {
        chartArea.innerHTML = `
            <div class="chart-placeholder">
                <span>📊</span>
                <p>No expenses found</p>
                <small>Selected period mein expense data nahi hai.</small>
            </div>
        `;

        categoryList.innerHTML = `
            <p class="empty-category">
                No category expenses available.
            </p>
        `;

        return;
    }

    // 6. Pie chart canvas
    const canvas = document.createElement("canvas");
    canvas.id = "expensePieChart";
    chartArea.appendChild(canvas);

    // 7. Har category ka alag pie slice
    expensePieChart = new Chart(canvas, {
        type: "pie",

        data: {
            labels: labels,

            datasets: [{
                label: "Category-wise Expenses",
                data: values,
                backgroundColor: colors,
                borderColor: "#ffffff",
                borderWidth: 2,
                hoverOffset: 8
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: {
                    display: true,
                    position: "bottom"
                },

                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const amount = Number(context.raw) || 0;
                            const total = values.reduce(
                                (sum, value) => sum + value,
                                0
                            );

                            const percentage = total > 0
                                ? ((amount / total) * 100).toFixed(1)
                                : "0.0";

                            return `${context.label}: ₹${amount.toLocaleString("en-IN")} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });

    // 8. Category list mein amounts show karo
    labels.forEach((category, index) => {
        const item = document.createElement("div");
        item.className = "category-item";

        const left = document.createElement("span");
        const dot = document.createElement("i");

        dot.className = "dot";
        dot.style.backgroundColor = colors[index];

        left.appendChild(dot);
        left.appendChild(
            document.createTextNode(" " + category)
        );

        const amountElement = document.createElement("strong");
        amountElement.textContent =
            "₹" + values[index].toLocaleString("en-IN");

        item.appendChild(left);
        item.appendChild(amountElement);

        categoryList.appendChild(item);
    });
}

// Dropdown change karne par chart update hoga
if (timeRangeSelect) {
    timeRangeSelect.addEventListener(
        "change",
        updateExpenseBreakdown
    );
}

// Page load par chart show hoga
updateExpenseBreakdown();



// Dropdown change hone par chart update karo
if (timeRangeSelect) {
    timeRangeSelect.addEventListener("change", updateExpenseBreakdown);
}

// Page load par chart show karo
updateExpenseBreakdown();