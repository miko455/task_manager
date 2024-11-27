import React, { useState } from 'react';
import { getApiUrl, getHeaders } from '../config/api';

function TaskForm({ isAuthenticated, onTaskAdded }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [status, setStatus] = useState('To Do');
  const [deadline, setDeadline] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(getApiUrl('/tasks'), {
        method: 'POST',
        headers: getHeaders(isAuthenticated),
        body: JSON.stringify({ title, description, priority, status, deadline }),
      });

      if (!response.ok) {
        throw new Error('Failed to add task');
      }

      const newTask = await response.json();
      onTaskAdded(newTask);
      setTitle('');
      setDescription('');
      setPriority('Medium');
      setStatus('To Do');
      setDeadline('');
    } catch (error) {
      setError('Failed to add task. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <h2>Add New Task</h2>
      {error && <div className="error-message">{error}</div>}
      <input
        type="text"
        placeholder="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Task Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>
      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="To Do">To Do</option>
        <option value="In Progress">In Progress</option>
        <option value="Done">Done</option>
      </select>
      <input
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
      />
      <button type="submit">Add Task</button>
    </form>
  );
}

export default TaskForm;

