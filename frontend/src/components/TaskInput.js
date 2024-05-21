import React, { useState } from 'react';

function TaskInput({ addTask }) {
    const [input, setInput] = useState('');
  
    const handleSubmit = (e) => {
      e.preventDefault();
      if (!input) return;
      addTask({ text: input, status: 'To do' });
      setInput('');
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add new task"
        />
        <button type="submit">Add Task</button>
      </form>
    );
  }

export default TaskInput;
