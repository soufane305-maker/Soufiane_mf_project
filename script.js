/* ===== إدارة المهام ===== */
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const filterBtns = document.querySelectorAll('.filter-btn');
const totalTasksSpan = document.getElementById('totalTasks');
const completedTasksSpan = document.getElementById('completedTasks');
const pendingTasksSpan = document.getElementById('pendingTasks');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

// إضافة مهمة جديدة
addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === '') {
        alert('الرجاء إدخال مهمة!');
        return;
    }

    const task = {
        id: Date.now(),
        text: taskText,
        completed: false,
        date: new Date().toLocaleDateString('ar-SA')
    };

    tasks.push(task);
    saveTasks();
    taskInput.value = '';
    renderTasks();
    updateStats();
}

// حذف مهمة
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
    updateStats();
}

// إكمال مهمة
function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
        updateStats();
    }
}

// عرض المهام
function renderTasks() {
    taskList.innerHTML = '';

    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'completed') return task.completed;
        if (currentFilter === 'pending') return !task.completed;
        return true;
    });

    if (filteredTasks.length === 0) {
        taskList.innerHTML = '<li style="text-align: center; color: var(--text-secondary); padding: 2rem;">لا توجد مهام</li>';
        return;
    }

    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <span class="task-text">${task.text}</span>
            <div class="task-actions">
                <button class="task-btn task-complete-btn" onclick="toggleTask(${task.id})">
                    ${task.completed ? '↩️ إرجاع' : '✓ إكمال'}
                </button>
                <button class="task-btn task-delete-btn" onclick="deleteTask(${task.id})">🗑️ حذف</button>
            </div>
        `;
        taskList.appendChild(li);
    });
}

// حفظ المهام
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// تحديث الإحصائيات
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;

    totalTasksSpan.textContent = total;
    completedTasksSpan.textContent = completed;
    pendingTasksSpan.textContent = pending;
}

// تصفية المهام
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderTasks();
    });
});

// ===== إدارة المحاسبة المالية =====
const descriptionInput = document.getElementById('descriptionInput');
const amountInput = document.getElementById('amountInput');
const typeSelect = document.getElementById('typeSelect');
const categoryInput = document.getElementById('categoryInput');
const addTransactionBtn = document.getElementById('addTransactionBtn');
const transactionsList = document.getElementById('transactionsList');
const totalIncomeSpan = document.getElementById('totalIncome');
const totalExpenseSpan = document.getElementById('totalExpense');
const balanceSpan = document.getElementById('balance');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// إضافة عملية مالية
addTransactionBtn.addEventListener('click', addTransaction);

function addTransaction() {
    const description = descriptionInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const type = typeSelect.value;
    const category = categoryInput.value.trim();

    if (!description || !amount || !type || !category) {
        alert('الرجاء ملء جميع الحقول!');
        return;
    }

    if (amount <= 0) {
        alert('الرجاء إدخال مبلغ صحيح!');
        return;
    }

    const transaction = {
        id: Date.now(),
        description: description,
        amount: amount,
        type: type,
        category: category,
        date: new Date().toLocaleDateString('ar-SA')
    };

    transactions.push(transaction);
    saveTransactions();
    
    descriptionInput.value = '';
    amountInput.value = '';
    typeSelect.value = '';
    categoryInput.value = '';
    
    renderTransactions();
    updateFinancialStats();
}

// حذف عملية
function deleteTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    saveTransactions();
    renderTransactions();
    updateFinancialStats();
}

// عرض العمليات
function renderTransactions() {
    transactionsList.innerHTML = '';

    if (transactions.length === 0) {
        transactionsList.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--text-secondary);">لا توجد عمليات</td></tr>';
        return;
    }

    // ترتيب العمليات من الأحدث للأقدم
    const sortedTransactions = [...transactions].reverse();

    sortedTransactions.forEach(transaction => {
        const tr = document.createElement('tr');
        const amountClass = transaction.type === 'income' ? 'income' : 'expense';
        const amountSign = transaction.type === 'income' ? '+' : '-';
        
        tr.innerHTML = `
            <td>${transaction.description}</td>
            <td><span class="transaction-type ${transaction.type}">${transaction.type === 'income' ? 'دخل' : 'مصروف'}</span></td>
            <td>${transaction.category}</td>
            <td><span class="transaction-amount ${amountClass}">${amountSign}${transaction.amount.toFixed(2)} ر.س</span></td>
            <td>${transaction.date}</td>
            <td><button class="delete-transaction-btn" onclick="deleteTransaction(${transaction.id})">حذف</button></td>
        `;
        transactionsList.appendChild(tr);
    });
}

// حفظ العمليات
function saveTransactions() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// تحديث الإحصائيات المالية
function updateFinancialStats() {
    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const balance = totalIncome - totalExpense;

    totalIncomeSpan.textContent = totalIncome.toFixed(2) + ' ر.س';
    totalExpenseSpan.textContent = totalExpense.toFixed(2) + ' ر.س';
    
    balanceSpan.textContent = balance.toFixed(2) + ' ر.س';
    balanceSpan.parentElement.style.color = balance >= 0 ? 'var(--success-color)' : 'var(--danger-color)';
}

// ===== التنقل بين الأقسام =====
const navBtns = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('.section');

navBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // إزالة الـ active من جميع الأزرار والأقسام
        navBtns.forEach(b => b.classList.remove('active'));
        sections.forEach(s => s.classList.remove('active'));
        
        // إضافة الـ active للزر والقسم المختار
        btn.classList.add('active');
        const sectionId = btn.getAttribute('data-section');
        document.getElementById(sectionId).classList.add('active');
    });
});

// تعيين القسم الأول كـ active بشكل افتراضي
navBtns[0].classList.add('active');
sections[0].classList.add('active');

// ===== تحميل البيانات عند فتح الصفحة =====
window.addEventListener('load', () => {
    renderTasks();
    updateStats();
    renderTransactions();
    updateFinancialStats();
});

// ===== تأثيرات إضافية =====
// تأثير الموجة عند الضغط على الأزرار
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
    });
});
