import http from 'http';
import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import redis from 'redis';
import ConnectRedis from 'connect-redis';
import moment from 'moment';
import { createTerminus } from '@godaddy/terminus';
import { ApolloServer } from 'apollo-server-express';
import winston from 'winston';
import expressWinston from 'express-winston';

import config from './config';
import schema from './app/graphql/schema';
import { addServeRoutes } from './serve/controller';
import { initDB } from './app/utils/db';
import { initAuth } from './app/utils/auth';

/**
 * Bootstrap the server
 */
const bootstrap = async () => {
  const isDev = config.get('env') === 'dev';

  // Create DB connection.
  const dbConn = await initDB();

  // Create Apollo Server object using GraphQL schema.
  const graphqlServer = new ApolloServer({
    schema,
    playground: isDev,
    debug: isDev,
    context: ic => ic.req,
  });

  // Create new Express app.
  const expressApp = express();

  // Add logger middleware.
  expressApp.use(expressWinston.logger({
    transports: [
      new winston.transports.Console(),
    ],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json(),
    ),
  }));

  // Static directory.
  expressApp.use(express.static('public'));

  // Body parser.
  expressApp.use(bodyParser.json());
  expressApp.use(bodyParser.urlencoded({ extended: true }));

  // Set pug view engine.
  expressApp.set('views', `${__dirname}/assets/views`);
  expressApp.set('view engine', 'pug');

  // Add session management.
  const redisClient = redis.createClient({
    host: config.get('redis').host,
    port: config.get('redis').port,
  });
  const RedisStore = ConnectRedis(session);
  const store = new RedisStore({
    client: redisClient,
    prefix: 'abzenadmin:sess:',
    logErrors: true,
  });
  expressApp.use(session({
    name: 'abzenadmin',
    secret: config.get('secretKey'),
    resave: false,
    saveUninitialized: true,
    store,
    cookie: {
      maxAge: moment.duration(1, 'month').asMilliseconds(),
    },
  }));

  // Add authentication system.
  initAuth(expressApp);

  // Add Apollo.
  graphqlServer.applyMiddleware({
    app: expressApp,
    path: '/graphql',
  });

  // Add home route
  expressApp.get('/', (req, res) => {
    console.log(req.user);
    res.send('ABZen');
  });

  // Admin routes
  expressApp.get('/admin', (req, res) => {
    res.sendfile('public/admin/index.html');
  });
  expressApp.get('/admin/*', (req, res) => {
    res.sendfile('public/admin/index.html');
  });

  // Add routes for serving the client script and API.
  addServeRoutes(expressApp);
  
  // Wrap server in Terminus.
  const server = http.createServer(expressApp);
  createTerminus(server, {
    healthChecks: {
      '/health': async () => {
        // TODO: Throw error if system not healthy.
        return 'OK';
      },
    },
    onSignal: async () => {
      console.log('Shutdown signal received.');

      console.log('Closind DB connection...');
      await dbConn.close();

      // TODO: other cleanup for shutdown.

      console.log('Cleanup finished.');
    },
  });

  expressApp.listen(config.get('port'), () => {
    console.log(`Server started on port ${config.get('port')}`);
  });
};

/**
 * Run app
 */
bootstrap();