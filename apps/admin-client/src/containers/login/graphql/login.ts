import { gql } from 'apollo-boost';

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      viewer {
        user {
          id
        }
      }
    }
  }
`;