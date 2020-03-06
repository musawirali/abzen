import React from 'react';
import { ApolloQueryResult } from 'apollo-boost';

import { ViewerQueryData } from '../app/graphql/viewer';
import { User } from '../app/graphql/user';
import { Logout } from './components/logout/Logout';

interface HomePropsType {
  user: User | null;
  refetch: () => Promise<ApolloQueryResult<ViewerQueryData>>;
}

export const Home = (props: HomePropsType) => {
  const { user, refetch } = props;

  return user && (
    <div>
      Hello, {user.name}!

      <Logout refetch={refetch} />
    </div>
  );
};