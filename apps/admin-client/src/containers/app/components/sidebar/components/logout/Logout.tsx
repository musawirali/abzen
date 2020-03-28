import React, { useCallback, useEffect } from 'react';
import { ApolloQueryResult } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import { Link } from 'react-router-dom';

import { ViewerQueryData } from '../../../../../app/graphql/viewer';
import { LOGOUT_MUTATION } from './graphql/logout';

interface LogoutPropsType {
  refetch: () => Promise<ApolloQueryResult<ViewerQueryData>>;
}

/**
 * Logout button
 */
export const Logout = (props: LogoutPropsType) => {
  // Login mutation and handler.
  const [logout, { data, error, loading }] = useMutation(LOGOUT_MUTATION);
  useEffect(() => {
    if (props.refetch && data && !error && !loading) {
      props.refetch();
    }
  }, [data, error, loading, props]);

  // Logout button click handler
  const onClick = useCallback(() => {
    logout({ variables: { input: {} } });
  }, [logout]);

  return (
    <Link onClick={onClick}>
      Logout
    </Link>
  );
};
