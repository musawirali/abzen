import { gql } from 'apollo-boost';

export const USER_FRAGMENT = gql`
  fragment AppUser on User {
    id
    name
    username
    createdAt
    updatedAt
  }
`;

export interface User {
  id: string;
  name: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}