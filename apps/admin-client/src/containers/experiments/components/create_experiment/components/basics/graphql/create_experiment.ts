import { gql } from 'apollo-boost';

export const CREATE_EXPERIMENT_MUTATION = gql`
  mutation CreateExperiment($input: CreateExperimentInput!) {
    createExperiment(input: $input) {
      experiment {
        id
        name
      }
    }
  }
`;