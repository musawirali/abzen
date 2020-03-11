import { GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLString, GraphQLEnumType } from 'graphql';
import { Experiment as ExperimentModel, ExperimentType, ExperimentStatus } from '../../models';

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
    createdAt: {
      type: new GraphQLNonNull(GraphQLString),
    },
    updatedAt: {
      type: new GraphQLNonNull(GraphQLString),
    }
  }),
});
