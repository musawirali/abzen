import { Request } from 'express';
import { GraphQLFieldConfig, GraphQLNonNull, GraphQLID } from 'graphql';
import { UserInputError } from 'apollo-server';

import { Experiment as ExperimentModel } from '../../models';
import { Experiment } from '../types/experiment';

interface ExperimentInput {
  id: string;
}

export const experiment: GraphQLFieldConfig<never, Request, ExperimentInput> = {
  type: new GraphQLNonNull(Experiment),
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  resolve: async (src, args, ctx) => {
    if (!ctx.user) {
      return null;
    }

    // TODO: pagination.
    const experiment = await ExperimentModel.findByPk(args.id);
    if (!experiment) {
      throw new UserInputError(`Experiment with ID "${args.id}" not found.`);
    }

    return experiment;
  },
};