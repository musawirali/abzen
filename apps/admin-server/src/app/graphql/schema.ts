import { GraphQLSchema, GraphQLObjectType } from 'graphql';

import { viewer } from './queries/viewer';
import { experiments } from './queries/experiments';

import login from './mutations/login';
import logout from './mutations/logout';
import createExperiment from './mutations/create_experiment';

const query = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    viewer,
    experiments,
  }),
});

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    login,
    logout,
    createExperiment,
  }),
});

const schema = new GraphQLSchema({ query, mutation });

export default schema;