import { gql } from 'apollo-boost';

export const LOGOUT_MUTATION = gql`
  mutation Logout($input: LogoutInput!) {
    logout(input: $input) {
      viewer {
        user {
          id
        }
      }
    }
  }
`;