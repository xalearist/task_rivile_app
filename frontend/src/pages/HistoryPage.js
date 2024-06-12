import React, { useEffect, useState, useCallback } from 'react';
import { Table, Button, Popconfirm, message } from 'antd';
import { useTranslation } from 'react-i18next';

const HistoryPage = () => {
    const BACKEND_URL_API = process.env.REACT_APP_AUTH_URL;
    const { t } = useTranslation();
    const [logs, setLogs] = useState([]);
    const [filters, setFilters] = useState({
        action: [],
        taskTitle: [],
        userName: []
    });

    const fetchLogs = useCallback(async () => {
        try {
            const response = await fetch(`${BACKEND_URL_API}/api/activityLogs`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch logs');
            }
            const data = await response.json();
            data.sort((a, b) => new Date(b.date) - new Date(a.date)); 
            setLogs(data);
            extractFilters(data);
        } catch (error) {
            console.error('Failed to fetch logs:', error.message);
        }
    }, [BACKEND_URL_API]);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    const extractFilters = (data) => {
        const actionSet = new Set(data.map(item => item.action));
        const taskTitleSet = new Set(data.map(item => item.taskTitle));
        const userNameSet = new Set(data.map(item => item.userName));
        setFilters({
            action: Array.from(actionSet).map(value => ({ text: value, value })),
            taskTitle: Array.from(taskTitleSet).map(value => ({ text: value, value })),
            userName: Array.from(userNameSet).map(value => ({ text: value, value }))
        });
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${BACKEND_URL_API}/api/activityLogs/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to delete log');
            }
            fetchLogs();
            message.success(t('Log deleted successfully'));
        } catch (error) {
            console.error('Failed to delete log:', error.message);
            message.error(t('Failed to delete log'));
        }
    };

    const columns = [
        {
            title: t('Action'),
            dataIndex: 'action',
            key: 'action',
            filters: filters.action,
            onFilter: (value, record) => record.action.includes(value),
            render: (text) => t(text)
        },
        {
            title: t('Task Title'),
            dataIndex: 'taskTitle',
            key: 'taskTitle',
            filters: filters.taskTitle,
            onFilter: (value, record) => record.taskTitle.includes(value)
        },
        {
            title: t('User'),
            dataIndex: 'userName',
            key: 'userName',
            filters: filters.userName,
            onFilter: (value, record) => record.userName.includes(value)
        },
        {
            title: t('Time'),
            dataIndex: 'date',
            key: 'date',
            render: text => new Date(text).toLocaleString(),
            sorter: (a, b) => new Date(b.date) - new Date(a.date),
            sortDirections: ['ascend', 'descend', 'ascend'],
        },
        {
            title: t('Delete'),
            key: 'delete',
            render: (_, record) => (
                <Popconfirm
                    title={t("Are you sure you want to delete this log?")}
                    onConfirm={() => handleDelete(record.id)}
                    okText={t("Yes")}
                    cancelText={t("No")}
                >
                    <Button type="danger">{t('Delete')}</Button>
                </Popconfirm>
            )
        }
    ];

    return (
        <div className="history-page">
            <div className="history-table">
                <Table 
                    dataSource={logs} 
                    columns={columns} 
                    rowKey="id" 
                    locale={{ 
                        triggerDesc: t('triggerDesc'),
                        triggerAsc: t('triggerAsc'),
                        cancelSort: t('cancelSort')
                    }}
                    scroll={{ x: true }} 
                    pagination={{ pageSize: 9 }} 
                />
            </div>
        </div>
    );
};

export default HistoryPage;
