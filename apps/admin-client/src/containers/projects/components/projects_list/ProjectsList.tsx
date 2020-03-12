import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useQuery } from '@apollo/react-hooks';
import map from 'lodash/map';

import { ProjectsQueryData, PROJECTS_QUERY} from './graphql/projects';

interface ProjectsListPropsType {
  gotoCreate: () => void;
}

/**
 * View to display list of experiments.
 */
export const ProjectsList = (props: ProjectsListPropsType) => {
  const { gotoCreate } = props;

  const { loading, error, data } = useQuery<ProjectsQueryData>(PROJECTS_QUERY);

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
          Projects
        </Col>

        <Col md={3}>
          <button
            onClick={() => {
              gotoCreate();
            }}
          >
            Create new project
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
          { map(data?.projects || [], proj =>
            <tr key={proj.id}>
              <td>{proj.id}</td>
              <td>{proj.name}</td>
              <td>{proj.activeExperimentsCount}</td>
              <td>{proj.allExperimentsCount}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
