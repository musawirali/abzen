import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Table from 'react-bootstrap/Table';
import { useQuery } from '@apollo/react-hooks';
import map from 'lodash/map';
import Container from 'react-bootstrap/Container';

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
    <Container fluid>
      {/* TODO: THIS HAS TO BE A PROPER COMPONENT REUSED ACROSS ALL TOP LEVEL PAGES */}
      <Row className="mt-5">
        <Col className="d-flex justify-content-between">
          <h4>
            Experiments
          </h4>
          <Button
            variant="primary"
            onClick={() => {
              gotoCreate();
            }}
          >
            Create new experiment
          </Button>
        </Col>
      </Row>

      <Tabs defaultActiveKey="active" className="mt-5 mb-2">
        <Tab eventKey="active" title="Active">
        </Tab>
        <Tab eventKey="archived" title="Archived">
        </Tab>
      </Tabs>
      <div className="mt-4">
        <Button
          variant="outline-secondary"
          size="sm"
          className="mr-1"
        >
              Project: All
        </Button>
        <Button
          variant="outline-secondary"
          size="sm"
        >
              Status: All
        </Button>
      </div>

      <Table hover className="mt-4">
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
      </Table>
    </Container>
  );
};
