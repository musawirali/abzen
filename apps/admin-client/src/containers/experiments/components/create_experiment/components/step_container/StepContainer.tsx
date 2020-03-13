import React, { FunctionComponent } from 'react';

export const StepContainer: FunctionComponent<{}> = (props) => {
  const { children } = props;

  return (
    <div
      className="mb-4"
    >
      {children}
    </div>
  );
};
