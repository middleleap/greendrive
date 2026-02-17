import { useState, useEffect, lazy, Suspense } from 'react';
import { useTeslaData } from './hooks/useTeslaData.js';
import { useAuthStatus } from './hooks/useAuthStatus.js';
import Header from './components/Layout/Header.jsx';
import VehicleBanner from './components/Layout/VehicleBanner.jsx';
import TabBar from './components/Layout/TabBar.jsx';
import Footer from './components/Layout/Footer.jsx';
import ScoreGauge from './components/Score/ScoreGauge.jsx';
import ScoreBreakdown from './components/Score/ScoreBreakdown.jsx';
import TierBadge from './components/Score/TierBadge.jsx';
import ScoreHistory from './components/Score/ScoreHistory.jsx';
import VehicleDetails from './components/Vehicle/VehicleDetails.jsx';
import BatteryStatus from './components/Vehicle/BatteryStatus.jsx';
import ChargingPattern from './components/Charging/ChargingPattern.jsx';
import EnvironmentalImpact from './components/Charging/EnvironmentalImpact.jsx';
import DataSources from './components/Charging/DataSources.jsx';
import ChargingCost from './components/Charging/ChargingCost.jsx';
import RateBenefit from './components/Rate/RateBenefit.jsx';
import TierTable from './components/Rate/TierTable.jsx';
import SavingsProjection from './components/Rate/SavingsProjection.jsx';
import CompetitiveRates from './components/Rate/CompetitiveRates.jsx';
import CrossSell from './components/Rate/CrossSell.jsx';
import PreQualCertificate from './components/Rate/PreQualCertificate.jsx';
import RateLock from './components/Rate/RateLock.jsx';
import Card from './components/shared/Card.jsx';
import GreenRateTeaser from './components/Score/GreenRateTeaser.jsx';
import ChargingRateImpact from './components/Charging/ChargingRateImpact.jsx';
import StickyApplyBar from './components/shared/StickyApplyBar.jsx';
import CollapsibleSection from './components/shared/CollapsibleSection.jsx';
import MyVehiclesApp from './components/MyVehicles/MyVehiclesApp.jsx';

// Lazy-loaded: only fetched when their tab/channel is activated
const VehicleMap = lazy(() => import('./components/Vehicle/VehicleMap.jsx'));
const ApplyModal = lazy(() => import('./components/Rate/ApplyModal.jsx'));
const PortfolioAnalytics = lazy(() => import('./components/Admin/PortfolioAnalytics.jsx'));
const TeslaBuyingJourneyApp = lazy(() => import('./components/TeslaBuyingJourney/TeslaBuyingJourneyApp.jsx'));
import ErrorBoundary from './components/shared/ErrorBoundary.jsx';
import {
  ScoreTabSkeleton,
  VehicleTabSkeleton,
  ChargingTabSkeleton,
  RateTabSkeleton,
} from './components/shared/Skeleton.jsx';
import { TIERS, BASE_RATE } from './utils/constants.js';

export default function App() {
  const [selectedVin, setSelectedVin] = useState(null);
  const { data, vehicles, isLive, loading, refreshing, refresh } = useTeslaData(selectedVin);
  const { authenticated } = useAuthStatus();
  const [activeTab, setActiveTab] = useState('score');
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [activeChannel, setActiveChannel] = useState('greendrive');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  if (loading && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bank-gray-bg">
        <div className="text-center">
          <div className="spinner mx-auto mb-4" />
          <p className="text-sm text-bank-gray-mid">Loading GreenDrive...</p>
        </div>
      </div>
    );
  }

  const { vehicle, score, charging, metadata } = data || {};

  // My Vehicles channel — renders mobile retail interface
  if (activeChannel === 'my-vehicles') {
    return (
      <div className="min-h-screen bg-bank-gray-bg fade-in">
        <Header
          isLive={isLive}
          onRefresh={refresh}
          loading={refreshing}
          authenticated={authenticated}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode((d) => !d)}
          showAdmin={showAdmin}
          onToggleAdmin={() => {
            setShowAdmin((s) => !s);
            setActiveChannel('greendrive');
          }}
          activeChannel={activeChannel}
          onChannelChange={(ch) => {
            setActiveChannel(ch);
            setShowAdmin(false);
          }}
        />
        <MyVehiclesApp />
        <Footer isLive={isLive} lastUpdated={metadata?.lastUpdated} authenticated={authenticated} />
      </div>
    );
  }

  // Tesla Buying Journey channel — configurator + financing
  if (activeChannel === 'tesla-buying') {
    return (
      <div className="min-h-screen bg-bank-gray-bg fade-in">
        <Header
          isLive={isLive}
          onRefresh={refresh}
          loading={refreshing}
          authenticated={authenticated}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode((d) => !d)}
          showAdmin={showAdmin}
          onToggleAdmin={() => {
            setShowAdmin((s) => !s);
            setActiveChannel('greendrive');
          }}
          activeChannel={activeChannel}
          onChannelChange={(ch) => {
            setActiveChannel(ch);
            setShowAdmin(false);
          }}
        />
        <Suspense
          fallback={
            <div className="max-w-3xl mx-auto px-6 py-8">
              <div className="skeleton-pulse bg-bank-gray-alt/50 rounded-lg" style={{ height: 400 }} />
            </div>
          }
        >
          <TeslaBuyingJourneyApp score={data?.score} />
        </Suspense>
        <Footer isLive={isLive} lastUpdated={metadata?.lastUpdated} authenticated={authenticated} />
      </div>
    );
  }

  // GreenDrive channel (default) — existing dashboard
  return (
    <div className="min-h-screen bg-bank-gray-bg fade-in">
      <Header
        isLive={isLive}
        onRefresh={refresh}
        loading={refreshing}
        authenticated={authenticated}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((d) => !d)}
        showAdmin={showAdmin}
        onToggleAdmin={() => setShowAdmin((s) => !s)}
        activeChannel={activeChannel}
        onChannelChange={(ch) => {
          setActiveChannel(ch);
          setShowAdmin(false);
        }}
      />
      {!showAdmin && (
        <>
          <VehicleBanner
            vehicle={vehicle}
            score={score}
            vehicles={vehicles}
            selectedVin={selectedVin || vehicle?.vin}
            onSelectVehicle={setSelectedVin}
          />
          <TabBar
            activeTab={activeTab}
            onTabChange={(tab) => {
              setActiveTab(tab);
              setShowAdmin(false);
            }}
          />
        </>
      )}

      <main
        className={`max-w-7xl mx-auto px-6 py-8 tab-content-enter ${score?.rateReduction > 0 && activeTab !== 'rate' && !showAdmin ? 'pb-20' : ''}`}
        key={showAdmin ? 'admin' : `${activeTab}-${selectedVin}`}
        role="tabpanel"
        id={showAdmin ? 'panel-admin' : `panel-${activeTab}`}
        aria-label={showAdmin ? 'Portfolio Analytics' : `${activeTab} tab content`}
      >
        <ErrorBoundary>
          {showAdmin ? (
            <AdminTab />
          ) : refreshing && !score ? (
            <>
              {activeTab === 'score' && <ScoreTabSkeleton />}
              {activeTab === 'vehicle' && <VehicleTabSkeleton />}
              {activeTab === 'charging' && <ChargingTabSkeleton />}
              {activeTab === 'rate' && <RateTabSkeleton />}
            </>
          ) : (
            <>
              {activeTab === 'score' && (
                <ScoreTab
                  score={score}
                  vin={vehicle?.vin}
                  onViewRateDetails={() => setActiveTab('rate')}
                />
              )}
              {activeTab === 'vehicle' && <VehicleTab vehicle={vehicle} darkMode={darkMode} />}
              {activeTab === 'charging' && (
                <ChargingTab
                  charging={charging}
                  isLive={isLive}
                  score={score}
                  onViewRateDetails={() => setActiveTab('rate')}
                />
              )}
              {activeTab === 'rate' && (
                <RateTab score={score} vehicle={vehicle} onApply={() => setShowApplyModal(true)} />
              )}
            </>
          )}
        </ErrorBoundary>
      </main>

      {!showAdmin && (
        <StickyApplyBar
          score={score}
          activeTab={activeTab}
          onApply={() => setShowApplyModal(true)}
        />
      )}

      <Footer isLive={isLive} lastUpdated={metadata?.lastUpdated} authenticated={authenticated} />

      {showApplyModal && score && (
        <Suspense fallback={null}>
          <ApplyModal score={score} vehicle={vehicle} onClose={() => setShowApplyModal(false)} />
        </Suspense>
      )}
    </div>
  );
}

function ScoreTab({ score, vin, onViewRateDetails }) {
  const currentScore = score?.totalScore || 0;
  const currentTierIndex = TIERS.findIndex((t) => t.name === score?.tier);
  const nextTier = currentTierIndex > 0 ? TIERS[currentTierIndex - 1] : null;
  const pointsToNext = nextTier ? nextTier.minScore - currentScore : 0;

  const loanAmount = 250000;
  const termYears = 5;
  const calcMonthly = (rate) => {
    const mr = rate / 100 / 12;
    const n = termYears * 12;
    if (mr === 0) return loanAmount / n;
    return (loanAmount * (mr * Math.pow(1 + mr, n))) / (Math.pow(1 + mr, n) - 1);
  };
  const currentAnnualSaving =
    (calcMonthly(BASE_RATE) - calcMonthly(BASE_RATE - (score?.rateReduction || 0))) * 12;
  const nextAnnualSaving = nextTier
    ? (calcMonthly(BASE_RATE) - calcMonthly(BASE_RATE - nextTier.rateReduction)) * 12
    : currentAnnualSaving;
  const additionalAnnualSaving = nextAnnualSaving - currentAnnualSaving;

  return (
    <div className="space-y-6">
      {/* Hero gauge - full width on mobile, 1/3 on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card featured className="flex flex-col items-center justify-center relative stagger-1">
          <ScoreGauge
            score={score?.totalScore || 0}
            tierColor={score?.tierColor}
            tierName={score?.tier}
          />
          <TierBadge
            tier={score?.tier}
            tierColor={score?.tierColor}
            rateReduction={score?.rateReduction}
          />
        </Card>

        {/* Desktop: always visible breakdown */}
        <Card className="hidden md:block md:col-span-2 stagger-2">
          <ScoreBreakdown breakdown={score?.breakdown} />
        </Card>
      </div>

      {/* Mobile: collapsible breakdown */}
      <div className="md:hidden stagger-2">
        <CollapsibleSection
          title="Score Breakdown"
          subtitle="6 categories that make up your score"
          defaultOpen
        >
          <ScoreBreakdown breakdown={score?.breakdown} />
        </CollapsibleSection>
      </div>

      {/* Green Rate Teaser */}
      <div className="stagger-3">
        <GreenRateTeaser score={score} onViewRateDetails={onViewRateDetails} />
      </div>

      {/* Score History */}
      <div className="stagger-4">
        <ScoreHistory vin={vin} />
      </div>

      {/* Next Tier Progress */}
      {nextTier && (
        <Card className="stagger-5">
          <h3 className="section-title mb-3">Path to {nextTier.name}</h3>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="rounded-xl bg-bank-gray-bg p-4 text-center">
              <p className="text-2xl font-semibold text-bank-gray-dark">{pointsToNext}</p>
              <p className="text-[10px] text-bank-gray-mid uppercase tracking-widest mt-1">
                points to go
              </p>
            </div>
            <div className="rounded-xl bg-green-pastel p-4 text-center">
              <p className="text-2xl font-semibold text-green-deep">
                AED {Math.round(additionalAnnualSaving).toLocaleString()}
              </p>
              <p className="text-[10px] text-green-deep/70 uppercase tracking-widest mt-1">
                more savings/yr
              </p>
            </div>
          </div>
          <div className="mb-3">
            <div className="flex justify-between text-xs text-bank-gray-mid mb-1.5">
              <span>
                {score?.tier} ({currentScore})
              </span>
              <span>
                {nextTier.name} ({nextTier.minScore})
              </span>
            </div>
            <div className="h-2.5 bg-bank-gray-bg rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${Math.max(5, ((currentScore - (TIERS[currentTierIndex]?.minScore || 0)) / (nextTier.minScore - (TIERS[currentTierIndex]?.minScore || 0))) * 100)}%`,
                  backgroundColor: score?.tierColor || '#16A34A',
                }}
              />
            </div>
          </div>
          <p className="text-xs text-bank-gray-mid">
            Reaching {nextTier.name} reduces your rate from{' '}
            <strong className="text-bank-gray-dark">
              {(BASE_RATE - (score?.rateReduction || 0)).toFixed(2)}%
            </strong>{' '}
            to{' '}
            <strong className="text-green-deep">
              {(BASE_RATE - nextTier.rateReduction).toFixed(2)}%
            </strong>
          </p>
        </Card>
      )}

      {/* Suggestions with financial context */}
      {score?.suggestions?.length > 0 && (
        <div className="callout stagger-6">
          <p className="text-sm font-medium text-bank-maroon mb-1">Unlock a Better Rate</p>
          <p className="text-xs text-bank-gray-mid mb-3">
            Each action below improves your GreenDrive Score, moving you closer to a lower interest
            rate.
          </p>
          <ul className="space-y-2">
            {score.suggestions.map((s, i) => (
              <li key={i} className="text-sm text-bank-gray-dark flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-5 rounded-full bg-green-pastel text-green-deep text-xs font-medium flex items-center justify-center">
                  +{s.potentialPoints}
                </span>
                <span>{s.action}</span>
              </li>
            ))}
          </ul>
          {nextTier && (
            <p className="text-xs text-bank-gray-mid mt-3 pt-3 border-t border-bank-red/10">
              Reaching {nextTier.name} tier could save you an additional{' '}
              <strong className="text-green-deep">
                AED {Math.round(additionalAnnualSaving).toLocaleString()}
              </strong>{' '}
              per year on a AED 250,000 green car loan.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function VehicleTab({ vehicle, darkMode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="stagger-1">
        <VehicleDetails vehicle={vehicle} />
      </div>
      <div className="stagger-2">
        <BatteryStatus battery={vehicle?.battery} />
      </div>
      {vehicle?.climate && (
        <Card className="stagger-3">
          <h3 className="section-title mb-3">Climate</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3.5 rounded-xl bg-bank-gray-bg">
              <p className="text-[10px] text-bank-gray-mid uppercase tracking-widest mb-1">
                Inside
              </p>
              <p className="text-lg font-semibold text-bank-gray-dark">
                {vehicle.climate.insideTemp_C}°C
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-bank-gray-bg">
              <p className="text-[10px] text-bank-gray-mid uppercase tracking-widest mb-1">
                Outside
              </p>
              <p className="text-lg font-semibold text-bank-gray-dark">
                {vehicle.climate.outsideTemp_C}°C
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-bank-gray-bg">
              <p className="text-[10px] text-bank-gray-mid uppercase tracking-widest mb-1">AC</p>
              <p className="text-lg font-semibold text-bank-gray-dark">
                {vehicle.climate.isClimateOn ? 'On' : 'Off'}
              </p>
            </div>
          </div>
        </Card>
      )}
      <div className="stagger-4 md:col-span-2">
        <Suspense
          fallback={
            <div className="card p-6">
              <div
                className="skeleton-pulse bg-bank-gray-alt/50 rounded-lg"
                style={{ height: 240 }}
              />
            </div>
          }
        >
          <VehicleMap vehicle={vehicle} darkMode={darkMode} />
        </Suspense>
      </div>
    </div>
  );
}

function ChargingTab({ charging, isLive, score, onViewRateDetails }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="stagger-1">
        <ChargingPattern
          patterns={charging?.patterns}
          sessions={charging?.sessions}
          totalSessions={charging?.totalSessions}
        />
      </div>
      <div className="space-y-6">
        <div className="stagger-2">
          <EnvironmentalImpact impact={charging?.environmentalImpact} />
        </div>
        <div className="stagger-3">
          <DataSources isLive={isLive} />
        </div>
      </div>
      <div className="md:col-span-2 stagger-4">
        <ChargingRateImpact
          score={score}
          charging={charging}
          onViewRateDetails={onViewRateDetails}
        />
      </div>
      <div className="md:col-span-2 stagger-5">
        <ChargingCost charging={charging} />
      </div>
    </div>
  );
}

function RateTab({ score, vehicle, onApply }) {
  return (
    <div className="space-y-6">
      {/* Primary flow: Rate comparison → Lock → Calculator */}
      <div className="stagger-1">
        <RateBenefit score={score} onApply={onApply} />
      </div>

      <div className="stagger-2">
        <RateLock score={score} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="stagger-3">
          <TierTable currentTier={score?.tier} />
        </div>
        <div className="stagger-4">
          <SavingsProjection rateReduction={score?.rateReduction} />
        </div>
      </div>

      {/* Secondary: collapsible sections */}
      <div className="stagger-5">
        <CollapsibleSection
          title="Market Rate Comparison"
          subtitle="See how your GreenDrive rate compares to UAE auto financing"
        >
          <CompetitiveRates rateReduction={score?.rateReduction} embedded />
        </CollapsibleSection>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="stagger-5">
          <CollapsibleSection
            title="Pre-Qualification Certificate"
            subtitle="Your verified GreenDrive pre-qualification"
          >
            <PreQualCertificate score={score} vehicle={vehicle} embedded />
          </CollapsibleSection>
        </div>
        <div className="stagger-5">
          <CollapsibleSection
            title="Recommended for You"
            subtitle="Personalised offers based on your GreenDrive profile"
          >
            <CrossSell score={score} embedded />
          </CollapsibleSection>
        </div>
      </div>
    </div>
  );
}

function AdminTab() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-bank-gray-dark">Portfolio Analytics</h2>
        <p className="text-xs text-bank-gray-mid mt-1">
          Aggregate view across all GreenDrive-connected customers
        </p>
      </div>
      <Suspense
        fallback={
          <div className="skeleton-pulse bg-bank-gray-alt/50 rounded-lg" style={{ height: 400 }} />
        }
      >
        <PortfolioAnalytics />
      </Suspense>
    </div>
  );
}
