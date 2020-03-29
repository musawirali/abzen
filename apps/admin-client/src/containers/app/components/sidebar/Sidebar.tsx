import React from 'react';
import { ApolloQueryResult } from 'apollo-boost';
import { useHistory, useLocation } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Image from 'react-bootstrap/Image';
import map from 'lodash/map';

import { ViewerQueryData } from '../../../app/graphql/viewer';
import { User } from '../../../app/graphql/user';

import { Logout } from './components/logout/Logout';

import Logo from '../../../../assets/images/logo.svg';
import './style.css';

interface SidebarPropsType {
  user: User | null;
  refetch: () => Promise<ApolloQueryResult<ViewerQueryData>>;
}

const Links = [
  { name: 'Experiments', path: '/experiments' },
  { name: 'Projects', path: '/projects' },
  { name: 'Goals', path: '/goals' },
  { name: 'Settings', path: '/settings' },
];

export const Sidebar = (props: SidebarPropsType) => {
  const { user, refetch } = props;
  const history = useHistory();
  const { pathname } = useLocation();

  return (
    <div className="sidebar-sticky d-flex flex-column justify-content-between pt-4 pb-4">
      { user &&
        <>

        <Image src={Logo} fluid className="logo-sm ml-3 mt-4"/>

        <Nav activeKey={pathname} className="flex-column">
          { map(Links, link =>
            <Nav.Link
              onClick={() => { history.push(link.path); }}
              eventKey={link.path}
              key={link.path}
            >
              {link.name}
            </Nav.Link>
          )}
        </Nav>
        <Nav className="flex-column">
          <Nav.Link href="/settings" disabled>{user.name}</Nav.Link>
          <Logout refetch={refetch} />
        </Nav>
        </>
      }
    </div>
  );
};