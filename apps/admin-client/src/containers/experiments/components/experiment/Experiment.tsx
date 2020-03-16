import React, { useCallback, useMemo } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Switch, Route, useRouteMatch, Redirect } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import map from 'lodash/map';
import findIndex from 'lodash/findIndex';

import { Sidebar } from './components/sidebar/Sidebar';
import { Goals } from '../goals/Goals';

import { ExperimentQueryData, EXPERIMENT_QUERY } from './graphql/experiment';
import './style.css';

/**
 * Container for experiment
 */
export const Experiment = () => {
  const { url, params: { id } } = useRouteMatch<{ id: string }>();

  const makePath = useCallback((path = '') => {
    const u = url.slice(-1) === '/' ? url.slice(0, -1) : url;
    return `${u}${path}`;
  }, [url]);

  const { loading, error, data } = useQuery<ExperimentQueryData>(EXPERIMENT_QUERY, {
    variables: {
      id,
    },
  });

  const goals = useMemo(() => {
    return map(data?.experiment.goals, goal => ({
      id: goal.id,
      name: goal.name,
    }))
  }, [data]);
  const primaryGoalIdx = useMemo(() => {
    return findIndex(data?.experiment.goals, goal => goal.isPrimary);
  }, [data]);

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

  if (!data) {
    return <div>Failed to get experiment data.</div>;
  }

  return (
    <Row>
      <Col
        md={{ offset: 2, span: 2 }}
        className="experiment-sidebar"
      >
        <Sidebar experiment={data.experiment} path={makePath()} />
      </Col>

      {/* Content */}
      <Col
        className="ml-sm-auto px-4"
        md={7}
        sm="auto"
        lg={9}
      >
        <Switch>
          <Route path={makePath()} exact strict>
            {id}
          </Route>

          <Route path={makePath('/variations')}>
            Variations
          </Route>

          <Route path={makePath('/goals')}>
            <Goals
              onNext={() => {
                // TODO: Save to DB
              }}
              data={{ goals, primaryIdx: primaryGoalIdx }}
            />
          </Route>

          <Route path={makePath('/settings')}>
            Settings
          </Route>

          <Route path={makePath('/history')}>
            History
          </Route>

          <Redirect to={makePath()}/>
        </Switch>
      </Col>
    </Row>
  );
};
