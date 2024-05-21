import React, { useState, useEffect } from 'react';
import SidePanel from '../components/SidePanel';
import TaskColumn from '../components/TaskColumn';

function TaskPage({ tasks, setTasks }) {
    const BACKEND_URL_API = process.env.REACT_APP_AUTH_URL;
    const [sidePanelOpen, setSidePanelOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    const openSidePanelForNewTask = (progressStatus) => {
        setSelectedTask({ progressStatus });
        setSidePanelOpen(true);
    };

    const openSidePanelForEdit = (task) => {
        setSelectedTask(task);
        setSidePanelOpen(true);
    };

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await fetch(`${BACKEND_URL_API}/api/tasks`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch tasks');
                }
                const data = await response.json();
                setTasks(data);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };

        fetchTasks();
    }, [setTasks, BACKEND_URL_API]);

    const handleSaveTask = async (taskData) => {
        const apiUrl = taskData.id ? `${BACKEND_URL_API}/api/tasks/${taskData.id}` : `${BACKEND_URL_API}/api/tasks`;
        const method = taskData.id ? 'PUT' : 'POST';
        try {
            const response = await fetch(apiUrl, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(taskData)
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save task');
            }
            const responseData = await response.json();
            if (method === 'POST') {
                setTasks(prevTasks => [...prevTasks, responseData]);
            } else {
                setTasks(prevTasks => prevTasks.map(t => t.id === responseData.id ? { ...responseData } : t));
            }
        } catch (error) {
            console.error('Failed to save task:', error.message);
        }
    };

    const completeTask = async (taskId, newStatus) => {
        try {
            const response = await fetch(`${BACKEND_URL_API}/api/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    completionStatus: newStatus,
                    solvedAt: newStatus === 'Completed' ? new Date() : null
                })
            });
            if (!response.ok) {
                throw new Error('Failed to update task');
            }
            const updatedTask = await response.json();
            setTasks(prevTasks => prevTasks.map(t => t.id === updatedTask.id ? updatedTask : t));
        } catch (error) {
            console.error('Failed to complete task:', error.message);
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
                throw new Error(`Failed to delete task with status: ${response.status}, ${errorData.message}`);
            }

            setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));
        } catch (error) {
            console.error('Failed to delete task:', error);
        }
    };

    const closeSidePanel = () => {
        setSidePanelOpen(false);
        setSelectedTask(null);
    };

    return (
        <div>
            <div className="task-container">
                {['To do', 'In Progress', 'Done'].map(progressStatus => (
                    <TaskColumn
                        key={progressStatus}
                        status={progressStatus}
                        tasks={tasks}
                        setTasks={setTasks}
                        onTaskClick={openSidePanelForEdit}
                        onAddTask={openSidePanelForNewTask}
                        saveTask={handleSaveTask}
                    />
                ))}
            </div>
            <SidePanel
                isOpen={sidePanelOpen}
                closePanel={closeSidePanel}
                saveTask={handleSaveTask}
                task={selectedTask}
                setTasks={setTasks}
                deleteTask={deleteTask}
                completeTask={completeTask}
            />
        </div>
    );
}

export default TaskPage;
