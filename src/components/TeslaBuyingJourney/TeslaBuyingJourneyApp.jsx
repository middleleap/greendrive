import { useState, useMemo, useCallback } from 'react';
import ConfiguratorShell from './ConfiguratorShell.jsx';
import VariantStep from './steps/VariantStep.jsx';
import ExteriorStep from './steps/ExteriorStep.jsx';
import WheelsStep from './steps/WheelsStep.jsx';
import InteriorStep from './steps/InteriorStep.jsx';
import AutopilotStep from './steps/AutopilotStep.jsx';
import ReviewStep from './steps/ReviewStep.jsx';
import FinancingStep from './steps/FinancingStep.jsx';
import { getTotalPrice } from '../../utils/tesla-configurator-data.js';
import { TIERS, BASE_RATE, MOCK_DASHBOARD } from '../../utils/constants.js';

export default function TeslaBuyingJourneyApp({ score }) {
  const [config, setConfig] = useState({
    variant: null,
    exteriorColor: 'pearl-white',
    wheels: null,
    interior: 'all-black',
    autopilot: 'basic',
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [showApplyModal, setShowApplyModal] = useState(false);

  // Use real score or fall back to mock
  const effectiveScore = score || MOCK_DASHBOARD.score;
  const tier = TIERS.find((t) => t.name === effectiveScore.tier);
  const greenRate = BASE_RATE - (effectiveScore.rateReduction || 0);
  const totalPrice = useMemo(() => getTotalPrice(config), [config]);

  const handleConfigChange = useCallback((updates) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleStepChange = useCallback((step) => {
    if (step >= 0 && step <= 6) {
      setCurrentStep(step);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  // Determine if user can continue from current step
  const canContinue = useMemo(() => {
    switch (currentStep) {
      case 0: return !!config.variant;
      case 1: return !!config.exteriorColor;
      case 2: return !!config.wheels;
      case 3: return !!config.interior;
      case 4: return !!config.autopilot;
      case 5: return true; // review
      case 6: return true; // financing
      default: return false;
    }
  }, [currentStep, config]);

  // Render the current step's content
  const stepContent = useMemo(() => {
    const stepProps = { config, onConfigChange: handleConfigChange };
    switch (currentStep) {
      case 0: return <VariantStep {...stepProps} />;
      case 1: return <ExteriorStep {...stepProps} />;
      case 2: return <WheelsStep {...stepProps} />;
      case 3: return <InteriorStep {...stepProps} />;
      case 4: return <AutopilotStep {...stepProps} />;
      case 5: return <ReviewStep config={config} />;
      case 6:
        return (
          <FinancingStep
            config={config}
            totalPrice={totalPrice}
            score={effectiveScore}
            greenRate={greenRate}
            tier={tier}
            onApply={() => setShowApplyModal(true)}
          />
        );
      default: return null;
    }
  }, [currentStep, config, totalPrice, effectiveScore, greenRate, tier, handleConfigChange]);

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      {/* Hero */}
      <div className="text-center mb-8 stagger-1">
        <h1 className="text-2xl font-semibold text-bank-gray-dark mb-1">Configure Your Tesla</h1>
        <p className="text-sm text-bank-gray-mid">
          Build your Model 3 and discover Green Car Loan financing
        </p>
      </div>

      <div className="stagger-2">
        <ConfiguratorShell
          currentStep={currentStep}
          onStepChange={handleStepChange}
          config={config}
          canContinue={canContinue}
        >
          {stepContent}
        </ConfiguratorShell>
      </div>

      {/* Apply Modal */}
      {showApplyModal && effectiveScore && (
        <ApplyModalWrapper
          score={effectiveScore}
          onClose={() => setShowApplyModal(false)}
        />
      )}
    </div>
  );
}

// Lazy wrapper for ApplyModal (reuse existing)
import { lazy, Suspense } from 'react';
const ApplyModal = lazy(() => import('../Rate/ApplyModal.jsx'));

function ApplyModalWrapper({ score, onClose }) {
  return (
    <Suspense fallback={null}>
      <ApplyModal score={score} onClose={onClose} />
    </Suspense>
  );
}
