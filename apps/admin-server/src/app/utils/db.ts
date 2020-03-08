import { Sequelize } from 'sequelize-typescript';

import config from '../../config';
import { models } from '../models';

/**
 * Initialize DB connection.
 */
export const initDB = async () => {
  return new Sequelize({
    ...config.get('db'),
    dialect: 'postgres',
    models,
    logging: console.log,
  });
};
