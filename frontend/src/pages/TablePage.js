import React, { useEffect } from 'react';
import TaskTable from '../components/TaskTable';
function TablePage({ tasks, setTasks }) {
  useEffect(() => {
    const fetchTasks = async () => {
      const response = await fetch('http://localhost:8000/api/tasks', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}` 
                    }
                });
      if (response.ok) {
        const fetchedTasks = await response.json();
        setTasks(fetchedTasks);
      } else {
        console.error("Failed to fetch tasks");
      }
    };

    fetchTasks();
  }, [setTasks]);



  return (
    <div>
      <TaskTable tasks={tasks} setTasks={setTasks} />
    </div>
  );
}

export default TablePage;
