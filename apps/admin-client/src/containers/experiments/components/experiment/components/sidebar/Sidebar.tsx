import React from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';

import { Experiment, ExperimentStatus } from '../../graphql/experiment';
import './style.scss';

interface SidebarPropsType {
  experiment: Experiment;
  path: string;
}

export const Sidebar = (props: SidebarPropsType) => {
  const { path, experiment: { id, status, name, info, project, goals, variations } } = props;

  return (
    <div className="experiment-sidebar-sticky pt-5">
      <div className="pr-4 pl-4">
        <Link className="text-muted" to="/experiments">Back to all</Link>

        <div>
          <h5 className="mt-5">{name}</h5>
          <p className="text-muted">{info || '-'}</p>
          <div className="mt-3 mb-4 text-muted">{status} · {project?.name || 'No project'}</div>
          {/* <Input disabled className="mt-4">Javascript ID: {id}</Input> */}

          <InputGroup className="mb-2">
            <FormControl
              value={id}
              aria-describedby="basicaddon2"
              readOnly
            />
            <InputGroup.Append>
              <Button variant="outline-secondary">Copy</Button>
            </InputGroup.Append>
          </InputGroup>

          <div>
            <Button block className="mb-4">
              {status === ExperimentStatus.Running ? 'Pause' : 'Start'} experiment
            </Button>
          </div>
        </div>
      </div>

      <div className="experiment-sidebar__menu flex-column">
        <Link to={`${path}/variations`}>Variations ({ variations.length })</Link>
        <Link to={`${path}/goals`}>Goals ({ goals.length })</Link>
        <Link to={`${path}/settings`}>Settings</Link>
        <Link to={`${path}/history`}>History</Link>
      </div>
    </div>
  );
};