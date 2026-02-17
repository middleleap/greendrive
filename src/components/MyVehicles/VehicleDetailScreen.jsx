import { useState } from 'react';
import OverviewTab from './OverviewTab.jsx';
import LoanTab from './LoanTab.jsx';
import InsuranceTab from './InsuranceTab.jsx';
import HealthTab from './HealthTab.jsx';

const DETAIL_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'loan', label: 'Loan' },
  { id: 'insurance', label: 'Insurance' },
  { id: 'health', label: 'Health' },
];

export default function VehicleDetailScreen({ vehicle, onBack, onConnectTesla, dashLoading }) {
  const [activeTab, setActiveTab] = useState('overview');
  const score = vehicle.greenDriveScore;
  const tabs = vehicle.connected ? DETAIL_TABS : DETAIL_TABS.filter((t) => t.id !== 'health');

  return (
    <div className="flex flex-col h-full">
      {/* Back button + Vehicle Hero */}
      <div className="px-4 pt-2 pb-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-bank-red text-xs mb-3 hover:text-bank-maroon transition-colors"
        >
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 19l-7-7 7-7" />
          </svg>
          My Vehicles
        </button>

        {/* Vehicle Hero */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-base font-semibold text-bank-gray-dark">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </p>
            <p className="text-[10px] text-bank-gray-mid">
              {vehicle.trim} · {vehicle.plateSource} {vehicle.plateCode} {vehicle.plateNumber}
            </p>
            {vehicle.oem && (
              <p className="text-[10px] text-bank-gray-mid mt-0.5">
                {vehicle.oem.odometerKm.toLocaleString()} km
              </p>
            )}
          </div>
          {score && (
            <div className="flex flex-col items-center">
              <div className="relative w-14 h-14">
                <svg viewBox="0 0 56 56" className="w-14 h-14">
                  <circle cx="28" cy="28" r="23" fill="none" stroke="#E4E4E4" strokeWidth="3.5" />
                  <circle
                    cx="28"
                    cy="28"
                    r="23"
                    fill="none"
                    stroke={score.tierColor}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeDasharray={`${(score.totalScore / 100) * 144.5} 144.5`}
                    transform="rotate(-90 28 28)"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-bank-gray-dark">
                  {score.totalScore}
                </span>
              </div>
              <span className="text-[8px] font-medium" style={{ color: score.tierColor }}>
                {score.tier}
              </span>
            </div>
          )}
        </div>

        {/* Specs Bar */}
        {vehicle.specs && (
          <div className="grid grid-cols-4 gap-1 mt-3">
            <SpecItem value={`${vehicle.specs.powerHp}`} unit="hp" />
            <SpecItem value={`${vehicle.specs.torqueNm}`} unit="Nm" />
            <SpecItem value={`${vehicle.specs.zeroToHundred}s`} unit="0-100" />
            <SpecItem value={`${vehicle.specs.topSpeed}`} unit="km/h" />
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-bank-gray-alt px-4">
        <div className="flex gap-0.5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`mv-detail-tab ${activeTab === tab.id ? 'mv-detail-tab-active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-6">
        {activeTab === 'overview' && (
          <OverviewTab vehicle={vehicle} onConnectTesla={onConnectTesla} />
        )}
        {activeTab === 'loan' && <LoanTab vehicle={vehicle} />}
        {activeTab === 'insurance' && <InsuranceTab vehicle={vehicle} />}
        {activeTab === 'health' && <HealthTab vehicle={vehicle} onConnectTesla={onConnectTesla} />}
      </div>
    </div>
  );
}

function SpecItem({ value, unit }) {
  return (
    <div className="text-center p-1.5 rounded-lg bg-bank-gray-bg">
      <p className="text-xs font-semibold text-bank-gray-dark">{value}</p>
      <p className="text-[7px] uppercase tracking-wider text-bank-gray-mid">{unit}</p>
    </div>
  );
}
