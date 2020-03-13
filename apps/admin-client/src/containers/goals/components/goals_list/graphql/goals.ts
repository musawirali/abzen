import { gql } from 'apollo-boost';

export const GOAL_FRAGMENT = gql`
  fragment GoalsListGoal on Goal {
    id
    name
    activeExperimentsCount
    allExperimentsCount
  }
`;

export interface Goal {
  id: string;
  name: string;
  activeExperimentsCount: number;
  allExperimentsCount: number;
}

export const GOALS_QUERY = gql`
  query GoalsList {
    goals {
      ...GoalsListGoal
    }
  }

  ${GOAL_FRAGMENT}
`;

export interface GoalsQueryData {
  goals: Goal[];
}