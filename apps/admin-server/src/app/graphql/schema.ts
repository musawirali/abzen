import { GraphQLSchema, GraphQLObjectType } from 'graphql';
import { viewer } from './queries/viewer';
import test from './mutations/test';

const query = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    viewer,
  }),
});

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    test,
  }),
});

const schema = new GraphQLSchema({ query, mutation });

export default schema;