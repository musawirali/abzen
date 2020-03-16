import React, { useCallback } from 'react';
import { Switch, Route, useRouteMatch, useHistory, Redirect } from 'react-router-dom';

import { ExperimentsList } from './components/experiments_list/ExperimentsList';
import { CreateExperiment } from './components/create_experiment/CreateExperiment';
import { Experiment } from './components/experiment/Experiment';

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
      <Route path={makePath()} exact strict>
        <ExperimentsList
          gotoCreate={() => { history.push(makePath('/create')); }}
          gotoExperiment={(id: string) => { history.push(makePath(`/id${id}`)); }}
        />
      </Route>

      <Route path={makePath('/create')}>
        <CreateExperiment onCancel={() => { history.push(makePath()); }} />
      </Route>

      <Route path={makePath('/id:id')}>
        <Experiment />
      </Route>

      <Redirect to={makePath()}/>
    </Switch>
  );
};
