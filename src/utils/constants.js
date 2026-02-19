export const API_BASE = import.meta.env.VITE_API_BASE || '';

export const TIERS = [
  { name: 'Platinum Green', minScore: 85, maxScore: 100, rateReduction: 0.5, color: '#0A6847' },
  { name: 'Gold Green', minScore: 70, maxScore: 84, rateReduction: 0.4, color: '#16A34A' },
  { name: 'Silver Green', minScore: 55, maxScore: 69, rateReduction: 0.25, color: '#22C55E' },
  { name: 'Bronze Green', minScore: 40, maxScore: 54, rateReduction: 0.1, color: '#F26B43' },
  { name: 'Standard', minScore: 0, maxScore: 39, rateReduction: 0.0, color: '#A5A5A5' },
];

export const BASE_RATE = 3.99; // Bank Green Car Loan base rate %

// Multi-vehicle mock fleet
export const MOCK_VEHICLES = [
  { vin: '5YJYGDEE1NF000000', displayName: 'My Tesla', model: 'Model Y' },
  { vin: '5YJ3E1EA8NF100000', displayName: 'City Commuter', model: 'Model 3' },
];

export const MOCK_DASHBOARD = {
  vehicle: {
    vin: '5YJYGDEE1NF000000',
    displayName: 'My Tesla',
    model: 'Model Y',
    software: '2025.2.6',
    battery: {
      level: 78,
      range_km: 385,
      charging: 'Complete',
      chargerType: 'Home',
      energyAdded_kWh: 52.4,
      chargeLimitPct: 80,
      scheduledCharging: 'Off',
    },
    odometer: { miles: 7980, km: 12840 },
    climate: { insideTemp_C: 24.5, outsideTemp_C: 38.2, isClimateOn: false },
    location: { latitude: 24.4539, longitude: 54.3773, heading: 180 },
    state: { locked: true, sentryMode: true, softwareUpdate: 'none' },
  },
  score: {
    vin: '5YJYGDEE1NF000000',
    model: 'Model Y',
    totalScore: 78,
    maxPossible: 100,
    tier: 'Gold Green',
    tierColor: '#16A34A',
    rateReduction: 0.4,
    breakdown: {
      batteryHealth: { score: 18, max: 20, detail: '97% estimated health' },
      chargingBehavior: { score: 22, max: 25, detail: 'Home charging detected' },
      efficiency: { score: 15, max: 20, detail: '12,840 km — moderate usage' },
      evOwnership: { score: 15, max: 15, detail: 'Full BEV' },
      vehicleCondition: { score: 8, max: 10, detail: 'Software 2025.2.6 — up to date' },
      renewableEnergy: { score: 0, max: 10, detail: 'Pending DEWA/Open Finance consent' },
    },
    suggestions: [
      { action: 'Connect DEWA for home energy data', potentialPoints: 10 },
      { action: 'Update vehicle software', potentialPoints: 3 },
    ],
    computedAt: new Date().toISOString(),
    dataSource: 'mock',
  },
  charging: {
    sessions: [
      {
        date: '2026-02-13',
        location: 'Home',
        energy_kWh: 45.2,
        duration_min: 240,
        type: 'Wall Connector',
      },
      {
        date: '2026-02-10',
        location: 'Home',
        energy_kWh: 38.7,
        duration_min: 195,
        type: 'Wall Connector',
      },
      {
        date: '2026-02-07',
        location: 'ADNOC Station',
        energy_kWh: 52.1,
        duration_min: 35,
        type: 'Supercharger',
      },
      {
        date: '2026-02-04',
        location: 'Home',
        energy_kWh: 41.3,
        duration_min: 210,
        type: 'Wall Connector',
      },
      {
        date: '2026-02-01',
        location: 'Yas Mall',
        energy_kWh: 28.5,
        duration_min: 120,
        type: 'Public L2',
      },
      {
        date: '2026-01-28',
        location: 'Home',
        energy_kWh: 44.8,
        duration_min: 230,
        type: 'Wall Connector',
      },
      {
        date: '2026-01-25',
        location: 'Home',
        energy_kWh: 39.2,
        duration_min: 200,
        type: 'Wall Connector',
      },
      {
        date: '2026-01-22',
        location: 'Dubai Mall',
        energy_kWh: 55.0,
        duration_min: 38,
        type: 'Supercharger',
      },
    ],
    patterns: { home: 72, supercharger: 15, publicL2: 8, other: 5 },
    totalSessions: 156,
    totalEnergy_kWh: 4250,
    avgSessionDuration_min: 180,
    environmentalImpact: {
      co2Saved_kg: 2890,
      treesEquivalent: 48,
      gasolineSaved_liters: 1420,
      costSaved_aed: 3200,
    },
  },
  metadata: {
    isLive: false,
    dataSource: 'mock',
    lastUpdated: new Date().toISOString(),
  },
};

// Additional mock dashboards for multi-vehicle support
export const MOCK_DASHBOARDS = {
  '5YJYGDEE1NF000000': MOCK_DASHBOARD,
  '5YJ3E1EA8NF100000': {
    vehicle: {
      vin: '5YJ3E1EA8NF100000',
      displayName: 'City Commuter',
      model: 'Model 3',
      software: '2026.1.3',
      battery: {
        level: 92,
        range_km: 510,
        charging: 'Charging',
        chargerType: 'Home',
        energyAdded_kWh: 18.3,
        chargeLimitPct: 90,
        scheduledCharging: 'On',
      },
      odometer: { miles: 11180, km: 17995 },
      climate: { insideTemp_C: 22.0, outsideTemp_C: 36.8, isClimateOn: false },
      location: { latitude: 25.2048, longitude: 55.2708, heading: 90 },
      state: { locked: true, sentryMode: false, softwareUpdate: 'none' },
    },
    score: {
      vin: '5YJ3E1EA8NF100000',
      model: 'Model 3',
      totalScore: 88,
      maxPossible: 100,
      tier: 'Platinum Green',
      tierColor: '#0A6847',
      rateReduction: 0.5,
      breakdown: {
        batteryHealth: { score: 19, max: 20, detail: '99% estimated health' },
        chargingBehavior: { score: 22, max: 25, detail: 'Home charging detected' },
        efficiency: { score: 20, max: 20, detail: '17,995 km — active usage' },
        evOwnership: { score: 15, max: 15, detail: 'Full BEV' },
        vehicleCondition: { score: 10, max: 10, detail: 'Software 2026.1.3 — latest' },
        renewableEnergy: { score: 2, max: 10, detail: 'Partial DEWA data available' },
      },
      suggestions: [{ action: 'Connect DEWA for home energy data', potentialPoints: 8 }],
      computedAt: new Date().toISOString(),
      dataSource: 'mock',
    },
    charging: {
      sessions: [
        {
          date: '2026-02-14',
          location: 'Home',
          energy_kWh: 32.1,
          duration_min: 180,
          type: 'Wall Connector',
        },
        {
          date: '2026-02-12',
          location: 'Home',
          energy_kWh: 28.4,
          duration_min: 150,
          type: 'Wall Connector',
        },
        {
          date: '2026-02-09',
          location: 'Home',
          energy_kWh: 35.7,
          duration_min: 200,
          type: 'Wall Connector',
        },
        {
          date: '2026-02-05',
          location: 'ENOC Green',
          energy_kWh: 48.2,
          duration_min: 30,
          type: 'Supercharger',
        },
      ],
      patterns: { home: 85, supercharger: 8, publicL2: 5, other: 2 },
      totalSessions: 203,
      totalEnergy_kWh: 5120,
      avgSessionDuration_min: 165,
      environmentalImpact: {
        co2Saved_kg: 3480,
        treesEquivalent: 58,
        gasolineSaved_liters: 1710,
        costSaved_aed: 4100,
      },
    },
    metadata: { isLive: false, dataSource: 'mock', lastUpdated: new Date().toISOString() },
  },
};
