import React, { useCallback } from 'react';
import { Switch, Route, useRouteMatch, useHistory, Redirect } from 'react-router-dom';

import { GoalsList } from './components/goals_list/GoalsList';
import { CreateGoal } from './components/create_goal/CreateGoal';

/**
 * Container for goal related views.
 */
export const Goals = () => {
  const { url } = useRouteMatch();
  const history = useHistory();

  const makePath = useCallback((path = '') => {
    const u = url.slice(-1) === '/' ? url.slice(0, -1) : url;
    return `${u}${path}`;
  }, [url]);

  return (
    <Switch>
      <Route path={makePath()} exact strict>
        <GoalsList gotoCreate={() => { history.push(makePath('/create')); }} />
      </Route>

      <Route path={makePath('/create')}>
        <CreateGoal onCreated={() => { history.push(makePath()); }} />
      </Route>

      <Redirect to={makePath()}/>
    </Switch>
  );
};
