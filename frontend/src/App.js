import React, { useState} from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import TaskPage from './pages/TaskPage';
import CalendarPage from './pages/CalendarPage';
import TablePage from './pages/TablePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import HistoryPage from './pages/HistoryPage';
import DashboardPage from './pages/DashboardPage';
import { AuthProvider, useAuth } from './other/AuthContext';
import PrivateRoute from './other/PrivateRoute';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './App.css';
import './styles/Login_SignUp.css';
import './styles/Dashboard.css';
import './styles/NavBar.css';
import './styles/SidePanel.css';
import './styles/Task.css';
import './styles/Calendar.css';
import './styles/History.css';

const AppContent = () => {
  const { auth } = useAuth();
  const [tasks, setTasks] = useState([]);

  const addTask = (task) => {
    setTasks([...tasks, task]);
  };

  const toggleStatus = (id, newStatus) => {
    setTasks(tasks.map((task) => {
      return task.id === id ? { ...task, status: newStatus } : task;
    }));
  };

  return (
    <div className="App">
      <NavBar />
      <Routes>
        <Route path="/" element={auth.isLoggedIn ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
        <Route path="/login" element={auth.isLoggedIn ? <Navigate to="/dashboard" /> : <LoginPage />} />
        <Route path="/signup" element={auth.isLoggedIn ? <Navigate to="/dashboard" /> : <SignUpPage />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<DashboardPage tasks={tasks} />} />
          <Route path="/list" element={<TablePage tasks={tasks} setTasks={setTasks} />} />
          <Route path="/tasks" element={<TaskPage tasks={tasks} addTask={addTask} toggleStatus={toggleStatus} setTasks={setTasks} />} />
          <Route path="/calendar" element={<CalendarPage tasks={tasks} setTasks={setTasks} />} />
          <Route path="/history" element={<HistoryPage />} />
        </Route>
      </Routes>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <DndProvider backend={HTML5Backend}>
        <Router>
          <AppContent />
        </Router>
      </DndProvider>
    </AuthProvider>
  );
}

export default App;
