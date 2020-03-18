import { Request } from 'express';
import { AuthenticationError, UserInputError } from 'apollo-server';
import { GraphQLNonNull, GraphQLList, GraphQLID, GraphQLInputObjectType, GraphQLInt, GraphQLString } from 'graphql';
import { mutationWithClientMutationId, MutationConfig } from 'graphql-relay';
import { Op } from 'sequelize';
import isNil from 'lodash/isNil';
import find from 'lodash/find';
import map from 'lodash/map';
import each from 'lodash/each';
import difference from 'lodash/difference';
import includes from 'lodash/includes';
import sumBy from 'lodash/sumBy';

import {
  Experiment as ExperimentModel,
  Goal as GoalModel,
  Variation as VariationModel,
} from '../../models';
import { Experiment } from '../types/experiment';

interface UpdateExperimentInput {
  id: string;
  name: string | null;
  info: string | null;
  projectID: string | null;
  goalIDs: string[] | null;
  primaryGoalID: string | null;
  variations: {
    id?: string;
    name?: string;
    trafficAllocation: number;
  }[] | null,
  trafficAllocation: number | null;
}

interface UpdateExperimentOutput {
  experiment: ExperimentModel;
}

/**
 * Mutation for updating an experiment.
 */
const config: MutationConfig = {
  name: 'UpdateExperiment',
  inputFields: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    name: {
      type: GraphQLString,
    },
    info: {
      type: GraphQLString,
    },
    projectID: {
      type: GraphQLString,
    },
    goalIDs: {
      description: 'List of goal IDs',
      type: new GraphQLList(new GraphQLNonNull(GraphQLID)),
    },
    primaryGoalID: {
      description: 'Primary goal ID',
      type: GraphQLID,
    },
    variations: {
      description: 'Variations and their traffic allocations',
      type: new GraphQLList(new GraphQLInputObjectType({
        name: 'UpdateExperimentVariationsInput',
        fields: {
          id: { type: GraphQLID },
          name: { type: GraphQLString },
          trafficAllocation: { type: new GraphQLNonNull(GraphQLInt) },
        },
      })),
    },
    trafficAllocation: {
      description: 'Traffic allocation for experiment',
      type: GraphQLInt,
    },
  },
  outputFields: {
    experiment: {
      type: new GraphQLNonNull(Experiment),
      resolve: ({ experiment }: UpdateExperimentOutput) => experiment,
    },
  },
  mutateAndGetPayload: async (args: UpdateExperimentInput, ctx: Request): Promise<UpdateExperimentOutput> => {
    if (!ctx.user) throw new AuthenticationError('Not logged in.');

    const {
      id,
      goalIDs, primaryGoalID,
      variations, trafficAllocation,
      name, info, projectID,
    } = args;

    // Create DB records
    const { sequelize } = ExperimentModel;
    if (!sequelize) {
      // Should never happen.
      throw new Error('DB instance not available');
    }

    // Get experiment
    const experiment = await ExperimentModel.findByPk(id);
    if (!experiment) {
      throw new UserInputError(`Experiment with ID "${id}" not found!`);
    }

    // Update goals
    if (goalIDs || primaryGoalID) {
      if (!goalIDs) {
        throw new UserInputError('"goalIDs" must be specified.');
      }
      if (!primaryGoalID) {
        throw new UserInputError('"primaryGoalID" must be specified.');
      }

      const goals = await GoalModel.findAll({
        where: {
          id: {
            [Op.in]: goalIDs,
          },
        },
      });
      const missingGoalIDs = difference(goalIDs, map(goals, goal => `${goal.id}`));
      if (missingGoalIDs.length > 0) {
        throw new UserInputError(`Goal IDs "${missingGoalIDs.join(',')}" not found!`);
      }

      // Check primaryGoalID
      if (!includes(goalIDs, primaryGoalID)) {
        throw new UserInputError(`Primary goal ID must be part of provided goal IDs. "${primaryGoalID}" not found in "${goalIDs.join(',')}".`)
      }

      const t = await sequelize.transaction();
      try {
        await experiment.$set('goals', goals, { through: { isPrimary: false } });
        const primaryGoal = find(goals, goal => `${goal.id}` === primaryGoalID);
        if (primaryGoal) {
          experiment.$add('goals', primaryGoal, { through: { isPrimary: true } });
        }

        await t.commit();
      } catch (err) {
        await t.rollback();
        throw err;
      }
    }

    // Update variations
    if (variations || !isNil(trafficAllocation)) {
      if (!variations) {
        throw new UserInputError('"variations" must be specified.');
      }
      if (isNil(trafficAllocation)) {
        throw new UserInputError('"trafficAllocation" must be specified.');
      }

      // Validate traffic allocations
      if (trafficAllocation < 0 || trafficAllocation > 100) {
        throw new UserInputError(`Global traffic allocation must be between 0 and 100. Received: "${trafficAllocation}"`);
      }

      // Validate variation traffic allocations
      const badVar = find(variations, variation => variation.trafficAllocation < 0 || variation.trafficAllocation > 100);
      if (badVar) {
        throw new UserInputError(`Variation traffic allocation must be between 0 and 100. Received: "${badVar.trafficAllocation}" for ID: "${badVar.id}"`);
      }
      const totalAlloc = sumBy(variations, variation => variation.trafficAllocation);
      if (totalAlloc !== 100) {
        throw new UserInputError(`Variation traffic allocation must sum to 100. Received: "${totalAlloc}"`);
      }

      const t = await sequelize.transaction();
      try {
        // Destroy removed variations
        const currentVariations = await experiment.$get('variations');
        const destroyIDs: string[] = [];
        each(currentVariations, (variation) => {
          if (!find(variations, v => v.id === `${variation.id}`)) {
            destroyIDs.push(variation.id);
          }
        });
        // Must be left with at least 2 variations (1 original and 1 variation) after
        // deleting.
        if ((currentVariations.length - destroyIDs.length) < 2) {
          throw new UserInputError(`Too many variations being removed: "${destroyIDs.join(',')}"`);
        }
        await VariationModel.destroy({
          where: {
            id: {
              [Op.in]: destroyIDs,
            },
          },
        });

        // Update / create variation traffic allocations
        await Promise.all(map(variations, async (variation) => {
          if (variation.id) {
            await VariationModel.update({
              trafficAllocation: variation.trafficAllocation / 100,
            }, {
              where: {
                id: variation.id,
              },
            });
          } else {
            await experiment.$create('variation', {
              name: variation.name,
              trafficAllocation: variation.trafficAllocation / 100,
            });
          }
        }));

        // Update global traffic allocation
        await experiment.update({
          trafficAllocation: trafficAllocation / 100,
        });

        await t.commit();
      } catch (err) {
        await t.rollback();
        throw err;
      }
    }

    // Update settings
    if (name || info || projectID) {
      if (!name) {
        throw new UserInputError('"name" must be specified.');
      }
      if (!info) {
        throw new UserInputError('"info" must be specified.');
      }

      await experiment.update({
        name,
        info,
        projectID,
      });
    }

    return {
      experiment,
    };
  },
};

export default mutationWithClientMutationId(config);