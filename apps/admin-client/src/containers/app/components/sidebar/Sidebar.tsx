import React from 'react';
import { ApolloQueryResult } from 'apollo-boost';
import { Link } from 'react-router-dom';

import { ViewerQueryData } from '../../../app/graphql/viewer';
import { User } from '../../../app/graphql/user';

import { Logout } from './components/logout/Logout';

import './style.css';

interface SidebarPropsType {
  user: User | null;
  refetch: () => Promise<ApolloQueryResult<ViewerQueryData>>;
}

export const Sidebar = (props: SidebarPropsType) => {
  const { user, refetch } = props;

  return (
    <div className="sidebar-sticky">
      { user &&
        <>
          <ul>
            <li><Link to="/experiments">Experiments</Link></li>
            <li><Link to="/projects">Projects</Link></li>
            <li><Link to="/goals">Goals</Link></li>
            <li><Link to="/settings">Settings</Link></li>
          </ul>

          <div>
            <div>
              {user.name}
            </div>
            <div>
              <Logout refetch={refetch} />
            </div>
          </div>
        </>
      }
    </div>
  );
};