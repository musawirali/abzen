import { Request } from 'express';
import { GraphQLFieldConfig, GraphQLList, GraphQLNonNull, GraphQLString, GraphQLInt } from 'graphql';
import { Op } from 'sequelize';

import { Goal as GoalModel } from '../../models';
import { Goal } from '../types/goal';

const MAX_SEARCH_RESULTS = 50;

interface SearchGoalsArgs {
  searchTerm: string;
  limit: number;
}

export const searchGoals: GraphQLFieldConfig<never, Request, SearchGoalsArgs> = {
  type: new GraphQLList(new GraphQLNonNull(Goal)),
  args: {
    searchTerm: {
      type: new GraphQLNonNull(GraphQLString),
    },
    limit: {
      type: GraphQLInt,
      defaultValue: 10,
    },
  },
  resolve: async (src, args, ctx) => {
    if (!ctx.user) {
      return null;
    }

    const { searchTerm } = args;
    const limit = Math.min(MAX_SEARCH_RESULTS, args.limit);
    const goals = await GoalModel.findAll({
      where: {
        name: {
          [Op.iLike]: `%${searchTerm}%`,
        },
      },
      order: [['createdAt', 'DESC']],
      limit,
    });

    return goals;
  },
};