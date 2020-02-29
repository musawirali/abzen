import { GraphQLObjectType, GraphQLNonNull, GraphQLID } from 'graphql';

import { User } from './user';

export const Viewer = new GraphQLObjectType({
  name: 'Viewer',
  description: 'Authenticated user',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: () => 'viewer',
    },
    user: {
      type: User,
    },
  }),
});
