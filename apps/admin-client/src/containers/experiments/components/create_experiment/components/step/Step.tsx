import React, { FunctionComponent, MouseEventHandler } from 'react';

import './style.scss';

interface StepPropsType {
  index: number;
  title: string;
  active: boolean;
  onClick: MouseEventHandler<HTMLDivElement>;
}

export const Step: FunctionComponent<StepPropsType> = (props) => {
  const { index, title, active, onClick, children } = props;

  return (
    <div className="create-experiment-step">
      {/* TODO: Apply the "create-experiment-step__header--active" class to the active step */}
      <div onClick={onClick} className="create-experiment-step__header pl-4 pr-4 pt-3 pb-3">
        {index + 1}. {title}
      </div>
      { active &&
        <div className="create-experiment-step__content p-4">
          {children}
        </div>
      }
    </div>
  );
};
