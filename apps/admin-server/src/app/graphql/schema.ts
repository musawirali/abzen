import { GraphQLSchema, GraphQLObjectType } from 'graphql';

import { viewer } from './queries/viewer';

import login from './mutations/login';
import logout from './mutations/logout';

const query = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    viewer,
  }),
});

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    login,
    logout,
  }),
});

const schema = new GraphQLSchema({ query, mutation });

export default schema;