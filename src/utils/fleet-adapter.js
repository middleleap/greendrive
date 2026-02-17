import { MY_VEHICLES_FLEET } from './my-vehicles-data.js';

/**
 * Merges static bank-side fleet data with live Tesla vehicle list.
 * When authenticated:
 *  - Tesla vehicles whose VIN matches the live API stay connected
 *  - Tesla vehicles whose VIN is NOT in the live API are marked disconnected
 *  - Live Tesla vehicles not already in the bank-side fleet are added as new entries
 * When not authenticated: returns the static fleet as-is (demo mode).
 */
export function buildMergedFleet({ authenticated, teslaVehicles }) {
  if (!authenticated || !teslaVehicles?.length) {
    return MY_VEHICLES_FLEET;
  }

  const teslaVinSet = new Set(teslaVehicles.map((tv) => tv.vin));
  const fleetVinSet = new Set(MY_VEHICLES_FLEET.map((v) => v.vin));

  // Update existing fleet entries based on live Tesla account
  const updatedFleet = MY_VEHICLES_FLEET.map((fleetVehicle) => {
    if (fleetVehicle.make !== 'Tesla') return fleetVehicle;
    if (teslaVinSet.has(fleetVehicle.vin)) {
      return { ...fleetVehicle, connected: true };
    }
    // This mock Tesla VIN is not on the live account — disconnect it
    return { ...fleetVehicle, connected: false, oem: null, greenDriveScore: null };
  });

  // Add live Tesla vehicles that aren't already in the bank-side fleet
  const newVehicles = teslaVehicles
    .filter((tv) => !fleetVinSet.has(tv.vin))
    .map((tv) => buildFleetEntryFromTesla(tv));

  return [...updatedFleet, ...newVehicles];
}

/**
 * Creates a fleet entry for a live Tesla vehicle that has no bank-side record.
 * Bank-specific fields (loan, insurance) are null since there's no bank data.
 * OEM data and score will be populated later via enrichWithDashboard.
 */
function buildFleetEntryFromTesla(teslaVehicle) {
  const model = teslaVehicle.model || 'Tesla';
  const bodyType = ['Model X', 'Model Y', 'Cybertruck'].includes(model) ? 'SUV' : 'Saloon';
  return {
    id: `tv-${teslaVehicle.vin}`,
    vin: teslaVehicle.vin,
    year: decodeYearFromVin(teslaVehicle.vin),
    make: 'Tesla',
    model,
    trim: '',
    plateSource: '',
    plateCode: '',
    plateNumber: '',
    engineType: 'Electric',
    bodyType,
    batteryCapacity: null,
    carSpec: 'GCC',
    carUsage: 'Private',
    color: '',
    connected: true,
    oem: null,
    greenDriveScore: null,
    loan: null,
    insurance: null,
    consent: null,
    specs: null,
    alerts: [],
  };
}

/** Decodes model year from the 10th character of the VIN (standard VIN encoding). */
function decodeYearFromVin(vin) {
  if (!vin || vin.length < 10) return null;
  const code = vin.charAt(9);
  const yearMap = {
    A: 2010, B: 2011, C: 2012, D: 2013, E: 2014, F: 2015,
    G: 2016, H: 2017, J: 2018, K: 2019, L: 2020, M: 2021,
    N: 2022, P: 2023, R: 2024, S: 2025, T: 2026, V: 2027,
    W: 2028, X: 2029, Y: 2030,
  };
  return yearMap[code] || null;
}

/**
 * Enriches a single fleet vehicle with live dashboard data from /api/dashboard/:vin.
 * Maps the dashboard response shape into the fleet vehicle's `oem` and `greenDriveScore` fields
 * while preserving all bank-side fields (loan, insurance, specs, plate data, etc.).
 * For vehicles without bank-side data, also populates identity fields from the dashboard.
 */
export function enrichWithDashboard(fleetVehicle, dashboard) {
  if (!dashboard?.vehicle || !dashboard?.score) return fleetVehicle;

  return {
    ...fleetVehicle,
    connected: true,
    // Populate identity fields from live data when bank-side data is missing
    model: fleetVehicle.model || dashboard.vehicle.model || 'Tesla',
    year: fleetVehicle.year || decodeYearFromVin(fleetVehicle.vin),
    oem: {
      batteryLevel: dashboard.vehicle.battery?.level ?? fleetVehicle.oem?.batteryLevel ?? 0,
      batterySoH: estimateSoH(dashboard, fleetVehicle),
      rangeKm: dashboard.vehicle.battery?.range_km ?? fleetVehicle.oem?.rangeKm ?? 0,
      odometerKm: dashboard.vehicle.odometer?.km ?? fleetVehicle.oem?.odometerKm ?? 0,
      chargingState: dashboard.vehicle.battery?.charging ?? 'Unknown',
      efficiencyWhKm: fleetVehicle.oem?.efficiencyWhKm ?? 148,
      softwareVersion: dashboard.vehicle.software ?? '',
    },
    greenDriveScore: {
      totalScore: dashboard.score.totalScore,
      tier: dashboard.score.tier,
      tierColor: dashboard.score.tierColor,
      rateReduction: dashboard.score.rateReduction,
      breakdown: dashboard.score.breakdown,
    },
  };
}

function estimateSoH(dashboard, fleetVehicle) {
  if (dashboard.score?.breakdown?.batteryHealth) {
    const bh = dashboard.score.breakdown.batteryHealth;
    return Math.round((bh.score / bh.max) * 100);
  }
  return fleetVehicle.oem?.batterySoH ?? 95;
}
