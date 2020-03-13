import { gql } from 'apollo-boost';

export const EXPERIMENT_FRAGMENT = gql`
  fragment ExperimentListExperiment on Experiment {
    id
    name
    type
    status
    project {
      id
      name
    }
    updatedAt
  }
`;

export interface Experiment {
  id: string;
  name: string;
  type: string;
  status: string;
  project: {
    id: string;
    name: string;
  } | null,
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