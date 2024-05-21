const express = require('express');
const { Task, ActivityLog } = require('../models');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
  const { title, category, goods, client, dates, dueDate, priority, status, description, progressStatus } = req.body;
  try {
    const newTask = await Task.create({
      title,
      category,
      goods,
      client,
      startDate: dates.startDate,
      endDate: dates.endDate,
      dueDate,
      priority,
      status,
      description,
      progressStatus,
      createdAt: new Date(),
      solvedAt: null,
      completionStatus: 'Not Completed'
    });

    await ActivityLog.create({
      taskId: newTask.id,
      userId: req.user.id,
      taskTitle: newTask.title,
      userName: `${req.user.firstName} ${req.user.lastName}`,
      action: 'Created',
      details: `Task created by ${req.user.firstName} ${req.user.lastName}`
    });

    res.status(201).json(newTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error saving task', error });
  }
});

// GET all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.findAll();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error });
  }
});

// GET single task
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching task', error });
  }
});

const lastUpdates = {};

// PUT update task
router.put('/:id', authMiddleware, async (req, res) => {
  if (!req.user) {
    return res.status(403).json({ message: 'Authentication required' });
  }

  const now = new Date();
  const lastUpdate = lastUpdates[req.params.id] || new Date(0);
  const timeSinceLastUpdate = now - lastUpdate;

  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'No task found with that ID' });
    }

    // Only process if more than 1 second has passed since the last update
    if (timeSinceLastUpdate > 1000) {
      const updatedTask = await task.update(req.body);
      if (!updatedTask) {
        return res.status(404).json({ message: 'Failed to update the task' });
      }

      if (task.progressStatus === updatedTask.progressStatus) {
        await ActivityLog.create({
          taskId: updatedTask.id,
          userId: req.user.id,
          taskTitle: updatedTask.title,
          userName: `${req.user.firstName} ${req.user.lastName}`,
          action: 'Updated',
          details: `Task updated by ${req.user.firstName} ${req.user.lastName}`
        });
      }

      lastUpdates[req.params.id] = now; // Update the last update time
      res.json(updatedTask);
    } else {
      res.status(429).json({ message: 'Update too frequent' });
    }
  } catch (error) {
    console.error('Failed to update task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// DELETE a task
router.delete('/:id', async (req, res) => {
  try {
    const deletedTask = await Task.destroy({ where: { id: req.params.id } });
    if (!deletedTask) {
      return res.status(404).json({ message: 'No task found with that ID' });
    }
    await ActivityLog.create({
      taskId: req.params.id,
      userId: req.user.id,
      taskTitle: deletedTask.title,
      userName: `${req.user.firstName} ${req.user.lastName}`,
      action: 'Deleted',
      details: `Task deleted by ${req.user.firstName} ${req.user.lastName}`
    });

    res.json({ message: 'Task deleted', taskId: req.params.id });
  } catch (error) {
    console.error('Failed to delete task:', error);
    res.status(500).json({ message: 'Error deleting task', error });
  }
});

module.exports = router;











/*const express = require('express');
const Task = require('../models/Task');
const ActivityLog = require('../models/ActivityLog');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
  //console.log(req.user);
  const { title, category, goods, client, dates, dueDate, priority, status, description, progressStatus } = req.body;
  try {
    const newTask = new Task({
      title,
      category,
      goods,
      client,
      startDate: dates.startDate,
      endDate: dates.endDate,
      dueDate,
      priority,
      status,
      description,
      progressStatus,
      createdAt: new Date(),
      solvedAt: null,
      completionStatus: 'Not Completed'
      
    });
    const savedTask = await newTask.save();

    const newLog = new ActivityLog({
      taskId: savedTask._id,
      userId: req.user._id,
      taskTitle: savedTask.title,  
      userName: `${req.user.firstName} ${req.user.lastName}`, 
      action: 'Created',
      details: `Task created by ${req.user.firstName} ${req.user.lastName}`
    });
    await newLog.save();

    res.status(201).json(savedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error saving task", error: error });
  }
});

// GET all tasks
router.get('/', async (req, res) => {
    try {
      const tasks = await Task.find();
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching tasks', error });
    }
  });
  
  // GET single task
  router.get('/:id', async (req, res) => {
    try {
      const task = await Task.findById(req.params.id);
      if (!task) res.status(404).json({ message: 'Task not found' });
      res.json(task);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching task', error });
    }
  });
  
  
  const lastUpdates = {};

  // PUT update task
  router.put('/:id', authMiddleware, async (req, res) => {
    if (!req.user) {
      return res.status(403).json({ message: "Authentication required" });
    }
  
    const now = new Date();
    const lastUpdate = lastUpdates[req.params.id] || new Date(0);
    const timeSinceLastUpdate = now - lastUpdate;
  
    try {
      const task = await Task.findById(req.params.id);
      if (!task) {
        return res.status(404).json({ message: 'No task found with that ID' });
      }
  
      // Only process if more than 1 second has passed since the last update
      if (timeSinceLastUpdate > 1000) {
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedTask) {
          return res.status(404).json({ message: 'Failed to update the task' });
        }
  
        if (task.progressStatus == updatedTask.progressStatus) {
          const newLog = new ActivityLog({
            taskId: updatedTask._id,
            userId: req.user.id,
            taskTitle: updatedTask.title,
            userName: `${req.user.firstName} ${req.user.lastName}`,
            action: 'Updated',
            details: `Task updated by ${req.user.firstName} ${req.user.lastName}`
          });
          await newLog.save();
        }
  
        lastUpdates[req.params.id] = now; // Update the last update time
        res.json(updatedTask);
      } else {
        res.status(429).json({ message: 'Update too frequent' });
      }
    } catch (error) {
      console.error('Failed to update task:', error);
      res.status(500).json({ error: 'Failed to update task' });
    }
  });

  
  // DELETE a task
  router.delete('/:id', async (req, res) => {
    try {
      const deletedTask = await Task.findByIdAndDelete(req.params.id);
if (!deletedTask) {
    return res.status(404).json({ message: 'No task found with that ID' });
}
      const newLog = new ActivityLog({
        taskId: req.params.id,
        userId: req.user.id, 
        taskTitle: deletedTask.title,
        userName: `${req.user.firstName} ${req.user.lastName}`,
        action: 'Deleted',
        details: `Task deleted by ${req.user.firstName} ${req.user.lastName}`
      });
      await newLog.save();
  
      res.json({ message: 'Task deleted', taskId: req.params.id });
    } catch (error) {
      console.error('Failed to delete task:', error);
      res.status(500).json({ message: 'Error deleting task', error });
    }
  });
  


module.exports = router;*/
