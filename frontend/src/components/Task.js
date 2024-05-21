import React from 'react';
import { format } from 'date-fns';
import { useDrag } from 'react-dnd';
import { useTranslation } from 'react-i18next';

function Task({ task, onTaskClick }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "TASK",
    item: { id: task.id, ...task },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const startDate = new Date(task.startDate);
  const endDate = new Date(task.endDate);
  const dateRange = `${format(startDate, 'yyyy/MM/dd')} – ${format(endDate, 'yyyy/MM/dd')}`;

  return (
    <div ref={drag} className="task-card" style={{ opacity: isDragging ? 0.5 : 1 }} onClick={() => onTaskClick(task)}>
      <h3>{task.title}</h3>
      <div className="indicators">
        <PriorityIndicator priority={task.priority} />
        <StatusIndicator status={task.status} />
      </div>
      {dateRange && ( 
        <div className="date-range">
          <span>{task.dueDate}</span>
        </div>
      )}
    </div>
  );
}

function PriorityIndicator({ priority }) {
  const { t } = useTranslation(); 
  return <span className={`priority-indicator ${priority.toLowerCase()}`}>{t(priority)}</span>;
}

function StatusIndicator({ status }) {
  const { t } = useTranslation(); 
  return <span className={`status-indicator ${status.replace(/\s/g, '-').toLowerCase()}`}>{t(status)}</span>;
}

export default Task;
