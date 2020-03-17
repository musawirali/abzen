import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.addColumn('experiments', 'info', {
      allowNull: true,
      type: DataTypes.TEXT,
    });

    await queryInterface.addColumn('experiments', 'traffic_allocation', {
      allowNull: false,
      defaultValue: 1,
      type: DataTypes.FLOAT,
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn('experiments', 'info');
    await queryInterface.removeColumn('experiments', 'traffic_allocation');
  }
};
