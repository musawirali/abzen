import { Request } from 'express';
import { GraphQLFieldConfig, GraphQLList, GraphQLNonNull } from 'graphql';

import { Goal as GoalModel } from '../../models';
import { Goal } from '../types/goal';

export const goals: GraphQLFieldConfig<never, Request> = {
  type: new GraphQLList(new GraphQLNonNull(Goal)),
  resolve: async (src, args, ctx) => {
    if (!ctx.user) {
      return null;
    }

    // TODO: pagination.
    const goals = await GoalModel.findAll();

    return goals;
  },
};