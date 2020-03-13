import React, { useState, useMemo } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Slider from 'rc-slider';
import map from 'lodash/map';
import sum from 'lodash/sum';
import find from 'lodash/find';

import 'rc-slider/assets/index.css';

import { formatInt } from '../../../../../../utils/format';
import { NewVariation } from '../variations/Variations';

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
  onCancel: () => void;
}

export const TrafficAllocation = (props: TrafficAllocationPropsType) => {
  const { variations, data, onCancel, onNext } = props;
  const [globalAlloc, setGlobalAlloc] = useState(data?.globalAllocation || 0);

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

  // Check if distribution is valid
  const isValid = useMemo(() => {
    return sum(map(allocs, 'allocation')) === 100;
  }, [allocs]);

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

      <div>
        { !isValid &&
          <div>
            Must add up to 100
          </div>
        }
        <button
          disabled={!isValid}
          onClick={() => {
            onNext({
              globalAllocation: globalAlloc,
              allocations: [...allocs],
            });
          }}
        >
          Continue
        </button>
        <button type="button" onClick={() => { onCancel(); }}>
          Cancel & delete
        </button>
      </div>
    </div>
  );
};
