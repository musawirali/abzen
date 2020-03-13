import React, { FunctionComponent, MouseEventHandler } from 'react';

interface StepPropsType {
  index: number;
  title: string;
  active: boolean;
  onClick: MouseEventHandler<HTMLDivElement>;
}

export const Step: FunctionComponent<StepPropsType> = (props) => {
  const { index, title, active, onClick, children } = props;

  return (
    <div>
      <div onClick={onClick}>
        {index + 1}. {title}
      </div>
      { active &&
        <div>
          {children}
        </div>
      }
    </div>
  );
};
