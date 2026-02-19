import { WEIGHTS } from './weights.js';
import { getTier } from './tiers.js';

// EPA rated ranges (miles) for battery health calculation
const EPA_RANGES = {
  S: 405,
  3: 358,
  X: 348,
  Y: 330,
  R: 310,
  C: 340,
};

function modelCodeFromVin(vin) {
  return vin ? vin.charAt(3) : 'Y';
}

function scoreBatteryHealth(vehicleData) {
  const { battery_level, battery_range } = vehicleData.charge_state || {};
  if (!battery_level || !battery_range) return { score: 10, detail: 'Insufficient data' };

  const modelCode = modelCodeFromVin(vehicleData.vin);
  const epaRange = EPA_RANGES[modelCode] || 330;
  const fullRangeEstimate = (battery_range / battery_level) * 100;
  const retentionPct = Math.min((fullRangeEstimate / epaRange) * 100, 100);
  const score = Math.floor((retentionPct / 100) * WEIGHTS.batteryHealth.max);

  return {
    score: Math.min(score, WEIGHTS.batteryHealth.max),
    detail: `${Math.round(retentionPct)}% estimated health`,
  };
}

function scoreChargingBehavior(vehicleData) {
  const chargerType = vehicleData.charge_state?.fast_charger_type || '';
  const chargingState = vehicleData.charge_state?.charging_state || '';

  if (chargingState === 'Disconnected' && chargerType === '') {
    return { score: 15, detail: 'Not currently charging' };
  }

  // Empty or "<invalid>" = Home / Wall Connector (25 requires confirmed renewable source)
  if (chargerType === '' || chargerType === '<invalid>') {
    return { score: 22, detail: 'Home charging detected' };
  }
  if (chargerType === 'MCSingleWireCAN') {
    return { score: 20, detail: 'Mobile Connector detected' };
  }
  if (chargerType === 'CCS' || chargerType === 'CHAdeMO') {
    return { score: 12, detail: 'Public DC fast charger' };
  }
  if (chargerType === 'Tesla') {
    return { score: 10, detail: 'Supercharger detected' };
  }
  return { score: 15, detail: 'Charger type unknown' };
}

function scoreEfficiency(vehicleData) {
  const odometerMiles = vehicleData.vehicle_state?.odometer || 0;
  const km = odometerMiles * 1.60934;

  if (km < 5000) return { score: 10, detail: `${Math.round(km).toLocaleString()} km — low usage` };
  if (km < 10000)
    return { score: 13, detail: `${Math.round(km).toLocaleString()} km — light usage` };
  if (km < 15000)
    return { score: 15, detail: `${Math.round(km).toLocaleString()} km — moderate usage` };
  if (km <= 20000)
    return { score: 20, detail: `${Math.round(km).toLocaleString()} km — active usage` };
  if (km <= 30000)
    return { score: 13, detail: `${Math.round(km).toLocaleString()} km — high usage` };
  return { score: 8, detail: `${Math.round(km).toLocaleString()} km — very high usage` };
}

function scoreEvOwnership(vehicleData) {
  const modelCode = modelCodeFromVin(vehicleData.vin);
  // All Tesla models are full BEV
  if (['S', '3', 'X', 'Y', 'R', 'C'].includes(modelCode)) {
    return { score: 15, detail: 'Full BEV' };
  }
  return { score: 10, detail: 'Vehicle type unconfirmed' };
}

function scoreVehicleCondition(vehicleData) {
  const carVersion = vehicleData.vehicle_state?.car_version || '';
  const yearMatch = carVersion.match(/^(\d{4})\./);
  const year = yearMatch ? parseInt(yearMatch[1], 10) : 0;

  if (year >= 2026) return { score: 10, detail: `Software ${carVersion.split(' ')[0]} — latest` };
  if (year >= 2025)
    return { score: 8, detail: `Software ${carVersion.split(' ')[0]} — up to date` };
  if (year >= 2024) return { score: 6, detail: `Software ${carVersion.split(' ')[0]} — recent` };
  return { score: 4, detail: `Software ${carVersion.split(' ')[0]} — outdated` };
}

function scoreRenewableEnergy() {
  return { score: 0, detail: 'Pending DEWA/Open Finance consent' };
}

function getSuggestions(breakdown) {
  const suggestions = [];
  if (breakdown.chargingBehavior.score < 20) {
    suggestions.push({ action: 'Increase home charging ratio', potentialPoints: 5 });
  }
  if (breakdown.renewableEnergy.score === 0) {
    suggestions.push({ action: 'Connect DEWA for home energy data', potentialPoints: 10 });
  }
  if (breakdown.vehicleCondition.score < 8) {
    suggestions.push({ action: 'Update vehicle software', potentialPoints: 3 });
  }
  if (breakdown.batteryHealth.score < 16) {
    suggestions.push({ action: 'Maintain battery between 20-80%', potentialPoints: 4 });
  }
  if (breakdown.efficiency.score < breakdown.efficiency.max) {
    suggestions.push({
      action: 'Optimal efficiency range is 15,000–20,000 km annual driving',
      potentialPoints: breakdown.efficiency.max - breakdown.efficiency.score,
    });
  }
  return suggestions;
}

export function computeGreenScore(vehicleData) {
  const breakdown = {
    batteryHealth: { ...scoreBatteryHealth(vehicleData), max: WEIGHTS.batteryHealth.max },
    chargingBehavior: { ...scoreChargingBehavior(vehicleData), max: WEIGHTS.chargingBehavior.max },
    efficiency: { ...scoreEfficiency(vehicleData), max: WEIGHTS.efficiency.max },
    evOwnership: { ...scoreEvOwnership(vehicleData), max: WEIGHTS.evOwnership.max },
    vehicleCondition: { ...scoreVehicleCondition(vehicleData), max: WEIGHTS.vehicleCondition.max },
    renewableEnergy: { ...scoreRenewableEnergy(), max: WEIGHTS.renewableEnergy.max },
  };

  const totalScore = Object.values(breakdown).reduce((sum, b) => sum + b.score, 0);
  const tier = getTier(totalScore);

  const modelCode = modelCodeFromVin(vehicleData.vin);
  const modelNames = {
    S: 'Model S',
    3: 'Model 3',
    X: 'Model X',
    Y: 'Model Y',
    R: 'Roadster',
    C: 'Cybertruck',
  };

  return {
    vin: vehicleData.vin,
    model: modelNames[modelCode] || 'Tesla',
    totalScore,
    maxPossible: 100,
    tier: tier.name,
    tierColor: tier.color,
    rateReduction: tier.rateReduction,
    breakdown,
    suggestions: getSuggestions(breakdown),
    computedAt: new Date().toISOString(),
  };
}
