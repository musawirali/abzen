import { gql } from 'apollo-boost';

export const EXPERIMENT_FRAGMENT = gql`
  fragment ExperimentExperiment on Experiment {
    id
    name
    info
    type
    status
    trafficAllocation
    project {
      id
      name
    }
    variations {
      id
      name
      trafficAllocation
    }
    goals {
      id
      name
      isPrimary
    }
    updatedAt
  }
`;

export interface Variation {
  id: string;
  name: string;
  trafficAllocation: number;
}

export interface Goal {
  id: string;
  name: string;
  isPrimary: boolean;
}

export enum ExperimentType {
  A_B = 'ab',
  Multivariate = 'multivariate',
}

export enum ExperimentStatus {
  NotStarted = 'not_started',
  Running = 'running',
  Paused = 'paused',
}

export interface Experiment {
  id: string;
  name: string;
  info: string | null;
  type: ExperimentType;
  status: ExperimentStatus;
  trafficAllocation: number;
  project: {
    id: string;
    name: string;
  } | null,
  variations: Variation[];
  goals: Goal[];
  updatedAt: string;
}

export const EXPERIMENT_QUERY = gql`
  query Experiment($id: ID!) {
    experiment(id: $id) {
      ...ExperimentExperiment
    }
  }

  ${EXPERIMENT_FRAGMENT}
`;

export interface ExperimentQueryData {
  experiment: Experiment;
}

export const UPDATE_EXPERIMENT = gql`
  mutation UpdateExperiment($input: UpdateExperimentInput!) {
    updateExperiment(input: $input) {
      experiment {
        id
      }
    }
  }
`;
