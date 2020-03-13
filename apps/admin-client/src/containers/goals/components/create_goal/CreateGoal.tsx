import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useMutation } from '@apollo/react-hooks';

import { CREATE_GOAL_MUTATION, CreateGoalMutationDataType } from './graphql/create_goal';
import { Goal, GOALS_QUERY } from '../goals_list/graphql/goals';

interface CreateGoalPropsType {
  onCreated: () => void;
}

/**
 * View for creating new goal.
 */
export const CreateGoal = (props: CreateGoalPropsType) => {
  const { onCreated } = props;
  const [name, setName] = useState('');

  // Login mutation and handler.
  const [createProject, { data, error, loading }] = useMutation<CreateGoalMutationDataType>(CREATE_GOAL_MUTATION);
  useEffect(() => {
    if (data && !error && !loading) {
      onCreated();
    }
  }, [data, error, loading, onCreated]);

  // Format error message for display
  const displayError = useMemo(() => {
    if (!error) return null;
    return (error.graphQLErrors[0] || error).message;
  }, [error]);

  /**
   * Input validation.
   */
  const isValid = useMemo(() => {
    return name.trim() !== '';
  }, [name]);

  /**
   * Form submission handler.
   *
   * @param event
   */
  const onSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValid) {
      return;
    }

    createProject({
      variables: {
        input: {
          name,
        },
      },
      update: (cache, { data }) => {
        if (data) {
          const { createGoal } = data;
          const { goal } = createGoal;
          const query = GOALS_QUERY;

          let newGoals: Goal[] = [];
          let writeCache = false;
          try {
            // This cache query can fail if the initial goals list hasn't been fetched yet.
            // In that case we don't need to add new goal to cache. It will be there on the subsequent
            // goal list fetch.
            const { goals } = cache.readQuery<{ goals: Goal[] }>({ query }) || { goals: [] };
            newGoals = [ ...goals, goal ];
            writeCache = true;
          } catch (err) {
            writeCache = false;
          }

          if (writeCache) {
            cache.writeQuery({
              query,
              data: { goals: newGoals },
            });
          }
        }
      },
    })
  }, [isValid, createProject, name]);

  return (
    <div>
      Create new goal

      <div className="mt-4">
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
            <button disabled={!isValid}>
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
    </div>
  );
};
