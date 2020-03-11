import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useMutation } from '@apollo/react-hooks';

import { CREATE_EXPERIMENT_MUTATION } from './graphql/create_experiment';

export const Basics = () => {
  const [name, setName] = useState('');

  // Login mutation and handler.
  const [createExperiment, { data, error, loading }] = useMutation(CREATE_EXPERIMENT_MUTATION);
  useEffect(() => {
    if (data && !error && !loading) {
      console.log(data);
    }
  }, [data, error, loading]);

  // Format error message for display
  const displayError = useMemo(() => {
    if (!error) return null;
    return (error.graphQLErrors[0] || error).message;
  }, [error]);

  /**
   * Input validation.
   */
  const isValid = useCallback(() => {
    return name.trim() !== '';
  }, [name]);

  /**
   * Form submission handler.
   *
   * @param event
   */
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValid()) {
      return;
    }

    createExperiment({
      variables: {
        input: {
          name,
        },
      },
    })
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div>
          <div>Title</div>
          <input
            type="text"
            value={name}
            onChange={(evt) => { setName(evt.target.value); }}
          />
        </div>

        <div>
          <button disabled={!isValid()}>
            Continue
          </button>
        </div>

        { displayError &&
          <div>
            {displayError}
          </div>
        }
      </form>
    </div>
  );
};
