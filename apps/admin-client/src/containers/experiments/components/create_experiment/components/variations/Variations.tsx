import React, { useState, useMemo, useCallback } from 'react';
import { v4 as uuid} from 'uuid';
import findIndex from 'lodash/findIndex';
import map from 'lodash/map';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';


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
    name: 'Original',
  }, {
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

      <Form onSubmit={onSubmit}>
        { map(variations, (variation, idx) =>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Variation #{idx} {idx === 0 && '(Control)'}</Form.Label>
            <div className="d-flex">
              <Form.Control
                type="text"
                placeholder="Name of the variation"
                value={variation.name}
                onChange={(evt) => {
                  const newVariations = [...variations];
                  newVariations[idx].name = evt.target.value;
                  setVariations(newVariations);
                }}
                disabled={idx === 0}
              />
              { idx > 1 &&
                <Button
                  className="ml-2"
                  variant="outline-danger"
                  onClick={() => {
                    const newVariations = [...variations];
                    newVariations.splice(idx, 1);
                    setVariations(newVariations);
                  }}
                >
                  Delete
                </Button>
              }

            </div>
          </Form.Group>
        )}

        <Button
          className="mb-3"
          variant="link"
          onClick={() => {
            setVariations([...variations, { id: uuid(), name: '' } ]);
          }}
        >
          + Add new variation
        </Button>

        {/* TODO: This has to become a separate component for each of the steps */}
        <div>
          <button disabled={!isValid}>
            Continue
          </button>
          <button type="button" onClick={() => { onCancel(); }}>
            Cancel & delete
          </button>
        </div>


      </Form>

    </div>
  );
};
