import React from 'react';
import Task from './Task';

function TaskList({ tasks, onTaskClick }) {
  return (
    <div className="task-container">
      {tasks.map((task) => (
        <Task 
            key={task.id} 
            task={task} 
            onTaskClick={onTaskClick}  
        />
      ))}
    </div>
  );
}

export default TaskList;
