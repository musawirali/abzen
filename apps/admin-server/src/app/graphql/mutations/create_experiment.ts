import { Request } from 'express';
import { AuthenticationError, UserInputError } from 'apollo-server';
import { GraphQLNonNull, GraphQLString, GraphQLInt, GraphQLList, GraphQLInputObjectType, GraphQLID } from 'graphql';
import { mutationWithClientMutationId, MutationConfig } from 'graphql-relay';
import { Op } from 'sequelize';
import find from 'lodash/find';
import sum from 'lodash/sum';
import map from 'lodash/map';
import difference from 'lodash/difference';
import includes from 'lodash/includes';

import {
  Experiment as ExperimentModel, ExperimentType,
  Project as ProjectModel,
  Goal as GoalModel,
} from '../../models';
import { Experiment } from '../types/experiment';

interface CreateExperimentInput {
  name: string;
  info: string;
  projectID?: string | null;
  variations: {
    name: string;
    trafficAllocation: number;
  }[],
  goalIDs: string[];
  primaryGoalID: string;
  trafficAllocation: number;
}

interface CreateExperimentOutput {
  experiment: ExperimentModel;
}

/**
 * Mutation for creating a new experiment.
 */
const config: MutationConfig = {
  name: 'CreateExperiment',
  inputFields: {
    name: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Experiment name',
    },
    info: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Experiment description',
    },
    projectID: {
      type: GraphQLID,
      description: 'Project ID',
    },
    variations: {
      description: 'List of variations. Each variation specifies a name and percent traffic allocation. Must add up to 100.',
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(new GraphQLInputObjectType({
        name: 'CreateExperimentVariation',
        fields: {
          name: { type: new GraphQLNonNull(GraphQLString) },
          trafficAllocation: { type: new GraphQLNonNull(GraphQLInt) },
        },
      })))),
    },
    goalIDs: {
      description: 'List of goal IDs',
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLID))),
    },
    primaryGoalID: {
      description: 'Primary goal ID',
      type: new GraphQLNonNull(GraphQLID),
    },
    trafficAllocation: {
      description: 'Percent of traffic to run this experiment on',
      type: new GraphQLNonNull(GraphQLInt),
    },
  },
  outputFields: {
    experiment: {
      type: new GraphQLNonNull(Experiment),
      resolve: ({ experiment }: CreateExperimentOutput) => experiment,
    },
  },
  mutateAndGetPayload: async (args: CreateExperimentInput, ctx: Request): Promise<CreateExperimentOutput> => {
    if (!ctx.user) throw new AuthenticationError('Not logged in.');

    const { name, info, projectID, variations, goalIDs, primaryGoalID, trafficAllocation } = args;

    // Check projectID
    if (projectID) {
      const project = await ProjectModel.findByPk(projectID);
      if (!project) {
        throw new UserInputError(`Project with ID "${projectID}" not found!`);
      }
    }

    // Check variations
    if (variations.length === 0) {
      throw new UserInputError('At least one variation must be specified.');
    }
    if (find(variations, variation => variation.trafficAllocation < 0)) {
      throw new UserInputError('Variations cannot have negative traffic allocation.');
    }
    const totalVariationAllocation = sum(map(variations, 'trafficAllocation'));
    if (totalVariationAllocation !== 100) {
      throw new UserInputError(`Traffic allocation of all variations must add up to 100. Got "${totalVariationAllocation}".`);
    }

    // Check goalIDs
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

    // Check trafficAllocation
    if (trafficAllocation < 0 || trafficAllocation > 100) {
      throw new UserInputError(`Traffic allocation must be between 0 and 100. Provided "${trafficAllocation}".`);
    }

    // Create DB records
    const { sequelize } = ExperimentModel;
    if (!sequelize) {
      // Should never happen.
      throw new Error('DB instance not available');
    }

    const t = await sequelize.transaction();
    let experiment: ExperimentModel;
    try {
      experiment = await ExperimentModel.create({
        name,
        info,
        trafficAllocation: trafficAllocation / 100,
        type: variations.length > 2 ? ExperimentType.Multivariate : ExperimentType.A_B,
        projectID,
      });
      await Promise.all(map(variations, variation => experiment.$create('variation', {
        name: variation.name,
        trafficAllocation: variation.trafficAllocation / 100,
      })));

      await Promise.all(map(goalIDs, goalID => experiment.$add('goals', goalID, {
        through: {
          isPrimary: goalID === primaryGoalID,
        },
      })));

      await t.commit();
    } catch (err) {
      await t.rollback();
      throw err;
    }

    return {
      experiment,
    };
  },
};

export default mutationWithClientMutationId(config);