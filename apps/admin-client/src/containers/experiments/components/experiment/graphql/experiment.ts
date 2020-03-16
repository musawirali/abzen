import { gql } from 'apollo-boost';

export const EXPERIMENT_FRAGMENT = gql`
  fragment ExperimentExperiment on Experiment {
    id
    name
    type
    status
    project {
      id
      name
    }
    variations {
      id
      name
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
  type: ExperimentType;
  status: ExperimentStatus;
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