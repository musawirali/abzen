import React, { FunctionComponent, MouseEventHandler } from 'react';

interface StepContainerPropsType {
  onClick: MouseEventHandler<HTMLDivElement>;
}

export const StepContainer: FunctionComponent<StepContainerPropsType> = (props) => {
  const { onClick, children } = props;

  return (
    <div
      className="mb-4"
      onClick={onClick}
    >
      {children}
    </div>
  );
};
