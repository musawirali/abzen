import { Application, Handler } from 'express';

/**
 * Serve JS file.
 */
const serve: Handler = (req, res) => {
  res.type('.js').render('script');
};

/**
 * Add all the routes for the client script.
 * @param expressApp
 */
export const addServeRoutes = (expressApp: Application) => {
  // Serve JS file
  expressApp.get('/abzen.js', serve);
};
