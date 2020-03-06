import { Request } from 'express';
import { GraphQLFieldConfig } from 'graphql';

import { Viewer, ViewerType } from '../types/viewer';

export const viewer: GraphQLFieldConfig<ViewerType, Request> = {
  type: Viewer,
  resolve: async (src, args, ctx) => {
    const { user } = ctx;
    return {
      user,
    };
  },
};