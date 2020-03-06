import { Request } from 'express';
import { GraphQLNonNull } from 'graphql';
import { mutationWithClientMutationId, MutationConfig } from 'graphql-relay';

import { Viewer } from '../types/viewer';

interface LogoutOutput {
  viewer: {
    user: null,
  };
}

/**
 * Mutation for logging the user out by removing the user from the current
 * session.
 */
const config: MutationConfig = {
  name: 'Logout',
  inputFields: {},
  outputFields: {
    viewer: {
      type: new GraphQLNonNull(Viewer),
      resolve: ({ viewer }: LogoutOutput) => viewer,
    },
  },
  mutateAndGetPayload: async (args: never, ctx: Request): Promise<LogoutOutput> => {
    ctx.logOut();

    return {
      viewer: { user: null },
    };
  },
};

export default mutationWithClientMutationId(config);