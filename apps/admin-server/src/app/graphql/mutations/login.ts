import { Request } from 'express';
import { AuthenticationError } from 'apollo-server';
import { GraphQLString, GraphQLNonNull } from 'graphql';
import { mutationWithClientMutationId, MutationConfig } from 'graphql-relay';
import get from 'lodash/get';

import { verifyFunc } from '../../utils/auth';
import { Viewer } from '../types/viewer';
import { User } from '../../models';

interface LoginInput {
  username: string;
  password: string;
}

interface LoginOutput {
  viewer: {
    user: User,
  };
}

/**
 * Mutation for logging a user in by verifying `username` and `password`, and
 * setting the user in the current session.
 */
const config: MutationConfig = {
  name: 'Login',
  inputFields: {
    username: {
      type: new GraphQLNonNull(GraphQLString),
    },
    password: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  outputFields: {
    viewer: {
      type: new GraphQLNonNull(Viewer),
      resolve: ({ viewer }: LoginOutput) => viewer,
    },
  },
  mutateAndGetPayload: ({ username, password }: LoginInput, ctx: Request) => new Promise<LoginOutput>((resv, rej) => {
    verifyFunc(username, password, (err, user, opts) => {
      if (err) rej(err);
      if (!user) rej(new AuthenticationError(get(opts, 'message') || 'Invalid credentials provided.'));

      ctx.logIn(user, (sessionErr) => {
        if (sessionErr) rej(sessionErr);

        resv({ viewer: { user } });
      });
    });
  }),
};

export default mutationWithClientMutationId(config);