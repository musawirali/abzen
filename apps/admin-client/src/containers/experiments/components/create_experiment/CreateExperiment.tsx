import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useMutation } from '@apollo/react-hooks';
import map from 'lodash/map';
import find from 'lodash/find';

import { CREATE_EXPERIMENT_MUTATION, CreateExperimentMutationDataType } from './graphql/create_experiment';
import { GOALS_QUERY } from '../../../goals/components/goals_list/graphql/goals';
import { PROJECTS_QUERY } from '../../../projects/components/projects_list/graphql/projects';
import { Experiment, EXPERIMENTS_QUERY } from '../experiments_list/graphql/experiments';

import { Step } from './components/step/Step';
import { StepContainer } from './components/step_container/StepContainer';
import { Basics, BasicInfo } from './components/basics/Basics';
import { Variations, VariationInfo } from './components/variations/Variations';
import { Goals, GoalInfo } from '../goals/Goals';
import { TrafficAllocation, TrafficAllocationInfo } from '../traffic_allocation/TrafficAllocation';
import { StatisticalSignificance } from './components/statistical_significance/StatisticalSignificance';

enum CreateExperimentStep {
  None,
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
  const [goalInfo, setGoalInfo] = useState<GoalInfo | null>(null);
  const [trafficAllocationInfo, setTrafficAllocationInfo] = useState<TrafficAllocationInfo | null>(null);

  const gotoStep = useCallback((nextStep: CreateExperimentStep) => {
    switch (nextStep) {
      case CreateExperimentStep.Basics:
        setStep(nextStep);
        break;
      case CreateExperimentStep.Variations:
        if (basicInfo !== null) {
          setStep(nextStep);
        }
        break;
      case CreateExperimentStep.Goals:
        if (variationInfo !== null) {
          setStep(nextStep);
        }
        break;
      case CreateExperimentStep.TrafficAllocation:
        if (goalInfo !== null) {
          setStep(nextStep);
        }
        break;
      case CreateExperimentStep.StatiscalSignificance:
        if (trafficAllocationInfo !== null) {
          setStep(nextStep);
        }
        break;
      default:
        break;
    }
  }, [setStep, basicInfo, variationInfo, goalInfo, trafficAllocationInfo]);

  const onBasicNext = useCallback((data: BasicInfo) => {
    setBasicInfo(data);
    setStep(CreateExperimentStep.Variations);
  }, [setBasicInfo, setStep]);

  const onVariationsNext = useCallback((data: VariationInfo) => {
    setVariationInfo(data);
    setStep(CreateExperimentStep.Goals);
  }, [setVariationInfo, setStep]);

  const onGoalsNext = useCallback((data: GoalInfo) => {
    setGoalInfo(data);
    setStep(CreateExperimentStep.TrafficAllocation);
  }, [setGoalInfo, setStep]);

  const onTrafficAllocationNext = useCallback((data: TrafficAllocationInfo) => {
    setTrafficAllocationInfo(data);
    setStep(CreateExperimentStep.StatiscalSignificance);
  }, [setTrafficAllocationInfo, setStep]);

  const onStatisticalSignificanceNext = useCallback(() => {
    setStep(CreateExperimentStep.None);
  }, [setStep]);

  // Check if all data is available to create experiment
  const isValid = useMemo(() => {
    return !!basicInfo && !!variationInfo && !!goalInfo && !!trafficAllocationInfo;
  }, [basicInfo, variationInfo, goalInfo, trafficAllocationInfo]);

  // Login mutation and handler.
  const [createExperiment, { data, error, loading }] = useMutation<CreateExperimentMutationDataType>(CREATE_EXPERIMENT_MUTATION);
  useEffect(() => {
    if (data && !error && !loading) {
      // TODO: This will take back to the experiment list.
      // Maybe we want to go to the newly created experiment instead?
      props.onCancel();
    }
  }, [data, error, loading, props]);

  /**
   * Create experiment backend API call.
   */
  const doCreateExperiment = useCallback(() => {
    if (!isValid) {
      return;
    }

    createExperiment({
      refetchQueries: [{ query: PROJECTS_QUERY }, { query: GOALS_QUERY }],
      variables: {
        input: {
          name: basicInfo?.name,
          projectID: basicInfo?.projectID,
          trafficAllocation: trafficAllocationInfo?.globalAllocation,
          variations: map(variationInfo?.variations, (variation) => {
            const varData = {
              name: variation.name,
              trafficAllocation: 0,
            };
            const alloc = find(trafficAllocationInfo?.allocations, talloc => talloc.variationID === variation.id);
            if (alloc) {
              varData.trafficAllocation = alloc.allocation;
            }
            return varData;
          }),
          goalIDs: map(goalInfo?.goals, 'id'),
          primaryGoalID: goalInfo?.goals[goalInfo.primaryIdx].id,
        },
      },
      update: (cache, { data }) => {
        if (data) {
          const { createExperiment } = data;
          const { experiment } = createExperiment;
          const query = EXPERIMENTS_QUERY;

          let newExperiments: Experiment[] = [];
          let writeCache = false;
          try {
            // This cache query can fail if the initial experiments list hasn't been fetched yet.
            // In that case we don't need to add new experiment to cache. It will be there on the subsequent
            // experiment list fetch.
            const { experiments } = cache.readQuery<{ experiments: Experiment[] }>({ query }) || { experiments: [] };
            newExperiments = [ ...experiments, experiment ];
            writeCache = true;
          } catch (err) {
            writeCache = false;
          }

          if (writeCache) {
            cache.writeQuery({
              query,
              data: { experiments: newExperiments },
            });
          }
        }
      },
    });
  }, [createExperiment, basicInfo, variationInfo, goalInfo, trafficAllocationInfo, isValid]);

  // Format error message for display
  const displayError = useMemo(() => {
    if (!error) return null;
    return (error.graphQLErrors[0] || error).message;
  }, [error]);

  return (
    <div>
      Setup new experiment

      <div className="mt-4">
        {/* Basics */}
        <StepContainer>
          <Step
            title="Basics"
            index={0}
            active={step === CreateExperimentStep.Basics}
            onClick={() => { gotoStep(CreateExperimentStep.Basics); }}
          >
            <Basics
              data={basicInfo}
              onCancel={onCancel}
              onNext={onBasicNext}
            />
          </Step>
        </StepContainer>

        {/* Variations */}
        <StepContainer>
          <Step
            title="Variations"
            index={1}
            active={step === CreateExperimentStep.Variations}
            onClick={() => { gotoStep(CreateExperimentStep.Variations); }}
          >
            <Variations
              data={variationInfo}
              onCancel={onCancel}
              onNext={onVariationsNext}
            />
          </Step>
        </StepContainer>

        {/* Goals */}
        <StepContainer>
          <Step
            title="Goals"
            index={2}
            active={step === CreateExperimentStep.Goals}
            onClick={() => { gotoStep(CreateExperimentStep.Goals); }}
          >
            <Goals
              data={goalInfo}
              onCancel={onCancel}
              onNext={onGoalsNext}
            />
          </Step>
        </StepContainer>

        {/* Traffic Allocation */}
        <StepContainer>
          <Step
            title="Traffic Allocation"
            index={3}
            active={step === CreateExperimentStep.TrafficAllocation}
            onClick={() => { gotoStep(CreateExperimentStep.TrafficAllocation); }}
          >
            <TrafficAllocation
              variations={variationInfo?.variations || []}
              data={trafficAllocationInfo}
              onCancel={onCancel}
              onNext={onTrafficAllocationNext}
            />
          </Step>
        </StepContainer>

        {/* Statistical Significance */}
        <StepContainer>
          <Step
            title="Statistical Significance"
            index={4}
            active={step === CreateExperimentStep.StatiscalSignificance}
            onClick={() => { gotoStep(CreateExperimentStep.StatiscalSignificance); }}
          >
            <StatisticalSignificance
              onCancel={onCancel}
              onNext={onStatisticalSignificanceNext}
            />
          </Step>
        </StepContainer>
      </div>

      { step === CreateExperimentStep.None &&
        <div className="mt-4">
          <div>Thats it for now!</div>
          <button
            disabled={!isValid}
            onClick={() => { doCreateExperiment(); }}
          >
            Create experiment
          </button>

          <button onClick={onCancel}>
            Cancel & delete
          </button>

          { displayError &&
            <div>
              {displayError}
            </div>
          }
        </div>
      }
    </div>
  );
};
