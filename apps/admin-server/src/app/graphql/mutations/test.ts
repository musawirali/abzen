import { GraphQLString } from 'graphql';
import { mutationWithClientMutationId, MutationConfig } from 'graphql-relay';

interface TestInput {
  name: string;
}

const config: MutationConfig = {
  name: 'Test',
  inputFields: {
    name: {
      type: GraphQLString,
    },
  },
  outputFields: {
    greeting: {
      type: GraphQLString,
      resolve: ({ name }) => `Hello, ${name}`,
    },
  },
  mutateAndGetPayload: ({ name }: TestInput) => {
    return { name };
  },
};

export default mutationWithClientMutationId(config);