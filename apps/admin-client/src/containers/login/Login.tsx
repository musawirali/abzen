import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import { ApolloQueryResult } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import find from 'lodash/find';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';

import { User } from '../app/graphql/user';
import { ViewerQueryData } from '../app/graphql/viewer';
import { LOGIN_MUTATION } from './graphql/login';

import './style.scss';
import Logo from '../../assets/images/logo.svg';


interface LoginPropsType {
  user: User | null;
  refetch: () => Promise<ApolloQueryResult<ViewerQueryData>>;
}

/**
 * Displays the login form.
 */
export const Login = (props: LoginPropsType) => {
  const location = useLocation();

  // State for username input.
  const [username, setUsername] = useState('');
  const onUsernameChange = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(evt.target.value);
  }, []);

  // State for password input.
  const [password, setPassword] = useState('');
  const onPasswordChange = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(evt.target.value);
  }, []);

  // Login mutation and handler.
  const [login, { data, error, loading }] = useMutation(LOGIN_MUTATION);
  useEffect(() => {
    if (props.refetch && data && !error && !loading) {
      props.refetch();
    }
  }, [data, error, loading, props]);

  // Format error message for display
  const displayError = useMemo(() => {
    if (!error) return null;
    return (error.graphQLErrors[0] || error).message;
  }, [error]);

  // Form submission handler.
  const onSubmit = useCallback((evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    login({
      variables: {
        input: { username, password },
      },
    });
  }, [login, username, password]);

  // If user is logged in, redirect.
  if (props.user) {
    let redirect = '/';
    const params = location.search.substr(1).split('&');
    const redirParam = find(params, param => !!param.match(/^redirect=/));
    if (redirParam) {
      redirect = decodeURIComponent(redirParam.split('=')[1]);
    }

    return <Redirect to={redirect} push={false} />;
  }

  return (
    <div className="login-container flex-column">
      <Image src={Logo} fluid className="logo-md mb-5"/>

      <Form onSubmit={onSubmit} className="login-container__form">
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" placeholder="e.g. tester123" value={username} onChange={onUsernameChange}/>
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control value={password} type="password" placeholder="Password" onChange={onPasswordChange}/>
        </Form.Group>
        { displayError &&
          <Form.Text className="text-danger mb-2">
            {displayError}
          </Form.Text>
        }
        <Button variant="primary" type="submit" block disabled={loading}>
          Login
        </Button>
        <div className="text-muted text-center mt-3">
            Don't have an account? <span className="text-primary">Signup</span>
        </div>

      </Form>
    </div>
  );
};
