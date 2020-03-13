import React, { useState, useMemo, useCallback } from 'react';
import { v4 as uuid} from 'uuid';
import findIndex from 'lodash/findIndex';
import map from 'lodash/map';

export interface NewVariation {
  id: string;
  name: string;
}

export interface VariationInfo {
  variations: NewVariation[];
}

interface VariationsPropsType {
  data: VariationInfo | null;
  onNext: (data: VariationInfo) => void;
  onCancel: () => void;
}

export const Variations = (props: VariationsPropsType) => {
  const { onCancel, onNext, data } = props;

  const [variations, setVariations] = useState<NewVariation[]>(data?.variations || [{
    id: uuid(),
    name: '',
  }]);

  /**
   * Input validation.
   */
  const isValid = useMemo(() => {
    const invalidIdx = findIndex(variations, variation => variation.name.trim() === '');
    return invalidIdx < 0;
  }, [variations]);

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

    onNext({
      variations: map(variations, variation => ({
        ...variation,
        name: variation.name.trim(),
      })),
    });
  }, [isValid, onNext, variations]);

  return (
    <div>
      <form onSubmit={onSubmit}>

        <div>
          { map(variations, (variation, idx) =>
            <div key={variation.id}>
              <div>Variation #{idx + 1}</div>
              <div>
                <input
                  type="text"
                  value={variation.name}
                  onChange={(evt) => {
                    const newVariations = [...variations];
                    newVariations[idx].name = evt.target.value;
                    setVariations(newVariations);
                  }}
                />
                { idx > 0 &&
                  <button
                    type="button"
                    onClick={() => {
                      const newVariations = [...variations];
                      newVariations.splice(idx, 1);
                      setVariations(newVariations);
                    }}
                  >
                    X
                  </button>
                }
              </div>
            </div>
          )}

          <div>
            <button
              onClick={() => {
                setVariations([...variations, { id: uuid(), name: '' } ]);
              }}
            >
              Add new variation
            </button>
          </div>
        </div>

        <div>
          <button disabled={!isValid}>
            Continue
          </button>
          <button type="button" onClick={() => { onCancel(); }}>
            Cancel & delete
          </button>
        </div>
      </form>
    </div>
  );
};
