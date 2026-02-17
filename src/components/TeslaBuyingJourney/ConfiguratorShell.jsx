import StepProgress from './shared/StepProgress.jsx';
import ConfigSummaryBar from './shared/ConfigSummaryBar.jsx';
import { CONFIGURATOR_STEPS } from '../../utils/tesla-configurator-data.js';

export default function ConfiguratorShell({
  currentStep,
  onStepChange,
  config,
  canContinue,
  children,
}) {
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === CONFIGURATOR_STEPS.length - 1;

  return (
    <div className="fade-in">
      {/* Step progress indicator */}
      <div className="card mb-6 px-4 py-1">
        <StepProgress
          currentStep={currentStep}
          onStepClick={onStepChange}
        />
      </div>

      {/* Step content */}
      <div className="card p-6 mb-6 tab-content-enter" key={currentStep}>
        {children}
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => onStepChange(currentStep - 1)}
          disabled={isFirstStep}
          className="px-5 py-2.5 rounded-lg text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed text-bank-gray-mid hover:text-bank-gray-dark hover:bg-bank-gray-bg"
        >
          Back
        </button>

        {!isLastStep && (
          <button
            onClick={() => onStepChange(currentStep + 1)}
            disabled={!canContinue}
            className="px-6 py-2.5 rounded-lg text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-green-deep text-white hover:bg-[#085838]"
          >
            Continue
          </button>
        )}
      </div>

      {/* Sticky summary bar (only visible when variant is selected) */}
      {config.variant && <ConfigSummaryBar config={config} />}
    </div>
  );
}
