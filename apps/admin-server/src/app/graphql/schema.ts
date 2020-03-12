import { GraphQLSchema, GraphQLObjectType } from 'graphql';

import { viewer } from './queries/viewer';
import { experiments } from './queries/experiments';
import { projects } from './queries/projects';

import login from './mutations/login';
import logout from './mutations/logout';
import createExperiment from './mutations/create_experiment';
import createProject from './mutations/create_project';

const query = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    viewer,
    experiments,
    projects,
  }),
});

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    login,
    logout,
    createExperiment,
    createProject,
  }),
});

const schema = new GraphQLSchema({ query, mutation });

export default schema;