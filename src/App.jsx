import { useState, useEffect } from 'react';
import { useTeslaData } from './hooks/useTeslaData.js';
import { useAuthStatus } from './hooks/useAuthStatus.js';
import Header from './components/Layout/Header.jsx';
import VehicleBanner from './components/Layout/VehicleBanner.jsx';
import TabBar from './components/Layout/TabBar.jsx';
import Footer from './components/Layout/Footer.jsx';
import ScoreGauge from './components/Score/ScoreGauge.jsx';
import ScoreBreakdown from './components/Score/ScoreBreakdown.jsx';
import TierBadge from './components/Score/TierBadge.jsx';
import VehicleDetails from './components/Vehicle/VehicleDetails.jsx';
import BatteryStatus from './components/Vehicle/BatteryStatus.jsx';
import VehicleMap from './components/Vehicle/VehicleMap.jsx';
import ChargingPattern from './components/Charging/ChargingPattern.jsx';
import EnvironmentalImpact from './components/Charging/EnvironmentalImpact.jsx';
import DataSources from './components/Charging/DataSources.jsx';
import ChargingCost from './components/Charging/ChargingCost.jsx';
import RateBenefit from './components/Rate/RateBenefit.jsx';
import TierTable from './components/Rate/TierTable.jsx';
import SavingsProjection from './components/Rate/SavingsProjection.jsx';
import Card from './components/shared/Card.jsx';

export default function App() {
  const { data, isLive, loading, refreshing, refresh } = useTeslaData();
  const { authenticated } = useAuthStatus();
  const [activeTab, setActiveTab] = useState('score');
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');

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

  return (
    <div className="min-h-screen bg-bank-gray-bg fade-in">
      <Header
        isLive={isLive}
        onRefresh={refresh}
        loading={refreshing}
        authenticated={authenticated}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((d) => !d)}
      />
      <VehicleBanner vehicle={vehicle} />
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

      <main
        className={`max-w-7xl mx-auto px-6 py-8 transition-opacity duration-300 ${refreshing ? 'opacity-60' : 'opacity-100'}`}
        key={activeTab}
      >
        {activeTab === 'score' && <ScoreTab score={score} />}
        {activeTab === 'vehicle' && <VehicleTab vehicle={vehicle} darkMode={darkMode} />}
        {activeTab === 'charging' && <ChargingTab charging={charging} isLive={isLive} />}
        {activeTab === 'rate' && <RateTab score={score} />}
      </main>

      <Footer isLive={isLive} lastUpdated={metadata?.lastUpdated} authenticated={authenticated} />
    </div>
  );
}

function ScoreTab({ score }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card featured className="flex flex-col items-center justify-center relative stagger-1">
          <ScoreGauge score={score?.totalScore || 0} tierColor={score?.tierColor} />
          <TierBadge
            tier={score?.tier}
            tierColor={score?.tierColor}
            rateReduction={score?.rateReduction}
          />
        </Card>
        <Card className="md:col-span-2 stagger-2">
          <ScoreBreakdown breakdown={score?.breakdown} />
        </Card>
      </div>

      {score?.suggestions?.length > 0 && (
        <div className="callout stagger-3">
          <p className="text-sm font-medium text-bank-maroon mb-2">Improve Your Score</p>
          <ul className="space-y-1.5">
            {score.suggestions.map((s, i) => (
              <li key={i} className="text-sm text-bank-gray-dark flex items-center gap-2">
                <span className="text-green-main font-medium">+{s.potentialPoints}</span>
                <span>{s.action}</span>
              </li>
            ))}
          </ul>
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
        <VehicleMap vehicle={vehicle} darkMode={darkMode} />
      </div>
    </div>
  );
}

function ChargingTab({ charging, isLive }) {
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
        <ChargingCost charging={charging} />
      </div>
    </div>
  );
}

function RateTab({ score }) {
  return (
    <div className="space-y-6">
      <div className="stagger-1">
        <RateBenefit score={score} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="stagger-2">
          <TierTable currentTier={score?.tier} />
        </div>
        <div className="stagger-3">
          <SavingsProjection rateReduction={score?.rateReduction} />
        </div>
      </div>
    </div>
  );
}
