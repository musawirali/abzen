import { GraphQLObjectType, GraphQLNonNull, GraphQLID } from 'graphql';

import { User as UserModel } from '../../models/User';
import { User } from './user';

export interface ViewerType {
  id: 'viewer',
  user: UserModel | null,
}

export const Viewer = new GraphQLObjectType<ViewerType>({
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
