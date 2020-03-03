import { GraphQLSchema, GraphQLObjectType } from 'graphql';

import { viewer } from './queries/viewer';

import login from './mutations/login';

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
  }),
});

const schema = new GraphQLSchema({ query, mutation });

export default schema;