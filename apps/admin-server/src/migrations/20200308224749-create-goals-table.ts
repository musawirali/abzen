import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('goals', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      archivedAt: {
        allowNull: true,
        field: 'archived_at',
        type: DataTypes.DATE,
      },
      createdAt: {
        allowNull: false,
        field: 'created_at',
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        field: 'updated_at',
        type: DataTypes.DATE,
      },
    });

    await queryInterface.createTable('experiment_goals', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      isPrimary: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'is_primary',
      },
      experimentID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'experiment_id',
        references: {
          model: 'experiments',
          key: 'id',
        },
      },
      goalID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'goal_id',
        references: {
          model: 'goals',
          key: 'id',
        },
      },
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('experiment_goals');
    await queryInterface.dropTable('goals');
  }
};
