import { Sequelize } from 'sequelize-typescript';
import config from '../../config';

import { User } from '../models/User';

let _sequelize: Sequelize | null = null;

/**
 * Fetch DB connection.
 */
export const getConnection = () => {
  if (!_sequelize) {
    throw new Error('DB connection not intialized.');
  }

  return _sequelize;
};

/**
 * Initialize DB connection.
 */
export const initDB = async () => {
  _sequelize = new Sequelize({
    ...config.get('db'),
    dialect: 'postgres',
    models: [User],
    logging: console.log,
  });

  return _sequelize;
};
