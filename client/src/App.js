import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import Login from './components/Login';
import Register from './components/Register';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
          <h1>Task Manager</h1>
          <nav>
            <Link to="/">Home</Link>
            {isAuthenticated ? (
              <button onClick={handleLogout}>Logout</button>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
              </>
            )}
          </nav>
        </header>
        <main>
          <Switch>
            <Route path="/" exact>
              <TaskForm isAuthenticated={isAuthenticated} />
              <TaskList isAuthenticated={isAuthenticated} />
            </Route>
            <Route path="/login">
              <Login setIsAuthenticated={setIsAuthenticated} />
            </Route>
            <Route path="/register">
              <Register />
            </Route>
          </Switch>
        </main>
      </div>
    </Router>
  );
}

export default App;

