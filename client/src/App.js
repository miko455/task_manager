import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import Login from './components/Login';
import Register from './components/Register';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthForms, setShowAuthForms] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <div className="header-left">
            <h1>Task Manager</h1>
          </div>
          <div className="header-right">
            {isAuthenticated ? (
              <button onClick={handleLogout}>Logout</button>
            ) : (
              <button onClick={() => setShowAuthForms(!showAuthForms)}>
                {showAuthForms ? 'Hide Login/Register' : 'Login/Register'}
              </button>
            )}
          </div>
        </header>
        <main>
          <div className="content">
            <TaskForm isAuthenticated={isAuthenticated} />
            <TaskList isAuthenticated={isAuthenticated} />
          </div>
          {showAuthForms && !isAuthenticated && (
            <div className="auth-forms">
              <Login setIsAuthenticated={setIsAuthenticated} />
              <Register />
            </div>
          )}
        </main>
      </div>
    </Router>
  );
}

export default App;

