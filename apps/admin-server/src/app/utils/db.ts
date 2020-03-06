import { Sequelize } from 'sequelize-typescript';
import config from '../../config';

import { User } from '../models/User';

/**
 * Initialize DB connection.
 */
export const initDB = async () => {
  return new Sequelize({
    ...config.get('db'),
    dialect: 'postgres',
    models: [User],
    logging: console.log,
  });
};
