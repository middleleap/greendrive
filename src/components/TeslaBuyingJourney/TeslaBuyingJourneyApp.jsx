import { useState, useCallback, lazy, Suspense } from 'react';
import CarImagePanel from './CarImagePanel.jsx';
import PaymentModeSelect from './PaymentModeSelect.jsx';
import VariantSection from './VariantSection.jsx';
import ExteriorSection from './ExteriorSection.jsx';
import WheelSection from './WheelSection.jsx';
import TowHitchSection from './TowHitchSection.jsx';
import InteriorSection from './InteriorSection.jsx';
import AutopilotSection from './AutopilotSection.jsx';
import ChargingSection from './ChargingSection.jsx';
import AccessoriesSection from './AccessoriesSection.jsx';
import StickyBottomBar from './StickyBottomBar.jsx';
import OrderSummary from './OrderSummary.jsx';
import FinancingModal from './FinancingModal.jsx';
import { TIERS, BASE_RATE, MOCK_DASHBOARD } from '../../utils/constants.js';

const ApplyModal = lazy(() => import('../Rate/ApplyModal.jsx'));

export default function TeslaBuyingJourneyApp({ score }) {
  const [config, setConfig] = useState({
    variant: null,
    exteriorColor: 'pearl-white',
    wheels: null,
    interior: null,
    autopilot: 'basic',
    towHitch: false,
    chargingAccessories: [],
    accessories: [],
  });
  const [paymentMode, setPaymentMode] = useState('cash');
  const [showOrder, setShowOrder] = useState(false);
  const [showFinancingModal, setShowFinancingModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);

  const effectiveScore = score || MOCK_DASHBOARD.score;
  const greenRate = BASE_RATE - (effectiveScore.rateReduction || 0);

  const handleConfigChange = useCallback((updates) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleOrderClick = () => {
    setShowOrder(true);
    setTimeout(() => {
      document.getElementById('tc-order-summary')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <>
      {/* Promo banner */}
      <div className="tc-promo-banner">
        Available with 0% rate for 5 years and 1 year insurance coverage.
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setPaymentMode('green-loan');
          }}
        >
          Explore Green Car Loan
        </a>
      </div>

      {/* Two-column configurator layout */}
      <div className="tc-layout">
        {/* Left — sticky car image */}
        <CarImagePanel config={config} />

        {/* Right — options panel */}
        <div className="tc-options">
          <h1 className="text-3xl font-bold text-bank-gray-dark mb-1">Model 3</h1>

          <PaymentModeSelect paymentMode={paymentMode} onPaymentModeChange={setPaymentMode} />

          {/* Configuration sections */}
          <VariantSection
            config={config}
            paymentMode={paymentMode}
            greenRate={greenRate}
            tierName={effectiveScore.tier}
            onConfigChange={handleConfigChange}
            onEditTerms={() => setShowFinancingModal(true)}
          />

          {config.variant && (
            <>
              <ExteriorSection config={config} onConfigChange={handleConfigChange} />
              <WheelSection config={config} onConfigChange={handleConfigChange} />
              <TowHitchSection config={config} onConfigChange={handleConfigChange} />
              <InteriorSection config={config} />
              <AutopilotSection config={config} onConfigChange={handleConfigChange} />
              <ChargingSection config={config} onConfigChange={handleConfigChange} />
              <AccessoriesSection config={config} onConfigChange={handleConfigChange} />
            </>
          )}
        </div>
      </div>

      {/* Order summary — inline reveal */}
      {showOrder && (
        <div id="tc-order-summary">
          <OrderSummary
            config={config}
            paymentMode={paymentMode}
            greenRate={greenRate}
            tierName={effectiveScore.tier}
            score={effectiveScore}
            onApply={() => setShowApplyModal(true)}
            onClose={() => setShowOrder(false)}
          />
        </div>
      )}

      {/* Sticky bottom bar */}
      {config.variant && (
        <StickyBottomBar
          config={config}
          paymentMode={paymentMode}
          greenRate={greenRate}
          tierName={effectiveScore.tier}
          onOrderClick={handleOrderClick}
          onEditTerms={() => setShowFinancingModal(true)}
        />
      )}

      {/* Financing modal */}
      {showFinancingModal && (
        <FinancingModal
          config={config}
          paymentMode={paymentMode}
          greenRate={greenRate}
          tierName={effectiveScore.tier}
          score={effectiveScore}
          onPaymentModeChange={setPaymentMode}
          onClose={() => setShowFinancingModal(false)}
        />
      )}

      {/* Apply modal (reused from Rate tab) */}
      {showApplyModal && effectiveScore && (
        <Suspense fallback={null}>
          <ApplyModal score={effectiveScore} onClose={() => setShowApplyModal(false)} />
        </Suspense>
      )}
    </>
  );
}
