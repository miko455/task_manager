// Fetch API
const API_URL = 'https://fly.io/apps/task-manager-gmp3gw';
let token = localStorage.getItem('token');

fetch('https://fly.io/apps/task-manager-gmp3gw')
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error(error));

// fetch('https://task-manager-gmp3gw.fly.dev')
// .then(response => response.json())
// .then(data => {
// console.log(data);
// // Update the UI with the received data
// })
// .catch(error => {
// console.error(error);
// // Display an error message to the user
// });

// Function to handle registration
async function register(event) {
    event.preventDefault();
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const firstName = document.getElementById('register-firstName').value;
    const lastName = document.getElementById('register-lastName').value;

    try {
        const response = await fetch(`${API_URL}/users/register`, {
            method: 'POST',
            headers:
{ 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password, firstName, lastName }),
        });
        const data = await response.json();
        if (response.ok) {
            alert('Registration successful. Please log in.');
        } else {
            throw new Error(data.message || 'Registration failed');
        }
    } catch (error) {
        alert(error.message);
    }
}

// Function to handle login
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
            document.getElementById('auth-container').style.display = 'none';
            document.getElementById('task-container').style.display = 'block';
            getTasks();
        } else {
            throw new Error(data.message || 'Login failed');
        }
    } catch (error) {
        alert(error.message);
    }
}

// Function to handle logout
function logout() {
    localStorage.removeItem('token');
    token = null;
    document.getElementById('auth-container').style.display = 'block';
    document.getElementById('task-container').style.display = 'none';
}

// Function to fetch all tasks
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
            headers: { 'Authorization': `Bearer ${token}` },
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

// Function to create a task element
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

// Function to add a new task
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
                'Authorization': `Bearer ${token}`,
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

// Function to update a task's status
async function updateTaskStatus(id, currentStatus) {
    const newStatus = currentStatus === 'To Do' ? 'In Progress' : 
                      currentStatus === 'In Progress' ? 'Done' : 'To Do';
    try {
        const response = await fetch(`${API_URL}/tasks/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
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

// Function to delete a task
async function deleteTask(id) {
    try {
        const response = await fetch(`${API_URL}/tasks/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) {
            throw new Error('Failed to delete task');
        }
        getTasks();
    } catch (error) {
        alert(error.message);
    }
}

// Event listeners
document.getElementById('register-form').addEventListener('submit', register);
document.getElementById('login-form').addEventListener('submit', login);
document.getElementById('logout-btn').addEventListener('click', logout);
document.getElementById('task-form').addEventListener('submit', addTask);
document.getElementById('apply-filters').addEventListener('click', getTasks);

// Check if user is already logged in
if (token) {
    document.getElementById('auth-container').style.display = 'none';
    document.getElementById('task-container').style.display = 'block';
    getTasks();
}

