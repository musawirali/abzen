import React from 'react';

import { User } from '../app/graphql/user';

interface HomePropsType {
  user: User;
}

export const Home = (props: HomePropsType) => {
  const { user } = props;

  return (
    <div>
      Hello, {user.name}!
    </div>
  );
};