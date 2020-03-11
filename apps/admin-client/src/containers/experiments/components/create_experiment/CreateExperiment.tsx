import React, { useState } from 'react';
import map from 'lodash/map';

import { Step } from './components/step/Step';
import { StepContainer } from './components/step_container/StepContainer';
import { Basics } from './components/basics/Basics';
import { Variations } from './components/variations/Variations';
import { Goals } from './components/goals/Goals';
import { TrafficAllocation } from './components/traffic_allocation/TrafficAllocation';
import { StatisticalSignificance } from './components/statistical_significance/StatisticalSignificance';

enum CreateExperimentStep {
  Basics,
  Variations,
  Goals,
  TrafficAllocation,
  StatiscalSignificance,
}

// Steps required for creating new experiment.
const STEPS = [{
  step: CreateExperimentStep.Basics,
  title: 'Basics',
  component: Basics,
}, {
  step: CreateExperimentStep.Variations,
  title: 'Variations',
  component: Variations,
}, {
  step: CreateExperimentStep.Goals,
  title: 'Goals',
  component: Goals,
}, {
  step: CreateExperimentStep.TrafficAllocation,
  title: 'Traffic Allocation',
  component: TrafficAllocation,
}, {
  step: CreateExperimentStep.StatiscalSignificance,
  title: 'Statistical Significance',
  component: StatisticalSignificance,
}];

/**
 * View for creating new experiment.
 * Consists of steps listed above. 
 */
export const CreateExperiment = () => {
  const [step, setStep] = useState(CreateExperimentStep.Basics);

  return (
    <div>
      Setup new experiment

      <div className="mt-4">
        { map(STEPS, (stepDesc, idx) => (
          <StepContainer
            key={`step-${idx}`}
            onClick={() => { setStep(stepDesc.step); }}
          >
            <Step
              title={stepDesc.title}
              index={idx}
              active={stepDesc.step === step}
            >
              <stepDesc.component />
            </Step>
          </StepContainer>
        ))}
      </div>
    </div>
  );
};
