import React from 'react';

interface StatisticalSignificancePropsType {
  onNext: () => void;
  onCancel: () => void;
}

export const StatisticalSignificance = (props: StatisticalSignificancePropsType) => {
  const { onNext, onCancel } = props;

  return (
    <div>
      <div>
        <button
          onClick={() => {
            onNext();
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
