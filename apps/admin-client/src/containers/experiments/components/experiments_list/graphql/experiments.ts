import { gql } from 'apollo-boost';

export const EXPERIMENT_FRAGMENT = gql`
  fragment ExperimentListExperiment on Experiment {
    id
    name
    type
    status
    updatedAt
  }
`;

export interface Experiment {
  id: number;
  name: string;
  type: string;
  status: string;
  updatedAt: string;
}

export const EXPERIMENTS_QUERY = gql`
  query {
    experiments {
      ...ExperimentListExperiment
    }
  }

  ${EXPERIMENT_FRAGMENT}
`;

export interface ExperimentsQueryData {
  experiments: Experiment[];
}