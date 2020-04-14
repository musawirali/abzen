import React, { FunctionComponent } from 'react';

export const StepContainer: FunctionComponent<{}> = (props) => {
  const { children } = props;

  return (
    <div
      className="box mb-2"
    >
      {children}
    </div>
  );
};
