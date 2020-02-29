import { GraphQLObjectType, GraphQLNonNull, GraphQLID } from 'graphql';

export const User = new GraphQLObjectType({
  name: 'User',
  description: 'User',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
  }),
});
