import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../other/AuthContext';
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer } from 'recharts';
import { format, subDays, isValid, parseISO } from 'date-fns';
import { useTranslation } from 'react-i18next';

function DashboardPage() {
  const BACKEND_URL_API = process.env.REACT_APP_AUTH_URL;
  const { t } = useTranslation(); 
  const { auth } = useAuth();
  const [tasks, setTasks] = useState([]);

  const fetchTasks = useCallback(async () => {
    try {
      const response = await fetch(`${BACKEND_URL_API}/api/tasks`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const fetchedTasks = await response.json();
      setTasks(fetchedTasks);
    } catch (error) {
      console.error('Failed to fetch tasks:', error.message);
    }
  }, [BACKEND_URL_API]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const totalTasks = tasks.length;

  const today = format(new Date(), 'yyyy-MM-dd');
  const tasksCreatedToday = tasks.filter(task => {
    if (!task.createdAt) return false;
    const createdAt = parseISO(task.createdAt);
    return isValid(createdAt) && format(createdAt, 'yyyy-MM-dd') === today;
  }).length;

  const openedTasks = tasks.filter(task => task.completionStatus !== 'Completed').length;

  const completedTasks = tasks.filter(task => task.completionStatus === 'Completed').length;

  const last30Days = Array.from({ length: 30 }).map((_, i) => format(subDays(new Date(), i), 'yyyy-MM-dd')).reverse();

  const tasksCreatedLast30Days = last30Days.map(date => ({
    date,
    created: tasks.filter(task => {
      if (!task.createdAt) return false;
      const createdAt = parseISO(task.createdAt);
      return isValid(createdAt) && format(createdAt, 'yyyy-MM-dd') === date;
    }).length,
    completed: tasks.filter(task => {
      if (!task.solvedAt) return false;
      const solvedAt = parseISO(task.solvedAt);
      return isValid(solvedAt) && format(solvedAt, 'yyyy-MM-dd') === date;
    }).length,
  }));

  return (
    <div className="dashboard">
      <h1>{t('Hello')} {auth.user.firstName}!</h1>
      <div className="dashboard-stats">
        <div className="stat-item">
          <h2>{t('Total Tasks')}</h2>
          <p>{totalTasks}</p>
        </div>
        <div className="stat-item">
          <h2>{t('Tasks Created Today')}</h2>
          <p>{tasksCreatedToday}</p>
        </div>
        <div className="stat-item">
          <h2>{t('Incompleted Tasks')}</h2>
          <p>{openedTasks}</p>
        </div>
        <div className="stat-item">
          <h2>{t('Completed Tasks')}</h2>
          <p>{completedTasks}</p>
        </div>
      </div>
      <div className="line-chart-container">
        <h2 className="line-chart-title">{t('Tasks Created and Completed in the Last 30 Days')}</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={tasksCreatedLast30Days}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="created" stroke="#8884d8" name={t('Created')} />
            <Line type="monotone" dataKey="completed" stroke="#82ca9d" name={t('Completed')} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default DashboardPage;
