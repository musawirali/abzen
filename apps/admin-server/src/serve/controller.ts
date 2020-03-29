import fs from 'fs';
import { Application } from 'express';

/**
 * Add all the routes for the client script.
 * @param expressApp
 * @param scriptPath
 */
export const addServeRoutes = (expressApp: Application, scriptPath: string) => {
  if (fs.existsSync(scriptPath)) {
    console.log('Loading script file', scriptPath);
    const scriptFile = fs.readFileSync(scriptPath).toString();

    /**
     * Serve JS file
     */
    expressApp.get('/abzen.js', (req, res) => {
      res.type('.js').send(scriptFile + 'init({}, "/");');
    });

  } else {
    console.warn('Script file does not exist:', scriptPath);
  }
};
