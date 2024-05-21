// backend/models/ActivityLog.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const ActivityLog = sequelize.define('ActivityLog', {
  taskId: { type: DataTypes.INTEGER, references: { model: 'Tasks', key: 'id' } },
  userId: { type: DataTypes.INTEGER, references: { model: 'Users', key: 'id' } },
  action: { type: DataTypes.STRING, allowNull: false },
  taskTitle: { type: DataTypes.STRING, allowNull: true },
  userName: { type: DataTypes.STRING, allowNull: true },
  details: { type: DataTypes.STRING, allowNull: true },
  date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

module.exports = ActivityLog;










/*const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  action: {
    type: String,
    enum: ['Created', 'Updated', 'Deleted'],
    required: true
  },
  taskTitle: String,  
  userName: String,  
  details: String,
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ActivityLog', activityLogSchema);
*/