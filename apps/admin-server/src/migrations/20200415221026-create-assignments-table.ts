import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('assignments', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      sessionID: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'session_id',
      },
      userID: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'user_id',
      },
      experiments: {
        type: DataTypes.JSONB,
        allowNull: false,
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
    
    await queryInterface.addIndex('assignments', ['session_id'], {
      name: 'assignment_session_id_idx',
    });
    await queryInterface.addIndex('assignments', ['user_id'], {
      name: 'assignment_user_id_idx',
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeIndex('assignments', 'assignment_session_id_idx');
    await queryInterface.removeIndex('assignments', 'assignment_user_id_idx');

    await queryInterface.dropTable('assignments');
  }
};
