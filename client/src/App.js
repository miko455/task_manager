import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
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
          {isAuthenticated && <button onClick={handleLogout}>Logout</button>}
        </header>
        <main>
          <Switch>
            <Route path="/login">
              {isAuthenticated ? <Redirect to="/" /> : <Login setIsAuthenticated={setIsAuthenticated} />}
            </Route>
            <Route path="/register">
              {isAuthenticated ? <Redirect to="/" /> : <Register />}
            </Route>
            <Route path="/" exact>
              {isAuthenticated ? (
                <>
                  <TaskForm />
                  <TaskList />
                </>
              ) : (
                <Redirect to="/login" />
              )}
            </Route>
          </Switch>
        </main>
      </div>
    </Router>
  );
}

export default App;

