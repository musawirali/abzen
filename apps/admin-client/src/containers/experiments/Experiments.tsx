import React, { useCallback } from 'react';
import { Switch, Route, useRouteMatch, useHistory, Redirect } from 'react-router-dom';

import { ExperimentsList } from './components/experiments_list/ExperimentsList';
import { CreateExperiment } from './components/create_experiment/CreateExperiment';

/**
 * Container for experimented related views.
 */
export const Experiments = () => {
  const { url } = useRouteMatch();
  const history = useHistory();

  const makePath = useCallback((path = '') => {
    const u = url.slice(-1) === '/' ? url.slice(0, -1) : url;
    return `${u}${path}`;
  }, [url]);

  return (
    <Switch>
      <Route path={makePath('')} exact strict>
        <ExperimentsList gotoCreate={() => { history.push(makePath('/create')); }} />
      </Route>

      <Route path={makePath('/create')}>
        <CreateExperiment />
      </Route>

      <Redirect to={makePath('')}/>
    </Switch>
  );
};
