import convict from 'convict';

// Config schema
const config = convict({
  env: {
    doc: 'Runtime environment',
    format: ['prod', 'dev', 'test'],
    default: 'dev',
    env: 'NODE_ENV',
  },
  ver: {
    doc: 'Version',
    format: String,
    default: '0.0.0',
    env: 'VERSION',
  },
  port: {
    doc: 'Application server port',
    format: 'port',
    default: 4000,
    env: 'PORT',
  },
  apiHost: {
    doc: 'Hostname from which this server will be accessible',
    format: String,
    default: 'http://localhost:4000',
    env: 'API_HOST',
  },
  corsOrigins: {
    doc: 'Array of hosts to whitelist for receiving experiment tracking',
    format: Array,
    default: ['*'],
    env: 'CORS_ORIGINS',
  },
  secretKey: {
    doc: 'Secret key used for encryption',
    format: String,
    default: 'gUkXp2rnmAs3025u8x/A?D(G',
    env: 'SECRET_KEY',
  },
  redis: {
    host: {
      doc: 'Redis host',
      format: String,
      default: 'localhost',
      env: 'REDIS_HOST',
    },
    port: {
      doc: 'Redis port',
      format: 'port',
      default: 6379,
      env: 'REDIS_PORT',
    },
  },
  db: {
    host: {
      doc: 'Database host',
      format: String,
      default: 'localhost',
      env: 'DB_HOST',
    },
    port: {
      doc: 'Database port',
      format: 'port',
      default: 5432,
      env: 'DB_PORT',
    },
    username: {
      doc: 'Database username',
      format: String,
      default: 'abzen',
      env: 'DB_USERNAME',
    },
    password: {
      doc: 'Database password',
      format: String,
      default: 'abzen',
      env: 'DB_PASSWORD',
    },
    database: {
      doc: 'Database name',
      format: String,
      default: 'abzen_dev',
      env: 'DB_DATABASE',
    },
    logging: {
      doc: 'Database logging',
      format: Boolean,
      default: true,
      env: 'DB_LOGGING',
    },
  },
});

config.validate({ allowed: 'strict' });

export default config;