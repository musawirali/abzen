import { gql } from 'apollo-boost';

import { EXPERIMENT_FRAGMENT, Experiment } from '../../experiments_list/graphql/experiments'

export const CREATE_EXPERIMENT_MUTATION = gql`
  mutation CreateExperiment($input: CreateExperimentInput!) {
    createExperiment(input: $input) {
      experiment {
        ...ExperimentListExperiment
      }
    }
  }
  ${EXPERIMENT_FRAGMENT}
`;

export interface CreateExperimentMutationDataType {
  createExperiment: {
    experiment: Experiment,
  },
}