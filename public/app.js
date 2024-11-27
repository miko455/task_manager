const API_URL = 'https://task-manager-gmp3gw.fly.dev';
let token = localStorage.getItem('token');

function renderApp() {
    const appContainer = document.getElementById('app-container');
    appContainer.innerHTML = `
        <div id="auth-buttons">
            ${token ? '<button id="logout-btn">Logout</button>' : '<button id="login-register-btn">Login/Register</button>'}
        </div>
        <div id="auth-forms" style="display: none;">
            <form id="login-form">
                <h2>Login</h2>
                <input type="text" id="login-username" placeholder="Username" required>
                <input type="password" id="login-password" placeholder="Password" required>
                <button type="submit">Login</button>
            </form>
            <form id="register-form">
                <h2>Register</h2>
                <input type="text" id="register-username" placeholder="Username" required>
                <input type="email" id="register-email" placeholder="Email" required>
                <input type="password" id="register-password" placeholder="Password" required>
                <button type="submit">Register</button>
            </form>
        </div>
        <form id="task-form">
            <input type="text" id="title" placeholder="Task Title" required>
            <textarea id="description" placeholder="Task Description"></textarea>
            <select id="priority">
                <option value="Low">Low</option>
                <option value="Medium" selected>Medium</option>
                <option value="High">High</option>
            </select>
            <select id="status">
                <option value="To Do" selected>To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
            </select>
            <input type="date" id="deadline">
            <button type="submit">Add Task</button>
        </form>
        <div id="filter-container">
            <select id="priority-filter">
                <option value="">All Priorities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
            </select>
            <select id="status-filter">
                <option value="">All Statuses</option>
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
            </select>
            <input type="date" id="due-date-filter">
            <input type="text" id="search" placeholder="Search tasks">
            <button id="apply-filters">Apply Filters</button>
        </div>
        <div id="task-list"></div>
    `;

    document.getElementById('task-form').addEventListener('submit', addTask);
    document.getElementById('apply-filters').addEventListener('click', getTasks);
    
    if (token) {
        document.getElementById('logout-btn').addEventListener('click', logout);
    } else {
        document.getElementById('login-register-btn').addEventListener('click', toggleAuthForms);
        document.getElementById('login-form').addEventListener('submit', login);
        document.getElementById('register-form').addEventListener('submit', register);
    }

    getTasks();
}

function toggleAuthForms() {
    const authForms = document.getElementById('auth-forms');
    authForms.style.display = authForms.style.display === 'none' ? 'block' : 'none';
}

async function register(event) {
    event.preventDefault();
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    try {
        const response = await fetch(`${API_URL}/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password }),
        });
        const data = await response.json();
        if (response.ok) {
            alert('Registration successful. Please log in.');
            toggleAuthForms();
        } else {
            throw new Error(data.message || 'Registration failed');
        }
    } catch (error) {
        alert(error.message);
    }
}

async function login(event) {
    event.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch(`${API_URL}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });
        const data = await response.json();
        if (response.ok) {
            token = data.token;
            localStorage.setItem('token', token);
            renderApp();
        } else {
            throw new Error(data.message || 'Login failed');
        }
    } catch (error) {
        alert(error.message);
    }
}

function logout() {
    localStorage.removeItem('token');
    token = null;
    renderApp();
}

async function addTask(event) {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const priority = document.getElementById('priority').value;
    const status = document.getElementById('status').value;
    const deadline = document.getElementById('deadline').value;

    try {
        const response = await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : '',
            },
            body: JSON.stringify({ title, description, priority, status, deadline }),
        });
        if (!response.ok) {
            throw new Error('Failed to add task');
        }
        getTasks();
        document.getElementById('task-form').reset();
    } catch (error) {
        alert(error.message);
    }
}

async function getTasks() {
    const priorityFilter = document.getElementById('priority-filter').value;
    const statusFilter = document.getElementById('status-filter').value;
    const dueDateFilter = document.getElementById('due-date-filter').value;
    const searchQuery = document.getElementById('search').value;

    let url = `${API_URL}/tasks?`;
    if (priorityFilter) url += `priority=${priorityFilter}&`;
    if (statusFilter) url += `status=${statusFilter}&`;
    if (dueDateFilter) url += `dueDate=${dueDateFilter}&`;
    if (searchQuery) url += `search=${searchQuery}`;

    try {
        const response = await fetch(url, {
            headers: { 'Authorization': token ? `Bearer ${token}` : '' },
        });
        if (!response.ok) {
            throw new Error('Failed to fetch tasks');
        }
        const tasks = await response.json();
        const taskList = document.getElementById('task-list');
        taskList.innerHTML = '';
        tasks.forEach(task => {
            const taskElement = createTaskElement(task);
            taskList.appendChild(taskElement);
        });
    } catch (error) {
        alert(error.message);
    }
}

function createTaskElement(task) {
    const taskElement = document.createElement('div');
    taskElement.classList.add('task');
    taskElement.innerHTML = `
        <h3>${task.title}</h3>
        <p>${task.description}</p>
        <p>Priority: ${task.priority}</p>
        <p>Status: ${task.status}</p>
        <p>Deadline: ${new Date(task.deadline).toLocaleDateString()}</p>
        <button onclick="updateTaskStatus('${task._id}', '${task.status}')">Update Status</button>
        <button onclick="deleteTask('${task._id}')">Delete</button>
    `;
    return taskElement;
}

async function updateTaskStatus(id, currentStatus) {
    const newStatus = currentStatus === 'To Do' ? 'In Progress' : 
                      currentStatus === 'In Progress' ? 'Done' : 'To Do';
    try {
        const response = await fetch(`${API_URL}/tasks/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : '',
            },
            body: JSON.stringify({ status: newStatus }),
        });
        if (!response.ok) {
            throw new Error('Failed to update task');
        }
        getTasks();
    } catch (error) {
        alert(error.message);
    }
}

async function deleteTask(id) {
    try {
        const response = await fetch(`${API_URL}/tasks/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': token ? `Bearer ${token}` : '' },
        });
        if (!response.ok) {
            throw new Error('Failed to delete task');
        }
        getTasks();
    } catch (error) {
        alert(error.message);
    }
}

// Initial render
renderApp();

