import { HugeiconsIcon } from '@hugeicons/react';
import { TickIcon } from '@hugeicons/core-free-icons';
import { WIZARD_STEPS } from '../../utils/constants';
import './WizardProgress.css';

const WizardProgress = ({ currentStep }) => {
  return (
    <div className="wizard-progress">
      <div className="wizard-steps">
        {WIZARD_STEPS.map((step, index) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;
          const isUpcoming = step.id > currentStep;

          return (
            <div key={step.id} className="wizard-step-container">
              {index > 0 && (
                <div className={`wizard-connector ${isCompleted ? 'completed' : ''}`} />
              )}

              <div className={`wizard-step ${isCurrent ? 'current' : ''} ${isCompleted ? 'completed' : ''} ${isUpcoming ? 'upcoming' : ''}`}>
                <div className="wizard-step-circle">
                  {isCompleted ? (
                    <HugeiconsIcon icon={TickIcon} size={16} />
                  ) : (
                    <span>{step.id}</span>
                  )}
                </div>
                <span className="wizard-step-name">{step.name}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WizardProgress;
