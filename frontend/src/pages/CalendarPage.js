import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import SidePanel from '../components/SidePanel';
import TaskCalendar from '../components/TaskCalendar';

function CalendarPage() {
    const BACKEND_URL_API = process.env.REACT_APP_AUTH_URL;
    const { t } = useTranslation(); 
    const [tasks, setTasks] = useState([]);
    const [sidePanelOpen, setSidePanelOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    const fetchTasks = useCallback(async () => {
        try {
            const response = await fetch(`${BACKEND_URL_API}/api/tasks`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (response.ok) {
                const data = await response.json();
                setTasks(data);
            } else {
                console.error(t('Failed to fetch tasks'));
            }
        } catch (error) {
            console.error(t('Failed to fetch tasks'), error);
        }
    }, [BACKEND_URL_API, t]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const openSidePanelForEdit = (task) => {
        setSelectedTask(task);
        setSidePanelOpen(true);
    };

    const handleSaveTask = async (taskData) => {
        const response = await fetch(`${BACKEND_URL_API}/api/tasks/${taskData.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(taskData)
        });

        if (response.ok) {
            const updatedTask = await response.json();
            setTasks(prevTasks => prevTasks.map(t => t.id === updatedTask.id ? { ...t, ...updatedTask } : t));
            setSidePanelOpen(false);
            setSelectedTask(null);
        } else {
            console.error(t('Failed to update task'), await response.json());
        }
    };

    const deleteTask = async (taskId) => {
        try {
            const response = await fetch(`${BACKEND_URL_API}/api/tasks/${taskId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json(); 
                throw new Error(`${t('Failed to delete task')} ${response.status}, ${errorData.message}`);
            }

            setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));
        } catch (error) {
            console.error(t('Failed to delete task'), error);
        }
    };

    const closeSidePanel = () => {
        setSidePanelOpen(false);
        setSelectedTask(null);
    };

    return (
        <div>
            <TaskCalendar 
                tasks={tasks}
                onEventClick={openSidePanelForEdit}
            />
            {sidePanelOpen && (
                <SidePanel 
                    isOpen={sidePanelOpen} 
                    closePanel={closeSidePanel} 
                    saveTask={handleSaveTask} 
                    task={selectedTask} 
                    setTasks={setTasks}
                    deleteTask={deleteTask}
                />
            )}
        </div>
    );
}

export default CalendarPage;
