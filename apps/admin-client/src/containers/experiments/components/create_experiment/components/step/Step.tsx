import React, { FunctionComponent } from 'react';

interface StepPropsType {
  index: number;
  title: string;
  active: boolean;
}

export const Step: FunctionComponent<StepPropsType> = (props) => {
  const { index, title, active, children } = props;

  return (
    <div>
      <div>
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
