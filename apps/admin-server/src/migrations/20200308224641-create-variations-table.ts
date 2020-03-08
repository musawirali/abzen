import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('variations', {
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
      trafficAllocation: {
        type: DataTypes.FLOAT,
        allowNull: false,
        field: 'traffic_allocation',
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
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('variations');
  }
};
