import React, { useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useTranslation } from 'react-i18next';

const localizer = momentLocalizer(moment);

const priorityColors = {
    Low: '#5cb85c', // green
    Medium: '#f0ad4e', // orange
    High: '#d9534f', // red
};

function TaskCalendar({ tasks, onEventClick }) {
    const { t, i18n } = useTranslation(); 

    useEffect(() => {
        moment.locale(i18n.language);
    }, [i18n.language]);

    const events = tasks.filter(task => task.startDate && task.endDate).map(task => ({
        id: task.id,
        title: task.title,
        start: new Date(task.startDate),
        end: new Date(task.endDate),
        bgColor: priorityColors[task.priority] || '#005792',
    }));

    const handleEventClick = (event) => {
        const task = tasks.find(t => t.id === event.id);
        if (task) {
            onEventClick(task);
        }
    };

    return (
        <div style={{ height: '92vh' }}>
            <Calendar
                localizer={localizer}
                events={events}
                onSelectEvent={handleEventClick}
                startAccessor="start"
                endAccessor="end"
                style={{ /*height: "100vh"*/ }}
                eventPropGetter={(event) => ({
                    style: {
                        backgroundColor: event.bgColor,
                        borderRadius: '5px',
                        opacity: 0.8,
                        color: 'black',
                        border: 'none',
                        display: 'block',
                        textAlign: 'center',
                        lineHeight: '1',
                    }
                })}
                messages={{
                    today: t('Today'),
                    previous: t('Back'),
                    next: t('Next'),
                    month: t('Month'),
                    week: t('Week'),
                    day: t('Day'),
                    agenda: t('Agenda'),
                    date: t('Date'),
                    time: t('Time'),
                    event: t('Event'),
                    allDay: t('All day'),
                    noEventsInRange: t('No events in range'),
                    showMore: (total) => `+ ${total} ${t('more')}`,
                }}
                views={['month']}
            />
        </div>
    );
}

export default TaskCalendar;
