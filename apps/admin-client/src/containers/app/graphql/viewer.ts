import { gql } from 'apollo-boost';

export const VIEWER_QUERY = gql`
  query {
    viewer {
      user {
        id
      }
    }
  }
`;

export interface ViewerQueryData {
  viewer: {
    user: {
      id: string;
    } | null;
  };
}