import { Request } from 'express';
import { GraphQLFieldConfig, GraphQLList, GraphQLNonNull } from 'graphql';

import { Experiment as ExperimentModel } from '../../models';
import { Experiment } from '../types/experiment';

export const experiments: GraphQLFieldConfig<never, Request> = {
  type: new GraphQLList(new GraphQLNonNull(Experiment)),
  resolve: async (src, args, ctx) => {
    if (!ctx.user) {
      return null;
    }

    // TODO: pagination.
    const experiments = await ExperimentModel.findAll();

    return experiments;
  },
};