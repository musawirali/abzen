import { GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLString, GraphQLEnumType, GraphQLList } from 'graphql';

import { Experiment as ExperimentModel, ExperimentType, ExperimentStatus } from '../../models';
import { Project } from './project';
import { Goal } from './goal';

export const GQLExperimentType = new GraphQLEnumType({
  name: 'ExperimentType',
  values: {
    A_B: { value: ExperimentType.A_B },
    Multivariate: { value: ExperimentType.Multivariate },
  },
});

export const GQLExperimentStatus = new GraphQLEnumType({
  name: 'ExperimentStatus',
  values: {
    NotStarted: { value: ExperimentStatus.NotStarted },
    Running: { value: ExperimentStatus.Running },
    Paused: { value: ExperimentStatus.Paused },
  },
});

export const Experiment = new GraphQLObjectType<ExperimentModel>({
  name: 'Experiment',
  description: 'Experiment',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    type: {
      type: new GraphQLNonNull(GQLExperimentType),
    },
    status: {
      type: new GraphQLNonNull(GQLExperimentStatus),
    },
    project: {
      type: Project,
      resolve: async (src) => {
        return src.$get('project');
      },
    },
    goals: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Goal))),
      resolve: async (src) => {
        return src.$get('goals');
      },
    },
    createdAt: {
      type: new GraphQLNonNull(GraphQLString),
    },
    updatedAt: {
      type: new GraphQLNonNull(GraphQLString),
    }
  }),
});
