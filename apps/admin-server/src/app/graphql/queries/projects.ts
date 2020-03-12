import { Request } from 'express';
import { GraphQLFieldConfig, GraphQLList, GraphQLNonNull } from 'graphql';

import { Project as ProjectModel } from '../../models';
import { Project } from '../types/project';

export const projects: GraphQLFieldConfig<never, Request> = {
  type: new GraphQLList(new GraphQLNonNull(Project)),
  resolve: async (src, args, ctx) => {
    if (!ctx.user) {
      return null;
    }

    // TODO: pagination.
    const projects = await ProjectModel.findAll();

    return projects;
  },
};