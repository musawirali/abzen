import { Request } from 'express';
import { AuthenticationError, UserInputError } from 'apollo-server';
import { GraphQLNonNull, GraphQLString, GraphQLInt } from 'graphql';
import { mutationWithClientMutationId, MutationConfig } from 'graphql-relay';

import { Experiment as ExperimentModel, ExperimentType } from '../../models';
import { Experiment } from '../types/experiment';

interface CreateExperimentInput {
  name: string;
  projectID?: number | null;
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
    },
    projectID: {
      type: GraphQLInt,
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

    const { name, projectID } = args;
    let experiment: ExperimentModel;
    try {
      experiment = await ExperimentModel.create({
        name,
        type: ExperimentType.A_B,
        projectID,
      });
    } catch (err) {
      throw new UserInputError(err.message);
    }

    return {
      experiment,
    };
  },
};

export default mutationWithClientMutationId(config);