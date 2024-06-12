const Sequelize = require('sequelize');
const sequelize = require('../config/sequelize');

const User = require('./user');
const Task = require('./task');
const ActivityLog = require('./activitylog');

const models = {
  User,
  Task,
  ActivityLog
};

Object.keys(models).forEach(modelName => {
  if ('associate' in models[modelName]) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;
