import { GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLString, GraphQLInt } from 'graphql';

import { Project as ProjectModel } from '../../models';
import { ExperimentStatus } from '../../models/Experiment';

export const Project = new GraphQLObjectType<ProjectModel>({
  name: 'Project',
  description: 'Project',
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
