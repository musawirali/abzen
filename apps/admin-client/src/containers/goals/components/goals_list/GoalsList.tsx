import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useQuery } from '@apollo/react-hooks';
import map from 'lodash/map';

import { GoalsQueryData, GOALS_QUERY} from './graphql/goals';

interface GoalsListPropsType {
  gotoCreate: () => void;
}

/**
 * View to display list of goals.
 */
export const GoalsList = (props: GoalsListPropsType) => {
  const { gotoCreate } = props;

  const { loading, error, data } = useQuery<GoalsQueryData>(GOALS_QUERY);

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

  return (
    <div>
      <Row className="mt-4">
        <Col>
          Goals
        </Col>

        <Col md={3}>
          <button
            onClick={() => {
              gotoCreate();
            }}
          >
            Create new goal
          </button>
        </Col>
      </Row>

      <table className="table mt-4">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Active experiments</th>
            <th>All experiments</th>
          </tr>
        </thead>
        <tbody>
          { map(data?.goals || [], goal =>
            <tr key={goal.id}>
              <td>{goal.id}</td>
              <td>{goal.name}</td>
              <td>{goal.activeExperimentsCount}</td>
              <td>{goal.allExperimentsCount}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
