import React, { useState, useEffect } from 'react';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState({
    priority: '',
    status: '',
    search: '',
  });

  useEffect(() => {
    fetchTasks();
  }, [filter]);

  const fetchTasks = async () => {
    try {
      const queryParams = new URLSearchParams(filter).toString();
      const response = await fetch(`/api/tasks?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      } else {
        throw new Error('Failed to fetch tasks');
      }
    } catch (error) {
      alert('An error occurred while fetching tasks.');
    }
  };

  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const handleStatusUpdate = async (id, currentStatus) => {
    const newStatus = currentStatus === 'To Do' ? 'In Progress' : 
                      currentStatus === 'In Progress' ? 'Done' : 'To Do';
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        fetchTasks();
      } else {
        throw new Error('Failed to update task');
      }
    } catch (error) {
      alert('An error occurred while updating the task.');
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        fetchTasks();
      } else {
        throw new Error('Failed to delete task');
      }
    } catch (error) {
      alert('An error occurred while deleting the task.');
    }
  };

  return (
    <div className="task-list">
      <div className="filters">
        <select name="priority" onChange={handleFilterChange} value={filter.priority}>
          <option value="">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <select name="status" onChange={handleFilterChange} value={filter.status}>
          <option value="">All Statuses</option>
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
        <input
          type="text"
          name="search"
          placeholder="Search tasks"
          onChange={handleFilterChange}
          value={filter.search}
        />
      </div>
      {tasks.map((task) => (
        <div key={task._id} className="task">
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          <p>Priority: {task.priority}</p>
          <p>Status: {task.status}</p>
          <p>Deadline: {new Date(task.deadline).toLocaleDateString()}</p>
          <button onClick={() => handleStatusUpdate(task._id, task.status)}>
            Update Status
          </button>
          <button onClick={() => handleDelete(task._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default TaskList;

