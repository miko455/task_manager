import React, { useState, useEffect } from 'react';
import { getApiUrl, getHeaders } from '../config/api';

function TaskList({ isAuthenticated }) {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState({
    priority: '',
    status: '',
    search: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTasks();
  }, [filter, isAuthenticated]);

  const fetchTasks = async () => {
    try {
      const queryParams = new URLSearchParams(filter).toString();
      const response = await fetch(`${getApiUrl('/tasks')}?${queryParams}`, {
        headers: getHeaders(isAuthenticated),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      
      const data = await response.json();
      setTasks(data);
      setError('');
    } catch (error) {
      setError('Failed to fetch tasks. Please try again later.');
    }
  };

  const handleStatusUpdate = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'To Do' ? 'In Progress' : 
                       currentStatus === 'In Progress' ? 'Done' : 'To Do';
      
      const response = await fetch(getApiUrl(`/tasks/${id}`), {
        method: 'PUT',
        headers: getHeaders(isAuthenticated),
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update task');
      }
      
      fetchTasks();
      setError('');
    } catch (error) {
      setError('Failed to update task. Please try again later.');
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(getApiUrl(`/tasks/${id}`), {
        method: 'DELETE',
        headers: getHeaders(isAuthenticated),
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
      
      fetchTasks();
      setError('');
    } catch (error) {
      setError('Failed to delete task. Please try again later.');
    }
  };

  return (
    <div className="task-list">
      {error && <div className="error-message">{error}</div>}
      <div className="filters">
        <select name="priority" onChange={(e) => setFilter({ ...filter, priority: e.target.value })} value={filter.priority}>
          <option value="">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <select name="status" onChange={(e) => setFilter({ ...filter, status: e.target.value })} value={filter.status}>
          <option value="">All Statuses</option>
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
        <input
          type="text"
          name="search"
          placeholder="Search tasks"
          onChange={(e) => setFilter({ ...filter, search: e.target.value })}
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

