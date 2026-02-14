import { useState } from 'react';
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
import ChargingPattern from './components/Charging/ChargingPattern.jsx';
import EnvironmentalImpact from './components/Charging/EnvironmentalImpact.jsx';
import DataSources from './components/Charging/DataSources.jsx';
import RateBenefit from './components/Rate/RateBenefit.jsx';
import TierTable from './components/Rate/TierTable.jsx';
import SavingsProjection from './components/Rate/SavingsProjection.jsx';
import Card from './components/shared/Card.jsx';

export default function App() {
  const { data, isLive, loading, refreshing, refresh } = useTeslaData();
  const { authenticated } = useAuthStatus();
  const [activeTab, setActiveTab] = useState('score');

  if (loading && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bank-gray-bg">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-bank-gray-alt border-t-green-main rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-bank-gray-mid">Loading GreenDrive...</p>
        </div>
      </div>
    );
  }

  const { vehicle, score, charging, metadata } = data || {};

  return (
    <div className="min-h-screen bg-bank-gray-bg fade-in">
      <Header isLive={isLive} onRefresh={refresh} loading={refreshing} authenticated={authenticated} />
      <VehicleBanner vehicle={vehicle} />
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className={`max-w-7xl mx-auto px-6 py-6 transition-opacity duration-300 ${refreshing ? 'opacity-60' : 'opacity-100'}`}>
        {activeTab === 'score' && <ScoreTab score={score} />}
        {activeTab === 'vehicle' && <VehicleTab vehicle={vehicle} />}
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
        <Card className="flex flex-col items-center justify-center relative">
          <ScoreGauge score={score?.totalScore || 0} tierColor={score?.tierColor} />
          <TierBadge tier={score?.tier} tierColor={score?.tierColor} rateReduction={score?.rateReduction} />
        </Card>
        <Card className="md:col-span-2">
          <ScoreBreakdown breakdown={score?.breakdown} />
        </Card>
      </div>

      {score?.suggestions?.length > 0 && (
        <div className="callout">
          <p className="text-sm font-medium text-bank-maroon mb-2">Improve Your Score</p>
          <ul className="space-y-1">
            {score.suggestions.map((s, i) => (
              <li key={i} className="text-sm text-bank-gray-dark flex items-center gap-2">
                <span className="text-green-main">+{s.potentialPoints}</span>
                <span>{s.action}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function VehicleTab({ vehicle }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <VehicleDetails vehicle={vehicle} />
      <BatteryStatus battery={vehicle?.battery} />
      {vehicle?.climate && (
        <Card>
          <h3 className="text-sm font-medium text-bank-gray-dark mb-3">Climate</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 rounded-lg bg-bank-gray-bg">
              <p className="text-xs text-bank-gray-mid">Inside</p>
              <p className="text-lg font-medium text-bank-gray-dark">{vehicle.climate.insideTemp_C}°C</p>
            </div>
            <div className="p-3 rounded-lg bg-bank-gray-bg">
              <p className="text-xs text-bank-gray-mid">Outside</p>
              <p className="text-lg font-medium text-bank-gray-dark">{vehicle.climate.outsideTemp_C}°C</p>
            </div>
            <div className="p-3 rounded-lg bg-bank-gray-bg">
              <p className="text-xs text-bank-gray-mid">AC</p>
              <p className="text-lg font-medium text-bank-gray-dark">{vehicle.climate.isClimateOn ? 'On' : 'Off'}</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

function ChargingTab({ charging, isLive }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ChargingPattern
        patterns={charging?.patterns}
        sessions={charging?.sessions}
        totalSessions={charging?.totalSessions}
      />
      <div className="space-y-6">
        <EnvironmentalImpact impact={charging?.environmentalImpact} />
        <DataSources isLive={isLive} />
      </div>
    </div>
  );
}

function RateTab({ score }) {
  return (
    <div className="space-y-6">
      <RateBenefit score={score} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TierTable currentTier={score?.tier} />
        <SavingsProjection rateReduction={score?.rateReduction} />
      </div>
    </div>
  );
}
