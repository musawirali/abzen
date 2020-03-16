import { GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLString, GraphQLInt, GraphQLBoolean } from 'graphql';

import { Goal as GoalModel, ExperimentStatus } from '../../models';

export const Goal = new GraphQLObjectType<GoalModel>({
  name: 'Goal',
  description: 'Goal',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    activeExperimentsCount: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: async (src) => {
        return src.$count('experiments', {
          where: {
            archivedAt: null,
            status: ExperimentStatus.Running,
          },
        })
      },
    },
    allExperimentsCount: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: async (src) => {
        return src.$count('experiments', {
          where: {
            archivedAt: null,
          },
        })
      },
    },
    isPrimary: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: async ({ ExperimentGoal }) => {
        return ExperimentGoal ? ExperimentGoal.isPrimary : false;
      },
    },
    archivedAt: {
      type: new GraphQLNonNull(GraphQLString),
    },
    createdAt: {
      type: new GraphQLNonNull(GraphQLString),
    },
    updatedAt: {
      type: new GraphQLNonNull(GraphQLString),
    }
  }),
});
