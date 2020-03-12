import React, { useState, useMemo, useCallback } from 'react';
import findIndex from 'lodash/findIndex';
import map from 'lodash/map';

export interface VariationInfo {
  variations: string[];
}
interface VariationsPropsType {
  data: VariationInfo | null;
  onNext: (data: VariationInfo) => void;
  onCancel: () => void;
}

export const Variations = (props: VariationsPropsType) => {
  const { onCancel, onNext, data } = props;

  const [variations, setVariations] = useState<string[]>(data?.variations || ['']);

  /**
   * Input validation.
   */
  const isValid = useMemo(() => {
    const invalidIdx = findIndex(variations, variation => variation.trim() === '');
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
      variations: map(variations, variation => variation.trim()),
    });
  }, [isValid, onNext, variations]);

  return (
    <div>
      <form onSubmit={onSubmit}>

        <div>
          { map(variations, (variation, idx) =>
            <div key={`var-${idx}`}>
              <div>Variation #{idx + 1}</div>
              <div>
                <input
                  type="text"
                  value={variation}
                  onChange={(evt) => {
                    const newVariations = [...variations];
                    newVariations[idx] = evt.target.value;
                    setVariations(newVariations);
                  }}
                /> { idx > 0 && <button
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
                setVariations([...variations, '']);
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
          <button onClick={() => { onCancel(); }}>
            Cancel & delete
          </button>
        </div>
      </form>
    </div>
  );
};
