import React from 'react';
import { Switch, Route, Redirect, useLocation } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';

import { VIEWER_QUERY, ViewerQueryData } from './graphql/viewer';
import { Home } from '../home/Home';
import { Login } from '../login/Login';

/**
 * App main component.
 */
export const App = () => {
  const location = useLocation();
  const { loading, error, data, refetch } = useQuery<ViewerQueryData>(VIEWER_QUERY);

  if (loading) {
    return <div>Loading ...</div>;
  }

  if (error) {
    return (
      <div>
        Error: {error.message}
      </div>
    )
  }

  const { user } = data.viewer;
  // If the user is not logged in, redirect to the login page.
  if (location.pathname !== '/login' && !user) {
    const redirect = encodeURIComponent(`${location.pathname}${location.search}`);
    return <Redirect to={`/login?redirect=${redirect}`} push={false} />;
  }

  return (
    <div>
      <Switch>
        <Route path="/" exact children={<Home user={user} />} />
        <Route path="/login" children={<Login user={user} refetch={refetch} />} />
        <Redirect to="/" />
      </Switch>
    </div>
  );
};

export default App;
