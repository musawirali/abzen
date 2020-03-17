import { Sequelize } from 'sequelize';
import Umzug from 'umzug';
import { initDB } from '../src/app/utils/db';

/**
 * Script for applying pending migrations.
 */
const migrate = async () => {
  const sequelize = await initDB();
  const umzug = new Umzug({
    storage: 'sequelize',
    storageOptions: {
      sequelize,
      tableName: 'migrations',
    },
    migrations: {
      params: [sequelize.getQueryInterface(), Sequelize],
      path: 'apps/admin-server/src/migrations',
      pattern: /\.ts$/,
    },
  });

  const logMigrationEvent = (eventName: string) => (name: string): void => console.log(`${eventName}:`, name);
  umzug.on('migrating', logMigrationEvent('migrating'));
  umzug.on('migrated', logMigrationEvent('migrated'));
  umzug.on('reverting', logMigrationEvent('reverting'));
  umzug.on('reverted', logMigrationEvent('reverted'));

  await umzug.up();

  await sequelize.close();
};

migrate();