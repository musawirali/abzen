import { gql } from 'apollo-boost';

import { USER_FRAGMENT, User } from './user';

export const VIEWER_FRAGMENT = gql`
  fragment AppViewer on Viewer {
    user {
      ...AppUser
    }
  }
  ${USER_FRAGMENT}
`;

export interface Viewer {
  user: User | null;
}

export const VIEWER_QUERY = gql`
  query {
    viewer {
      ...AppViewer
    }
  }

  ${VIEWER_FRAGMENT}
`;

export interface ViewerQueryData {
  viewer: Viewer;
}