import commander from 'commander';
import { initDB } from '../src/app/utils/db';
import { User } from '../src/app/models/User';

/**
 * Script for creating a new user account.
 * NOTE: This uses the config object to get the encryption
 * key. Pass the proper env variables to override default config.
 */

commander
  .description('Create a new user account')
  .requiredOption('-n, --acctname <name>', 'Name')
  .requiredOption('-u, --username <username>', 'Username')
  .requiredOption('-p, --password <password>', 'Password')
  .parse(process.argv);

const createUser = async () => {
  const sequelize = await initDB();

  try {
    const user = await User.create({
      name: commander.acctname,
      username: commander.username,
      password: commander.password,
    });
    console.log('User account successfully created with ID:', user.id);
  } catch (err) {
    console.error('User account creation failed:', err.message);
  }

  await sequelize.close();
};

createUser();