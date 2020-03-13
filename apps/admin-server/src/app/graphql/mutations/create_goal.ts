import { Request } from 'express';
import { AuthenticationError, UserInputError } from 'apollo-server';
import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId, MutationConfig } from 'graphql-relay';

import { Goal as GoalModel } from '../../models';
import { Goal } from '../types/goal';

interface CreateGoalInput {
  name: string;
}

interface CreateGoalOutput {
  goal: GoalModel;
}

/**
 * Mutation for creating a new goal.
 */
const config: MutationConfig = {
  name: 'CreateGoal',
  inputFields: {
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  outputFields: {
    goal: {
      type: new GraphQLNonNull(Goal),
      resolve: ({ goal }: CreateGoalOutput) => goal,
    },
  },
  mutateAndGetPayload: async (args: CreateGoalInput, ctx: Request): Promise<CreateGoalOutput> => {
    if (!ctx.user) throw new AuthenticationError('Not logged in.');

    const { name } = args;
    let goal: GoalModel;
    try {
      goal = await GoalModel.create({
        name,
      });
    } catch (err) {
      throw new UserInputError(err.message);
    }

    return {
      goal,
    };
  },
};

export default mutationWithClientMutationId(config);