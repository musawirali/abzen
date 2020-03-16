import { GraphQLSchema, GraphQLObjectType } from 'graphql';

import { viewer } from './queries/viewer';
import { experiments } from './queries/experiments';
import { experiment } from './queries/experiment';
import { projects } from './queries/projects';
import { goals } from './queries/goals';
import { searchGoals } from './queries/search_goals';

import login from './mutations/login';
import logout from './mutations/logout';
import createExperiment from './mutations/create_experiment';
import createProject from './mutations/create_project';
import createGoal from './mutations/create_goal';

const query = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    viewer,
    experiments,
    experiment,
    projects,
    goals,
    searchGoals,
  }),
});

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    login,
    logout,
    createExperiment,
    createProject,
    createGoal,
  }),
});

const schema = new GraphQLSchema({ query, mutation });

export default schema;