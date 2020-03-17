import React from 'react';
import { Link } from 'react-router-dom';

import { Experiment, ExperimentStatus } from '../../graphql/experiment';
import './style.css';

interface SidebarPropsType {
  experiment: Experiment;
  path: string;
}

export const Sidebar = (props: SidebarPropsType) => {
  const { path, experiment: { id, status, name, info, project, goals, variations } } = props;

  return (
    <div className="experiment-sidebar-sticky">
      <div>
        <Link to="/experiments">Back to all</Link>
      </div>

      <div>
        <div>{name}</div>
        <div>{info || '-'}</div>
        <div>{status} * {project?.name || 'No project'}</div>
        <div>Javascript ID: {id}</div>
        <div>
          <button>
            {status === ExperimentStatus.Running ? 'Pause' : 'Start'} experiment
          </button>
        </div>
      </div>

      <ul>
        <li><Link to={`${path}/variations`}>Variations ({ variations.length })</Link></li>
        <li><Link to={`${path}/goals`}>Goals ({ goals.length })</Link></li>
        <li><Link to={`${path}/settings`}>Settings</Link></li>
        <li><Link to={`${path}/history`}>History</Link></li>
      </ul>
    </div>
  );
};