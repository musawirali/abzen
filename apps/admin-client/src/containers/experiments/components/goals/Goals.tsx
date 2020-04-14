import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { MutationResult } from '@apollo/react-common';
import { useQuery } from '@apollo/react-hooks';
import map from 'lodash/map';
import find from 'lodash/find';
import filter from 'lodash/filter';
import intersectionBy from 'lodash/intersectionBy';

import { useClickOutside } from '../../../../hooks/click_outside';
import { Goal, GoalSearchQueryData, GOALS_QUERY } from './graphql/goals';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';


export interface GoalInfo {
  goals: Goal[];
  primaryIdx: number;
}
interface GoalsPropsType {
  data: GoalInfo | null;
  onNext: (data: GoalInfo) => void;
  onCancel?: () => void;
  updateRes?: MutationResult;
}

export const Goals = (props: GoalsPropsType) => {
  const { data, onNext, onCancel, updateRes } = props;

  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchRes, setShowSearchRes] = useState(false);
  const [selectedGoals, setSelectedGoals] = useState<Goal[]>(data?.goals || []);
  const [primaryIdx, setPrimaryIdx] = useState(data?.primaryIdx || 0);

  /**
   * Using the `onCancel` prop to determine if we're editing or creating.
   */
  const isEditing = useMemo(() => !onCancel, [onCancel]);

  /**
   * Reset the state with the original data.
   * (Used during editing).
   */
  const reset = useCallback(() => {
    setSelectedGoals(data?.goals || []);
    setPrimaryIdx(data?.primaryIdx || 0);
  }, [data, setSelectedGoals, setPrimaryIdx]);

  // Reload original data when it changes.
  useEffect(() => {
    if (isEditing) {
      reset();
    }
  }, [reset, isEditing]);

  /**
   * Track when click outside the search results menu happens so we can hide the menu.
   */
  const menuRef = useRef<HTMLDivElement | null>(null);
  useClickOutside(menuRef, () => {
    setShowSearchRes(false);
  });

  /**
   * Search goals query
   */
  const queryRes = useQuery<GoalSearchQueryData>(GOALS_QUERY, {
    variables: {
      searchTerm,
    },
  });
  const goals = useMemo(() => {
    if (queryRes.data && !queryRes.error && !queryRes.loading) {
      return queryRes.data.searchGoals;
    }
    return [];
  }, [queryRes]);

  /**
   * Input validation.
   */
  const isValid = useMemo(() => {
    return selectedGoals.length > 0;
  }, [selectedGoals]);

  /**
   * Check to see if there have been any changes from original data.
   */
  const hasChanges = useMemo(() => {
    const orig = data?.goals || [];
    const curr = selectedGoals;
    // Compare IDs
    if (orig.length !== curr.length || intersectionBy(orig, curr, 'id').length !== orig.length) {
      return true;
    }

    // Compare primary goal ID
    const origPrimary = data?.goals[data.primaryIdx];
    const currPrimary = selectedGoals[primaryIdx];
    return origPrimary ? origPrimary.id !== currPrimary.id : false;
  }, [data, selectedGoals, primaryIdx]);

  /**
   * Compute save button title
   */
  const saveBtnTitle = useMemo(() => {
    if (!isEditing) {
      return 'Continue';
    }
    return updateRes?.loading ? 'Saving...' : 'Save';
  }, [isEditing, updateRes]);

  /**
   * Format error message for display
   */
  const displayError = useMemo(() => {
    if (!updateRes?.error) return null;
    return (updateRes.error.graphQLErrors[0] || updateRes.error).message;
  }, [updateRes]);

  return (
    <div>
      {/* Goal search input and menu */}

      <Form.Group controlId="goals">
        <Form.Label>Select goal(s)</Form.Label>
        <Form.Control type="search" value={searchTerm} onFocus={() => { setShowSearchRes(true); }} onChange={(evt) => { setSearchTerm(evt.target.value); }} />
      </Form.Group>
      <div ref={menuRef}>
        { showSearchRes &&
          <div>
            { goals.length === 0 && 'No goals found!'}
            { goals.length > 0 &&
              <ul className="list-group">
                { map(goals, goal =>
                  <li
                    className="list-group-item"
                    key={goal.id}
                    onClick={() => {
                      if (!find(selectedGoals, sg => sg.id === goal.id)) {
                        setSelectedGoals([...selectedGoals, goal]);
                      }
                      setShowSearchRes(false);
                    }}
                  >
                    {goal.name}
                  </li>
                )}
              </ul>
            }
          </div>
        }
      </div>

      {/* List of selected goals */}
      <div>
        <div className="mb-2">Selected goals</div>

        { map(selectedGoals, (goal, idx) =>
          <div className="d-flex mb-2">
            <div key={`selected-${goal.id}`} className="card d-flex w-100">
              <div className="pt-2 pb-2 pl-4 pr-4">
                {goal.name} <span className="text-muted">{ idx === primaryIdx && '(Primary goal)' }</span>
              </div>            
            </div>

            <div className="d-flex flex-shrink-0">
              { idx !== primaryIdx &&
                <Button
                className="ml-2"
                variant="outline-dark"
                onClick={() => { setPrimaryIdx(idx); }}
              >
                Set as primary
              </Button>
            }

              <Button
                className="ml-2"
                variant="outline-danger"
                onClick={() => {
                  setSelectedGoals(filter(selectedGoals, sg => sg.id !== goal.id));
                }}
              >
                Delete
              </Button>

            </div>
          </div>
        )}
      </div>
      

      {/* Save and cancel / reset buttons */}
      { (!isEditing || hasChanges) &&
        <div>
          <button
            disabled={!isValid || (updateRes && updateRes.loading)}
            onClick={() => {
              onNext({
                goals: [...selectedGoals],
                primaryIdx,
              });
            }}
          >
            {saveBtnTitle}
          </button>
          <button
            type="button"
            disabled={updateRes && updateRes.loading}
            onClick={() => {
              if (!isEditing && onCancel) {
                onCancel();
              } else {
                reset();
              }
            }}
          >
            { !isEditing ? 'Cancel & delete' : 'Reset' }
          </button>
        </div>
      }

      { displayError &&
        <div>
          Error: {displayError}
        </div>
      }
    </div>
  );
};
