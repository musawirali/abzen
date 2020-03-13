import { gql } from 'apollo-boost';

export const GOAL_FRAGMENT = gql`
  fragment GoalSearchGoal on Goal {
    id
    name
  }
`;

export interface Goal {
  id: number;
  name: string;
}

export const GOALS_QUERY = gql`
  query GoalSearch($searchTerm: String!) {
    searchGoals(searchTerm: $searchTerm) {
      ...GoalSearchGoal
    }
  }

  ${GOAL_FRAGMENT}
`;

export interface GoalSearchQueryData {
  searchGoals: Goal[];
}