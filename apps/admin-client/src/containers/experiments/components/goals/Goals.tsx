import React, { useState, useMemo, useRef, useCallback } from 'react';
import { useQuery } from '@apollo/react-hooks';
import map from 'lodash/map';
import find from 'lodash/find';
import intersectionBy from 'lodash/intersectionBy';

import { useClickOutside } from '../../../../hooks/click_outside';
import { Goal, GoalSearchQueryData, GOALS_QUERY } from './graphql/goals';

export interface GoalInfo {
  goals: Goal[];
  primaryIdx: number;
}
interface GoalsPropsType {
  data: GoalInfo | null;
  onNext: (data: GoalInfo) => void;
  onCancel?: () => void;
}

export const Goals = (props: GoalsPropsType) => {
  const { data, onNext, onCancel } = props;

  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchRes, setShowSearchRes] = useState(false);
  const [selectedGoals, setSelectedGoals] = useState<Goal[]>(data?.goals || []);
  const [primaryIdx, setPrimaryIdx] = useState(data?.primaryIdx || 0);

  /**
   * Reset the state with the original data.
   * (Used during editing).
   */
  const reset = useCallback(() => {
    setSelectedGoals(data?.goals || []);
    setPrimaryIdx(data?.primaryIdx || 0);
  }, [data, setSelectedGoals, setPrimaryIdx]);

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
   * Using the `onCancel` prop to determine if we're editing or creating.
   */
  const isEditing = useMemo(() => !onCancel, [onCancel]);

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

  return (
    <div>
      {/* Goal search input and menu */}
      <div>
        Search for a goal
        <div>
          <input
            type="text"
            value={searchTerm}
            onChange={(evt) => { setSearchTerm(evt.target.value); }}
            onFocus={() => { setShowSearchRes(true); }}
          />
        </div>

        <div ref={menuRef}>
          { showSearchRes &&
            <div>
              { goals.length === 0 && 'No goals found!'}
              { goals.length > 0 &&
                <ul>
                  { map(goals, goal =>
                    <li
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
      </div>

      {/* List of selected goals */}
      <div>
        <div>Selected goals</div>

        { map(selectedGoals, (goal, idx) =>
          <div key={`selected-${goal.id}`}>
            {goal.name} { idx === primaryIdx && '*' }
            { idx !== primaryIdx &&
              <button onClick={() => { setPrimaryIdx(idx); }}>
                Set as primary
              </button>
            }
          </div>
        )}
      </div>

      {/* Save and cancel / reset buttons */}
      { (!isEditing || hasChanges) &&
        <div>
          <button
            disabled={!isValid}
            onClick={() => {
              onNext({
                goals: [...selectedGoals],
                primaryIdx,
              });
            }}
          >
            { isEditing ? 'Save' : 'Continue' }
          </button>
          <button
            type="button"
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
    </div>
  );
};
