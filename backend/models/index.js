const sequelize = require('../config/sequelize');
const User = require('./User');
const Task = require('./Task');
const ActivityLog = require('./ActivityLog');


module.exports = {
  sequelize,
  User,
  Task,
  ActivityLog
};
