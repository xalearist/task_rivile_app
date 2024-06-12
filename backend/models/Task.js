// backend/models/Task.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Task = sequelize.define('Task', {
  title: { type: DataTypes.STRING, allowNull: false },
  category: { type: DataTypes.STRING, allowNull: false },
  goods: {
    type: DataTypes.TEXT,
    get() {
      return JSON.parse(this.getDataValue('goods'));
    },
    set(value) {
      this.setDataValue('goods', JSON.stringify(value));
    }
  },
  client: { type: DataTypes.STRING, allowNull: true },
  startDate: { type: DataTypes.DATE, allowNull: true },
  endDate: { type: DataTypes.DATE, allowNull: true },
  dueDate: { type: DataTypes.STRING, allowNull: true },
  priority: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  progressStatus: { type: DataTypes.STRING, allowNull: false },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  solvedAt: { type: DataTypes.DATE, allowNull: true },
  completionStatus: { type: DataTypes.STRING, defaultValue: 'Not Completed' }
}, {
  timestamps: true // Ensure Sequelize manages createdAt and updatedAt fields
});

module.exports = Task;