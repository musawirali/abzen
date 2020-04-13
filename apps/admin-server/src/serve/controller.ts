import fs from 'fs';
import { Application } from 'express';
import cors from 'cors';

import config from '../config';

/**
 * Add all the routes for the client script.
 * @param expressApp
 * @param scriptPath
 */
export const addServeRoutes = (expressApp: Application, scriptPath: string) => {
  if (fs.existsSync(scriptPath)) {
    console.log('Loading script file', scriptPath);
    const scriptFile = fs.readFileSync(scriptPath).toString();

    const apiURL = `${config.get('apiHost')}/cb`;
    const corsOpts = cors({
      origin: '*',
    });

    /**
     * Serve JS script.
     */
    expressApp.get('/abzen.js', (req, res) => {
      const opts = {
        experiments: {},
        apiURL,
      };
      res.type('.js').send(
        scriptFile + `\ninit(${JSON.stringify(opts)});`,
      );
    });

    /**
     * Endpoint used by JS script for sending tracking events.
     * With CORS enabled.
     */
    expressApp.options('/cb', corsOpts);
    expressApp.post('/cb', corsOpts, (req, res) => {
      res.send('OK');
    });

  } else {
    console.warn('Script file does not exist:', scriptPath);
  }
};
