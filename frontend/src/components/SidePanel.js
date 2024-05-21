import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { format } from 'date-fns';
import DropdownSelect from '../components/DropdownSelect';
import { fetchData } from './apiService';
import { useTranslation } from 'react-i18next';
import { Popconfirm, Button } from 'antd';

function SidePanel({ isOpen, closePanel, saveTask, task, setTasks, deleteTask, completeTask }) {
    const { t } = useTranslation(); 
    const [clientNames, setClientNames] = useState([]);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [goods, setGoods] = useState([]);
    const [isCompleted, setIsCompleted] = useState(false);
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 768);
    const [resizeKey, setResizeKey] = useState(0);
    const [clientDataFetched, setClientDataFetched] = useState(false);
    const [goodsDataFetched, setGoodsDataFetched] = useState(false);
    const [errors, setErrors] = useState({});

    const toggleCalendar = () => {
        setIsCalendarOpen(!isCalendarOpen);
    };

    const initialTaskDetails = useMemo(() => ({
        title: '',
        category: '',
        goods: [],
        client: '',
        dates: {
            startDate: null,
            endDate: null,
            key: 'selection',
        },
        dueDate: '',
        priority: 'Low',
        status: 'None',
        description: '',
        completionStatus: 'Not Completed',
    }), []);

    const [taskDetails, setTaskDetails] = useState(initialTaskDetails);

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth <= 768);
            setResizeKey(prevKey => prevKey + 1); 
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        if (task) {
            setTaskDetails({ ...initialTaskDetails, ...task });
            setIsCompleted(task.completionStatus === 'Completed');
        } else {
            setTaskDetails(initialTaskDetails);
            setIsCompleted(false);
        }
    }, [task, initialTaskDetails]);

    const handleChange = (field, value) => {
        if (typeof field === 'object') {
            const { name, value } = field.target;
            setTaskDetails(prev => ({ ...prev, [name]: value }));
        } else {
            setTaskDetails(prev => ({ ...prev, [field]: value }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!taskDetails.title.trim()) {
            newErrors.title = t('Title is required');
        }
        if (!taskDetails.category.trim()) {
            newErrors.category = t('Category is required');
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            saveTask(taskDetails);
            closePanel();
        }
    };

    const handleSelect = (ranges) => {
        const { startDate, endDate } = ranges.selection;
        setTaskDetails(prevDetails => ({
            ...prevDetails,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            dates: { ...prevDetails.dates, startDate, endDate },
            dueDate: startDate && endDate ? `${format(startDate, 'yyyy-MM-dd')} to ${format(endDate, 'yyyy-MM-dd')}` : ''
        }));
    };

    const handleClearDates = () => {
        setTaskDetails(prev => ({
            ...prev,
            dates: {
                startDate: null,
                endDate: null,
                key: 'selection',
            },
            dueDate: ''
        }));
        setIsCalendarOpen(false);
    };

    const loadClientData = useCallback(async () => {
        if (!clientDataFetched) {
            try {
                const result = await fetchData('GET_N08_LIST');
                if (result && result.RET_DOK && result.RET_DOK.N08) {
                    const names = Array.isArray(result.RET_DOK.N08) ? result.RET_DOK.N08.map(item => item.N08_PAV) : [result.RET_DOK.N08.N08_PAV];
                    setClientNames(names);
                }
                setClientDataFetched(true);
                //console.log("loadClientData api call");
            } catch (error) {
                console.error('Failed to load client data:', error);
            }
        }
    }, [clientDataFetched]);

    const loadGoodsData = useCallback(async () => {
        if (!goodsDataFetched) {
            try {
                const result = await fetchData('GET_N17_LIST');
                if (result && result.RET_DOK && result.RET_DOK.N17) {
                    const goods = Array.isArray(result.RET_DOK.N17) ? result.RET_DOK.N17.map(item => item.N17_PAV) : [result.RET_DOK.N17.N17_PAV];
                    setGoods(goods.map(good => ({ name: good, id: good })));
                }
                setGoodsDataFetched(true);
                //console.log("loadGoodsData api call");
            } catch (error) {
                console.error('Failed to load goods data:', error);
            }
        }
    }, [goodsDataFetched]);

    useEffect(() => {
        if (taskDetails.category === 'Sale') {
            loadGoodsData();
        }
    }, [taskDetails.category, loadGoodsData]);

    const handleGoodsChange = (goodName) => {
        setTaskDetails(prevDetails => ({
            ...prevDetails,
            goods: prevDetails.goods.includes(goodName)
                ? prevDetails.goods.filter(g => g !== goodName)
                : [...prevDetails.goods, goodName]
        }));
    };

    const handleCompleteTask = () => {
        const newStatus = isCompleted ? 'Not Completed' : 'Completed';
        setTaskDetails(prevDetails => ({
            ...prevDetails,
            completionStatus: newStatus,
        }));
        completeTask(task.id, newStatus);
        setIsCompleted(!isCompleted);
    };

    const handleDeleteTask = () => {
        if (task && task.id) {
            deleteTask(task.id);
            closePanel();
        }
    };

    const constraints = isSmallScreen
        ? { minConstraints: [440, window.innerHeight], maxConstraints: [440, window.innerHeight] }
        : { minConstraints: [440, window.innerHeight], maxConstraints: [800, window.innerHeight] };

    if (!isOpen) return null;

    return (
        <ResizableBox
            key={resizeKey} 
            width={isSmallScreen ? 440 : 440}
            height={window.innerHeight}
            {...constraints}
            resizeHandles={isSmallScreen ? [] : ['w']}
            className={`side-panel ${isOpen ? 'open' : ''}`}
            style={{ position: 'fixed', right: 0, top: 0, bottom: 0 }}
        >
            <form onSubmit={handleSubmit}>
                <div className='SidePanel-Header'>
                    {task && task.id && (
                        <>
                            <button
                                type="button"
                                className={`task-action-btn complete-task-button ${isCompleted ? 'completed' : ''}`}
                                onClick={handleCompleteTask}
                            >
                                {isCompleted ? t('Completed') : t('Mark Complete')}
                            </button>
                            <div className="delete-task-container">
                                <Popconfirm
                                    title={t("Are you sure you want to delete this task?")}
                                    onConfirm={handleDeleteTask}
                                    okText={t("Yes")}
                                    cancelText={t("No")}
                                    className="task-action-btn delete-task-button"
                                >
                                    <Button type="danger">{t('Delete Task')}</Button>
                                </Popconfirm>
                            </div>
                        </>
                    )}
                    <button className="close-btn" onClick={closePanel}>×</button>
                </div>

                <div className='SidePanel-Title'>
                    <div>
                        <input
                            id="title"
                            name="title"
                            value={taskDetails.title || ''}
                            onChange={handleChange}
                            placeholder={t("Write a task name")}
                            className={errors.title ? 'input-error' : ''}
                        />
                        {errors.title && <span className="error-message">{errors.title}</span>}
                    </div>
                </div>

                <div className="form-group">
                    <label>{t('Category')}</label>
                    <div>
                        <select
                            name="category"
                            value={taskDetails.category}
                            onChange={handleChange}
                            className={errors.category ? 'input-error' : ''}
                        >
                            <option value="">{t('Select a category')}</option>
                            <option value="Work">{t('Work')}</option>
                            <option value="Sale">{t('Sale')}</option>
                        </select>
                        {errors.category && <span className="error-message">{errors.category}</span>}
                    </div>
                </div>

                {taskDetails.category === 'Sale' && (
                    <div className="form-group">
                        <label>{t('Goods')}</label>
                        <div className="multi-select-dropdown">
                            {goods.map(good => (
                                <div key={good.id} className="select-item">
                                    <input
                                        type="checkbox"
                                        id={`good-${good.id}`}
                                        name="goods"
                                        checked={taskDetails.goods.includes(good.name)}
                                        onChange={() => handleGoodsChange(good.name)}
                                    />
                                    <label htmlFor={`good-${good.id}`}>{good.name}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="form-group">
                    <label>{t('Client')}</label>
                    <select
                        value={taskDetails.client}
                        onFocus={loadClientData}
                        onChange={e => setTaskDetails(prev => ({ ...prev, client: e.target.value }))}
                    >
                        <option value="">{t('Select a client')}</option>
                        {clientNames.map((name, index) => (
                            <option key={index} value={name}>{name}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>{t('Due date')}</label>
                    <div className="due-date-picker">
                        <button type="button" className="due-date-button" onClick={toggleCalendar}>
                            {taskDetails.dueDate || t('No due date')}
                        </button>
                        {isCalendarOpen && (
                            <div className="calendar-dropdown">
                                <DateRangePicker
                                    ranges={[taskDetails.dates]}
                                    onChange={handleSelect}
                                    moveRangeOnFirstSelection={false}
                                    rangeColors={["#3d91ff"]}
                                />
                                <button className="calendar-clear-button" onClick={handleClearDates}>{t('Clear Dates')}</button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="form-group">
                    <label>
                        <i className="fa fa-user icon"></i>{t('Priority')}
                    </label>
                    <DropdownSelect
                        value={taskDetails.priority}
                        onChange={(value) => handleChange('priority', value)}
                        options={[
                            { value: 'Low', label: t('Low'), color: '#5cb85c' },
                            { value: 'Medium', label: t('Medium'), color: '#f0ad4e' },
                            { value: 'High', label: t('High'), color: '#d9534f' }
                        ]}
                        placeholder={t("Select Priority")}
                    />
                </div>

                <div className="form-group">
                    <label>
                        <i className="fa fa-user icon"></i>{t('Status')}
                    </label>
                    <DropdownSelect
                        value={taskDetails.status}
                        onChange={(value) => handleChange('status', value)}
                        options={[
                            { value: 'None', label: t('—') },
                            { value: 'On track', label: t('On track'), color: '#5bc0de' },
                            { value: 'At risk', label: t('At risk'), color: '#f0ad4e' },
                            { value: 'Off track', label: t('Off track'), color: '#d9534f' }
                        ]}
                    />
                </div>

                <label>{t('Description')}</label>
                <div className='SidePanel-Description'>
                    <textarea
                        name="description"
                        value={taskDetails.description}
                        onChange={handleChange}
                        placeholder={t("What is this task about?")}
                    ></textarea>
                </div>
                <button type="submit" className="save-task-button">{t('Save Task')}</button>
            </form>
        </ResizableBox>
    );
}

export default SidePanel;
