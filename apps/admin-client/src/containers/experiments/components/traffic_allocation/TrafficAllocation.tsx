import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { MutationResult } from '@apollo/react-common';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Slider from 'rc-slider';
import map from 'lodash/map';
import sum from 'lodash/sum';
import find from 'lodash/find';
import intersectionBy from 'lodash/intersectionBy';

import 'rc-slider/assets/index.css';

import { formatInt } from '../../../../utils/format';
import { NewVariation } from '../create_experiment/components/variations/Variations';

interface NewAllocation {
  variationID: string;
  allocation: number;
}
export interface TrafficAllocationInfo {
  globalAllocation: number;
  allocations: NewAllocation[];
}
interface TrafficAllocationPropsType {
  variations: NewVariation[];
  data: TrafficAllocationInfo | null;
  onNext: (data: TrafficAllocationInfo) => void;
  onCancel?: () => void;
  updateRes?: MutationResult;
}

export const TrafficAllocation = (props: TrafficAllocationPropsType) => {
  const { variations, data, onCancel, onNext, updateRes } = props;
  const [globalAlloc, setGlobalAlloc] = useState(data?.globalAllocation || 0);

  /**
   * Using the `onCancel` prop to determine if we're editing or creating.
   */
  const isEditing = useMemo(() => !onCancel, [onCancel]);

  /**
   * Compute initial traffic split.
   */
  const initialSplit = useMemo(() => {
    const prevAllocs = data?.allocations || [];

    let splits: NewAllocation[] = [];
    if (prevAllocs.length > 0) {
      // Use previously specified allocations, if available.
      // Set new ones to `0`.
      splits = map(variations, (variation) => {
        const prevAlloc = find(prevAllocs, pa => pa.variationID === variation.id);
        return prevAlloc ? { ...prevAlloc } : { variationID: variation.id, allocation: 0 };
      });
    } else {
      // Equally distribute among all variations.
      const part = Math.floor(100 / variations.length);
      splits = map(variations, (variation) => ({
        allocation: part,
        variationID: variation.id,
      }));
      splits[0].allocation = 100 - (part * (variations.length - 1));
    }

    return splits;
  }, [variations, data]);
  const [allocs, setAllocs] = useState(initialSplit);

  /**
   * Reset the state with the original data.
   * (Used during editing).
   */
  const reset = useCallback(() => {
    setGlobalAlloc(data?.globalAllocation || 0);
    setAllocs(initialSplit);
  }, [data, setGlobalAlloc, setAllocs, initialSplit]);

  // Reload original data when it changes.
  useEffect(() => {
    if (isEditing) {
      reset();
    }
  }, [reset, isEditing]);

  /**
   * Check if distribution is valid
   */
  const isValid = useMemo(() => {
    return sum(map(allocs, 'allocation')) === 100;
  }, [allocs]);

  /**
   * Check to see if there have been any changes from original data.
   */
  const hasChanges = useMemo(() => {
    // Check global allocation
    if (globalAlloc !== data?.globalAllocation) {
      return true;
    }

    // Compare variation IDs
    const orig = data?.allocations || [];
    const curr = allocs;
    if (orig.length !== curr.length || intersectionBy(orig, curr, 'variationID').length !== orig.length) {
      return true;
    }

    // Compare allocations
    return !!find(orig, (alloc) => {
      const currAlloc = find(curr, calloc => calloc.variationID === alloc.variationID);
      return !currAlloc || currAlloc.allocation !== alloc.allocation;
    });
  }, [data, globalAlloc, allocs]);

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
      <div>
        <div>Total traffic</div>
        <Row>
          <Col>
            <Slider
              min={0}
              max={100}
              step={1}
              value={globalAlloc}
              onChange={(val: number) => { setGlobalAlloc(val); }}
            />
          </Col>
          <Col>
            <input
              type="text"
              value={globalAlloc}
              onChange={(evt) => {
                setGlobalAlloc(formatInt(evt.target.value, 0, 100) || 0);
              }}
            />
          </Col>
        </Row>
      </div>

      <div>
        <table className="table">
          <thead>
            <tr>
              <th>Variation name</th>
              <th>Traffic allocation</th>
            </tr>
          </thead>
          <tbody>
            { map(variations, (variation, idx) =>
              <tr key={variation.id}>
                <td>{variation.name}</td>
                <td>
                  <input
                    type="text"
                    value={allocs[idx].allocation}
                    onChange={(evt) => {
                      const val = formatInt(evt.target.value, 0, 100) || 0;
                      const newAllocs = [...allocs];
                      newAllocs[idx].allocation = val;
                      setAllocs(newAllocs);
                    }}
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Save and cancel / reset buttons */}
      { (!isEditing || hasChanges) &&
        <div>
          <button
            disabled={!isValid || (updateRes && updateRes.loading)}
            onClick={() => {
              onNext({
                globalAllocation: globalAlloc,
                allocations: [...allocs],
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
