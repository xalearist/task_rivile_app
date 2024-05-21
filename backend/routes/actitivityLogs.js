const express = require('express');
const router = express.Router();
const { ActivityLog } = require('../models');

router.get('/', async (req, res) => {
    try {
        const logs = await ActivityLog.findAll();
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching activity logs', error });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const log = await ActivityLog.destroy({ where: { id: req.params.id } });
        if (!log) {
            return res.status(404).json({ message: 'Log not found' });
        }
        res.status(200).json({ message: 'Log deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting activity log', error });
    }
});

module.exports = router;














/*const express = require('express');
const router = express.Router();
const ActivityLog = require('../models/ActivityLog');

// Endpoint to get all activity logs
router.get('/', async (req, res) => {
    try {
        const logs = await ActivityLog.find();
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching activity logs', error });
    }
});

// Endpoint to delete an activity log
router.delete('/:id', async (req, res) => {
    try {
        const log = await ActivityLog.findByIdAndDelete(req.params.id);
        if (!log) {
            return res.status(404).json({ message: 'Log not found' });
        }
        res.status(200).json({ message: 'Log deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting activity log', error });
    }
});

module.exports = router;*/