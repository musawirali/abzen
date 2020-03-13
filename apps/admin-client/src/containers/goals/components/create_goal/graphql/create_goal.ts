import { gql } from 'apollo-boost';
import { GOAL_FRAGMENT, Goal } from '../../goals_list/graphql/goals';

export const CREATE_GOAL_MUTATION = gql`
  mutation CreateGoal($input: CreateGoalInput!) {
    createGoal(input: $input) {
      goal {
        ...GoalsListGoal
      }
    }
  }

  ${GOAL_FRAGMENT}
`;

export interface CreateGoalMutationDataType {
  createGoal: {
    goal: Goal,
  },
}