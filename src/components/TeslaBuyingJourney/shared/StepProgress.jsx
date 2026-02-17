import { CONFIGURATOR_STEPS } from '../../../utils/tesla-configurator-data.js';

export default function StepProgress({ currentStep, onStepClick, completedSteps }) {
  return (
    <div className="flex items-center justify-center gap-1 py-4">
      {CONFIGURATOR_STEPS.map((step, i) => {
        const isActive = i === currentStep;
        const isCompleted = completedSteps?.includes(i) || i < currentStep;
        const isClickable = isCompleted || i === currentStep;

        return (
          <div key={step.id} className="flex items-center">
            <button
              onClick={() => isClickable && onStepClick(i)}
              disabled={!isClickable}
              className={`cfg-step-dot ${isActive ? 'cfg-step-dot-active' : isCompleted ? 'cfg-step-dot-completed' : 'cfg-step-dot-pending'}`}
              title={step.label}
              aria-label={`Step ${i + 1}: ${step.label}`}
              aria-current={isActive ? 'step' : undefined}
            >
              {isCompleted && !isActive ? (
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <span className="text-[9px] font-semibold">{i + 1}</span>
              )}
            </button>
            <span className={`hidden sm:inline text-[10px] font-medium ml-1 ${isActive ? 'text-green-deep' : isCompleted ? 'text-bank-gray-mid' : 'text-bank-gray'}`}>
              {step.shortLabel}
            </span>
            {i < CONFIGURATOR_STEPS.length - 1 && (
              <div className={`cfg-step-connector ${i < currentStep ? 'cfg-step-connector-done' : ''}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
