import { GraphQLSchema, GraphQLObjectType } from 'graphql';
import test from './mutations/test';

const query = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    test,
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