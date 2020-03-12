import React, { useCallback } from 'react';
import { Switch, Route, useRouteMatch, useHistory, Redirect } from 'react-router-dom';

import { ProjectsList } from './components/projects_list/ProjectsList';
import { CreateProject } from './components/create_project/CreateProject';

/**
 * Container for project related views.
 */
export const Projects = () => {
  const { url } = useRouteMatch();
  const history = useHistory();

  const makePath = useCallback((path = '') => {
    const u = url.slice(-1) === '/' ? url.slice(0, -1) : url;
    return `${u}${path}`;
  }, [url]);

  return (
    <Switch>
      <Route path={makePath()} exact strict>
        <ProjectsList gotoCreate={() => { history.push(makePath('/create')); }} />
      </Route>

      <Route path={makePath('/create')}>
        <CreateProject onCreated={() => { history.push(makePath()); }} />
      </Route>

      <Redirect to={makePath()}/>
    </Switch>
  );
};
