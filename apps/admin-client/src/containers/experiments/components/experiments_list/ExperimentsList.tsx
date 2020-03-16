import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useQuery } from '@apollo/react-hooks';
import map from 'lodash/map';

import { ExperimentsQueryData, EXPERIMENTS_QUERY} from './graphql/experiments';

interface ExperimentsListPropsType {
  gotoCreate: () => void;
  gotoExperiment: (id: string) => void;
}

/**
 * View to display list of experiments.
 */
export const ExperimentsList = (props: ExperimentsListPropsType) => {
  const { gotoCreate, gotoExperiment } = props;

  const { loading, error, data } = useQuery<ExperimentsQueryData>(EXPERIMENTS_QUERY);

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
          Experiments
        </Col>

        <Col md={3}>
          <button
            onClick={() => {
              gotoCreate();
            }}
          >
            Create new experiment
          </button>
        </Col>
      </Row>

      <table className="table mt-4">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Type</th>
            <th>Project</th>
            <th>Status</th>
            <th>Last change</th>
          </tr>
        </thead>
        <tbody>
          { map(data?.experiments || [], exp =>
            <tr key={exp.id} onClick={() => { gotoExperiment(exp.id); }}>
              <td>{exp.id}</td>
              <td>{exp.name}</td>
              <td>{exp.type}</td>
              <td>{exp.project?.name || '-'}</td>
              <td>{exp.status}</td>
              <td>{exp.updatedAt}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
