import React, { useRef, useState, useCallback } from 'react';
import { Table, Typography } from 'antd';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import SidePanel from '../components/SidePanel';
import { debounce } from 'lodash';
import { useTranslation } from 'react-i18next';

const TaskTable = ({ tasks, setTasks }) => {
  const BACKEND_URL_API = process.env.REACT_APP_AUTH_URL;
  const { t } = useTranslation();
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

  const closeSidePanel = () => {
    setSidePanelOpen(false);
    setSelectedTask(null);
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
  

const handleSaveTask = debounce(async (taskData) => {
  const apiUrl = taskData.id ? `${BACKEND_URL_API}/api/tasks/${taskData.id}` : `${BACKEND_URL_API}/api/tasks`;
  const method = taskData.id ? 'PUT' : 'POST';

  if (taskData.completionStatus === 'Completed' && !taskData.solvedAt) {
    taskData.solvedAt = new Date();
  }
  else taskData.solvedAt = null;

  try {
      const response = await fetch(apiUrl, {
          method,
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(taskData)
      });
      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message);
      }
      const updatedTask = await response.json();
      if (method === 'POST') {
          setTasks(prevTasks => [...prevTasks, updatedTask]);
      } else {
          setTasks(prevTasks => prevTasks.map(t => t.id === updatedTask.id ? { ...updatedTask } : t));
      }
  } catch (error) {
      console.error('Failed to save task:', error.message);
  }
}, 500);

const moveTask = useCallback(async (draggedId, hoverId, hoverStatus) => {
  const draggedIndex = tasks.findIndex(task => task.id === draggedId);
  const hoverIndex = hoverId ? tasks.findIndex(task => task.id === hoverId) : tasks.length;
  const draggedItem = tasks[draggedIndex];

  if (draggedItem.progressStatus === hoverStatus) {
      const updatedTasks = update(tasks, {
          $splice: [
              [draggedIndex, 1],
              [hoverIndex, 0, draggedItem],
          ],
      });
      setTasks(updatedTasks);
  } else {
      const updatedTask = {...draggedItem, progressStatus: hoverStatus};
      await handleSaveTask(updatedTask);
      const updatedTasks = update(tasks, {
          $splice: [
              [draggedIndex, 1],
              [hoverIndex, 0, updatedTask],
          ],
      });
      setTasks(updatedTasks);
  }
}, [tasks, setTasks, handleSaveTask]);


  const DraggableRow = ({ record, status, index, ...restProps }) => {
    const ref = useRef();
    const [, drop] = useDrop({
      accept: 'row',
      hover(item, monitor) {
        if (!ref.current) {
          return;
        }
  
        let hoverIndex = index;
        if (record.addTask) {
          return; 
        }
  
        if (item.index === hoverIndex && item.originalStatus === status) {
          return; 
        }
  
        moveTask(item.id, record.id || null, status);
        item.index = hoverIndex;
      },
  });
  
    const [{ isDragging }, drag] = useDrag({
      type: 'row',
      item: () => ({
        type: 'row',
        id: record.id,
        index,
        originalStatus: record.progressStatus,
      }),
      collect: monitor => ({
        isDragging: monitor.isDragging(),
      }),
      canDrag: () => !record.addTask, 
    });
  
    if (!record.addTask) {
      drag(drop(ref));
    }
  
    return (
      <tr
        ref={ref}
        className={`${restProps.className} ${isDragging ? 'dragging' : ''} ${record.addTask ? 'add-task-row' : ''}`}
        style={{ cursor: record.addTask ? 'default' : 'move' }}
        {...restProps}
      />
    );
  };

const statuses = ['To do', 'In Progress', 'Done'];
const StatusColumn = ({ status, children }) => {
  const ref = useRef();
  const [, drop] = useDrop({
    accept: 'row',
    hover(item, monitor) {
      if (!monitor.canDrop()) return;
      if (!tasks.filter(t => t.progressStatus === status).length) {
        moveTask(item.id, null, status); 
      }
    },
  });

  drop(ref);

  return (
    <div ref={ref} style={{ minHeight: '50px' }}> 
      {children}
    </div>
  );
};

const priorityColors = {
  Low: '#5cb85c', // green
  Medium: '#f0ad4e', // orange
  High: '#d9534f', // red
};

const statusColors = {
  'On track': '#5bc0de', // green
  'At risk': '#f0ad4e', // orange
  'Off track': '#d9534f', // red
};

  return (
    <DndProvider backend={HTML5Backend}>
    <div className='list-page'>
    <div className='list-table'>
      {statuses.map(status => (
        <StatusColumn key={status} status={status}>
        <Typography.Title level={4}>{t(status)}</Typography.Title>
          <Table
            columns={[
              {
                title: t('Task Name'),
                dataIndex: 'title',
                key: 'title',
                width: 130,
                render: (text, record) => record.addTask ? t('Add Task...') : text || t('Untitled Task'),
              },
              {
                title: t('Category'),
                dataIndex: 'category',
                key: 'category',
                width: 100,
                render: category => t(category), 
              },
              {
                title: t('Goods'),
                dataIndex: 'goods',
                key: 'goods',
                width: 100,
                render: goods => goods ? goods.join(', ') : '',
              },
              {
                title: t('Client'),
                dataIndex: 'client',
                key: 'client',
                width: 100,
              },
              {
                title: t('Due Date'),
                dataIndex: 'dueDate',
                key: 'dueDate',
                width: 100,
              },
              {
                title: t('Priority'),
                dataIndex: 'priority',
                key: 'priority',
                width: 50,
                render: priority => (
                  <span style={{
                    backgroundColor: priorityColors[priority],
                    color: '#fff',
                    padding: '2px 6px',
                    borderRadius: '16px',
                    display: 'inline-block',
                  }}>
                    {t(priority)}
                  </span>
                ),
              },
              {
                title: t('Status'),
                dataIndex: 'status',
                key: 'status',
                width: 50,
                render: status => (
                  <span style={{
                    backgroundColor: statusColors[status],
                    color: '#fff',
                    padding: '2px 6px',
                    borderRadius: '16px',
                    display: 'inline-block',
                  }}>
                    {t(status)}
                  </span>
                ),
              },
            ]}
            dataSource={[...tasks.filter(task => task.progressStatus === status), { id: `${status}-add-task`, addTask: true }]}
            rowKey={record => record.id || record.key}
            pagination={false}
            components={{
              body: {
                row: DraggableRow,
              },
            }}
            onRow={(record, index) => ({
              record,
              index,
              status,
              className: 'draggable-row',
              onClick: () => {
                if (record.addTask) {
                  openSidePanelForNewTask(status);
                } else {
                  openSidePanelForEdit(record);
                }
              },
            })}
          />
        </StatusColumn>
      ))}
      </div>
      </div>
      {sidePanelOpen && (
        <SidePanel
          isOpen={sidePanelOpen}
          closePanel={closeSidePanel}
          task={selectedTask}
          saveTask={handleSaveTask}
          setTasks={setTasks}
          deleteTask={deleteTask}
          completeTask={completeTask}
        />
      )}
    </DndProvider>
  );
};

export default TaskTable;
