import React, { useState, useCallback } from 'react';

import { Step } from './components/step/Step';
import { StepContainer } from './components/step_container/StepContainer';
import { Basics, BasicInfo } from './components/basics/Basics';
import { Variations, VariationInfo } from './components/variations/Variations';
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

interface CreateExperimentPropsType {
  onCancel: () => void;
}

/**
 * View for creating new experiment.
 * Consists of steps listed above. 
 */
export const CreateExperiment = (props: CreateExperimentPropsType) => {
  const { onCancel } = props;

  const [step, setStep] = useState(CreateExperimentStep.Basics);
  const [basicInfo, setBasicInfo] = useState<BasicInfo | null>(null);
  const [variationInfo, setVariationInfo] = useState<VariationInfo | null>(null);

  const onBasicNext = useCallback((data: BasicInfo) => {
    setBasicInfo(data);
    setStep(CreateExperimentStep.Variations)
  }, [setBasicInfo, setStep]);

  const onVariationsNext = useCallback((data: VariationInfo) => {
    setVariationInfo(data);
    setStep(CreateExperimentStep.Goals)
  }, [setVariationInfo, setStep]);

  return (
    <div>
      Setup new experiment

      <div className="mt-4">
        {/* Basics */}
        <StepContainer onClick={() => { setStep(CreateExperimentStep.Basics); }}>
          <Step
            title="Basics"
            index={0}
            active={step === CreateExperimentStep.Basics}
          >
            <Basics
              data={basicInfo}
              onCancel={onCancel}
              onNext={onBasicNext}
            />
          </Step>
        </StepContainer>

        {/* Variations */}
        <StepContainer onClick={() => { setStep(CreateExperimentStep.Variations); }}>
          <Step
            title="Variations"
            index={1}
            active={step === CreateExperimentStep.Variations}
          >
            <Variations
              data={variationInfo}
              onCancel={onCancel}
              onNext={onVariationsNext}
            />
          </Step>
        </StepContainer>

        {/* Goals */}
        <StepContainer onClick={() => { setStep(CreateExperimentStep.Goals); }}>
          <Step
            title="Goals"
            index={2}
            active={step === CreateExperimentStep.Goals}
          >
            <Goals />
          </Step>
        </StepContainer>

        {/* Traffic Allocation */}
        <StepContainer onClick={() => { setStep(CreateExperimentStep.TrafficAllocation); }}>
          <Step
            title="Traffic Allocation"
            index={3}
            active={step === CreateExperimentStep.TrafficAllocation}
          >
            <TrafficAllocation />
          </Step>
        </StepContainer>

        {/* Statistical Significance */}
        <StepContainer onClick={() => { setStep(CreateExperimentStep.StatiscalSignificance); }}>
          <Step
            title="Statistical Significance"
            index={4}
            active={step === CreateExperimentStep.StatiscalSignificance}
          >
            <StatisticalSignificance/>
          </Step>
        </StepContainer>
      </div>
    </div>
  );
};
