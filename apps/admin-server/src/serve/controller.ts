import fs from 'fs';
import { Application } from 'express';
import cors from 'cors';
import { Op } from 'sequelize';
import map from 'lodash/map';
import each from 'lodash/each';
import includes from 'lodash/includes';

import config from '../config';

import { Assignment, Experiment, ExperimentStatus } from '../app/models';

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
    expressApp.get('/abzen.js', async (req, res) => {
      // Get session ID.
      const sParam = req.query.s as (string | undefined);
      const sessionID = sParam || req.sessionID;
      if (!sessionID) {
        res.status(500).send('Internal server error');
        return;
      }

      // Get user ID.
      const userID = req.query.u as (string | undefined);

      // Fetch assignment record.
      let assignment: Assignment | null = null;
      // Try `userID` first.
      if (userID) {
        assignment = await Assignment.findOne({
          where: {
            userID,
          },
        });
      }
      // Next try `sessionID`.
      if (!assignment) {
        assignment = await Assignment.findOne({
          where: {
            sessionID,
          },
        });
      }

      // If not found, create new record.
      if (!assignment) {
        assignment = await Assignment.create({
          sessionID,
          userID,
          experiments: {},
        });
      }

      const { experiments } = assignment;

      // Get all the active experiments
      const availableExperiments = await Experiment.findAll({
        where: {
          status: ExperimentStatus.Running,
          archivedAt: {
            [Op.is]: null,
          },
        },
        include: [{
          association: 'variations',
        }],
      });

      // Construct variation assignment.
      const newExperiments: {[key in string]: string} = {};
      each(availableExperiments, (exp) => {
        let selectedVariation: string | undefined = experiments[`${exp.id}`];
        if (!includes(map(exp.variations, v => `${v.id}`), selectedVariation)) {
          selectedVariation = undefined;
          if (Math.random() <= exp.trafficAllocation) {
            const variationVar = Math.random();
            let variationTotal = 0;
            each(exp.variations, (v) => {
              if (variationVar <= (variationTotal + v.trafficAllocation)) {
                selectedVariation = `${v.id}`;
                return false;
              }
              variationTotal += v.trafficAllocation;
            });
          }
        }

        if (selectedVariation) {
          newExperiments[`${exp.id}`] = selectedVariation;
        }
      });

      // Update variation assignment.
      await assignment.update({
        userID,
        experiments: newExperiments,
      });

      // Return script with embedded assignments.
      const opts = {
        experiments: newExperiments,
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
