import React, { useCallback, useMemo } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Switch, Route, useRouteMatch, Redirect } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/react-hooks';
import map from 'lodash/map';
import findIndex from 'lodash/findIndex';

import { Sidebar } from './components/sidebar/Sidebar';
import { Goals, GoalInfo } from '../goals/Goals';
import { TrafficAllocation, TrafficAllocationInfo } from '../traffic_allocation/TrafficAllocation';

import { ExperimentQueryData, EXPERIMENT_QUERY, UPDATE_EXPERIMENT } from './graphql/experiment';
import './style.css';

/**
 * Container for experiment.
 */
export const Experiment = () => {
  const { url, params: { id } } = useRouteMatch<{ id: string }>();

  const makePath = useCallback((path = '') => {
    const u = url.slice(-1) === '/' ? url.slice(0, -1) : url;
    return `${u}${path}`;
  }, [url]);

  /**
   * Query to fetch current experiment data.
   */
  const { loading, error, data, } = useQuery<ExperimentQueryData>(EXPERIMENT_QUERY, {
    variables: {
      id,
    },
  });

  /**
   * Mutation for updating experiment.
   */
  const [updateMut, updateRes] = useMutation<ExperimentQueryData>(UPDATE_EXPERIMENT);

  /**
   * Function for updating goals (calls mutation).
   */
  const updateGoals = useCallback((data: GoalInfo) => {
    updateMut({
      variables: {
        input: {
          id,
          goalIDs: map(data.goals, goal => goal.id),
          primaryGoalID: data.goals[data.primaryIdx].id,
        },
      },
      refetchQueries: [{
        query: EXPERIMENT_QUERY,
        variables: { id },
      }],
    });
  }, [id, updateMut]);

  /**
   * Function for updating variations and traffic allocations (calls mutation).
   */
  const updateVariations = useCallback((data: TrafficAllocationInfo) => {
    updateMut({
      variables: {
        input: {
          id,
          variations: map(data.allocations, alloc => ({
            id: alloc.variationID,
            trafficAllocation: alloc.allocation,
          })),
          trafficAllocation: data.globalAllocation,
        },
      },
      refetchQueries: [{
        query: EXPERIMENT_QUERY,
        variables: { id },
      }],
    });
  }, [id, updateMut]);

  /**
   * Extract goals data.
   */
  const goals = useMemo(() => {
    return map(data?.experiment.goals, goal => ({
      id: goal.id,
      name: goal.name,
    }))
  }, [data]);
  const primaryGoalIdx = useMemo(() => {
    return findIndex(data?.experiment.goals, goal => goal.isPrimary);
  }, [data]);

  /**
   * Extract allocations data.
   */
  const allocations = useMemo(() => {
    return map(data?.experiment.variations, variation => ({
      variationID: variation.id,
      allocation: variation.trafficAllocation,
    }));
  }, [data]);

  /**
   * Rendering starts here.
   */
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
            Experiment ID: {id}
          </Route>

          <Route path={makePath('/variations')}>
            <TrafficAllocation
              onNext={updateVariations}
              data={{ allocations, globalAllocation: data.experiment.trafficAllocation }}
              variations={data.experiment.variations}
              updateRes={updateRes}
            />
          </Route>

          <Route path={makePath('/goals')}>
            <Goals
              onNext={updateGoals}
              data={{ goals, primaryIdx: primaryGoalIdx }}
              updateRes={updateRes}
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
