import React from 'react';
import { Switch, Route, Redirect, useLocation } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { VIEWER_QUERY, ViewerQueryData } from './graphql/viewer';
import { Login } from '../login/Login';
import { Home } from '../home/Home';
import { Experiments } from '../experiments/Experiments';
import { Projects } from '../projects/Projects'
import { Goals } from '../goals/Goals';
import { Settings } from '../settings/Settings';

import { Sidebar } from './components/sidebar/Sidebar';

import './style.css';

/**
 * App main component.
 */
export const App = () => {
  const location = useLocation();
  const { loading, error, data, refetch } = useQuery<ViewerQueryData>(VIEWER_QUERY);

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

  const user = data?.viewer?.user || null;
  // If the user is not logged in, redirect to the login page.
  if (location.pathname !== '/login' && !user) {
    const redirect = encodeURIComponent(`${location.pathname}${location.search}`);
    return <Redirect to={`/login?redirect=${redirect}`} push={false} />;
  }

  return (
    <Container fluid>
      <Row>
        {/* Sidebar */}
        <Col
          md={2}
          className="sidebar"
        >
          <Sidebar user={user} refetch={refetch} />
        </Col>

        {/* Content */}
        <Col
          className="ml-sm-auto px-4"
          md={9}
          sm="auto"
          lg={10}
        >
          <Switch>
            <Route path="/" exact children={<Home />} />
            <Route path="/experiments" children={<Experiments />} />
            <Route path="/projects" children={<Projects />} />
            <Route path="/goals" children={<Goals />} />
            <Route path="/settings" children={<Settings />} />
            <Route path="/login" children={<Login user={user} refetch={refetch} />} />
            <Redirect to="/" />
          </Switch>
        </Col>
      </Row>
    </Container>
  );
};

export default App;
