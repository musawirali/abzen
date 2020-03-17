import { Request } from 'express';
import { AuthenticationError, UserInputError } from 'apollo-server';
import { GraphQLNonNull, GraphQLList, GraphQLID, GraphQLInputObjectType, GraphQLInt } from 'graphql';
import { mutationWithClientMutationId, MutationConfig } from 'graphql-relay';
import { Op } from 'sequelize';
import isNil from 'lodash/isNil';
import find from 'lodash/find';
import map from 'lodash/map';
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
  goalIDs: string[] | null;
  primaryGoalID: string | null;
  variations: {
    id: string;
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
          id: { type: new GraphQLNonNull(GraphQLID) },
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
        // Update global traffic allocation
        await experiment.update({
          trafficAllocation: trafficAllocation / 100,
        });

        // Update variation traffic allocations
        await Promise.all(map(variations, variation => VariationModel.update({
          trafficAllocation: variation.trafficAllocation / 100,
        }, {
          where: {
            id: variation.id,
          },
        })));

        // TODO: Variation adding/removing

        await t.commit();
      } catch (err) {
        await t.rollback();
        throw err;
      }
    }

    return {
      experiment,
    };
  },
};

export default mutationWithClientMutationId(config);