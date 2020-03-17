import { GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLString, GraphQLInt } from 'graphql';

import { Variation as VariationModel } from '../../models';

export const Variation = new GraphQLObjectType<VariationModel>({
  name: 'Variation',
  description: 'Variation',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    trafficAllocation: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: src => Math.floor(src.trafficAllocation * 100),
    },
    createdAt: {
      type: new GraphQLNonNull(GraphQLString),
    },
    updatedAt: {
      type: new GraphQLNonNull(GraphQLString),
    }
  }),
});
