import React from 'react';
import { ApolloQueryResult } from 'apollo-boost';
import { Link } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Image from 'react-bootstrap/Image';

import { ViewerQueryData } from '../../../app/graphql/viewer';
import { User } from '../../../app/graphql/user';

import { Logout } from './components/logout/Logout';

import Logo from '../../../../assets/images/logo.svg';
import './style.css';

interface SidebarPropsType {
  user: User | null;
  refetch: () => Promise<ApolloQueryResult<ViewerQueryData>>;
}

export const Sidebar = (props: SidebarPropsType) => {
  const { user, refetch } = props;

  return (
    <div className="sidebar-sticky d-flex flex-column justify-content-between pt-4 pb-4 ">
      { user &&
        <>

        <Image src={Logo} fluid className="logo-sm ml-3 mt-4"/>

        <Nav defaultActiveKey="/home" className="flex-column">
          <Nav.Link href="/experiments">Experiments</Nav.Link>
          <Nav.Link href="/projects">Projects</Nav.Link>
          <Nav.Link href="/goals">Goals</Nav.Link>
          <Nav.Link href="/settings" disabled>
            Settings
          </Nav.Link>
        </Nav>
        <Nav defaultActiveKey="/home" className="flex-column">
          <Nav.Link href="/settings" disabled>{user.name}</Nav.Link>
          <Logout refetch={refetch} />
        </Nav>
        </>
      }
    </div>
  );
};