'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.renameTable('ActivityLogs', 'ActivityLogs_old', { transaction });

      await queryInterface.createTable('ActivityLogs', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        taskId: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        userId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'Users',
            key: 'id',
          },
        },
        action: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        taskTitle: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        userName: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        details: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        date: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
      }, { transaction });

      await queryInterface.sequelize.query(
        `INSERT INTO ActivityLogs (id, taskId, userId, action, taskTitle, userName, details, date, createdAt, updatedAt)
        SELECT id, taskId, userId, action, taskTitle, userName, details, date, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP FROM ActivityLogs_old`,
        { transaction }
      );

      await queryInterface.dropTable('ActivityLogs_old', { transaction });
    });
  },

  down: async (queryInterface, Sequelize) => {
  },
};
