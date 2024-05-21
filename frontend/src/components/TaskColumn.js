import React from 'react';
import { useDrop } from 'react-dnd';
import Task from './Task';
import { useTranslation } from 'react-i18next';

function TaskColumn({ status, tasks, setTasks, onTaskClick, onAddTask, saveTask }) {
    const { t } = useTranslation();
    const [, drop] = useDrop({
        accept: "TASK",
        drop: (item, monitor) => {
            if (monitor.didDrop()) {
                return; 
            }
            moveTaskToStatus(item.id, status);
        },
    });

    const moveTaskToStatus = (taskId, newStatus) => {
        const task = tasks.find(t => t.id === taskId);
        if (task.progressStatus !== newStatus) {
            const updatedTask = { ...task, progressStatus: newStatus };
            saveTask(updatedTask);
        }
    };

    return (
        <div ref={drop} className="task-column">
            <h3>{t(status)}</h3>
            {tasks.filter(task => task.progressStatus === status).map(task => (
                <Task key={task.id} task={task} onTaskClick={onTaskClick} />
            ))}
            <button className='AddTaskButton' onClick={() => onAddTask(status)}>{t('Add Task')}</button>
        </div>
    );
}

export default TaskColumn;
