import { Request } from 'express';
import { GraphQLFieldConfig } from 'graphql';

import { User } from '../../models/User';
import { Viewer } from '../types/viewer';

export interface Viewer {
  id: 'viewer',
  user: User | null,
}

export const viewer: GraphQLFieldConfig<Viewer, Request> = {
  type: Viewer,
  resolve: async (src, args, ctx) => {
    const { user } = ctx;
    return {
      user,
    };
  },
};