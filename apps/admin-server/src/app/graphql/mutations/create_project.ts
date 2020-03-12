import { Request } from 'express';
import { AuthenticationError, UserInputError } from 'apollo-server';
import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId, MutationConfig } from 'graphql-relay';

import { Project as ProjectModel } from '../../models';
import { Project } from '../types/project';

interface CreateProjectInput {
  name: string;
}

interface CreateProjectOutput {
  project: ProjectModel;
}

/**
 * Mutation for creating a new project.
 */
const config: MutationConfig = {
  name: 'CreateProject',
  inputFields: {
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  outputFields: {
    project: {
      type: new GraphQLNonNull(Project),
      resolve: ({ project }: CreateProjectOutput) => project,
    },
  },
  mutateAndGetPayload: async (args: CreateProjectInput, ctx: Request): Promise<CreateProjectOutput> => {
    if (!ctx.user) throw new AuthenticationError('Not logged in.');

    const { name } = args;
    let project: ProjectModel;
    try {
      project = await ProjectModel.create({
        name,
      });
    } catch (err) {
      throw new UserInputError(err.message);
    }

    return {
      project,
    };
  },
};

export default mutationWithClientMutationId(config);