import { MY_VEHICLES_FLEET } from './my-vehicles-data.js';

/**
 * Merges static bank-side fleet data with live Tesla vehicle list.
 * For Tesla vehicles whose VIN appears in the authenticated Tesla API vehicle list,
 * sets `connected: true`. All other fields are preserved as-is.
 */
export function buildMergedFleet({ authenticated, teslaVehicles }) {
  if (!authenticated || !teslaVehicles?.length) {
    return MY_VEHICLES_FLEET;
  }

  const teslaVinSet = new Set(teslaVehicles.map((tv) => tv.vin));

  return MY_VEHICLES_FLEET.map((fleetVehicle) => {
    if (fleetVehicle.make !== 'Tesla') return fleetVehicle;
    if (!teslaVinSet.has(fleetVehicle.vin)) return fleetVehicle;

    return { ...fleetVehicle, connected: true };
  });
}

/**
 * Enriches a single fleet vehicle with live dashboard data from /api/dashboard/:vin.
 * Maps the dashboard response shape into the fleet vehicle's `oem` and `greenDriveScore` fields
 * while preserving all bank-side fields (loan, insurance, specs, plate data, etc.).
 */
export function enrichWithDashboard(fleetVehicle, dashboard) {
  if (!dashboard?.vehicle || !dashboard?.score) return fleetVehicle;

  return {
    ...fleetVehicle,
    connected: true,
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
