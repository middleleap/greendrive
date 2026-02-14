import { Router } from 'express';
import { isAuthenticated, teslaGet } from '../tesla-client.js';
import { MOCK_VEHICLE_DATA, MOCK_CHARGING_HISTORY } from '../mock-data.js';
import { computeGreenScore } from '../scoring/engine.js';
import * as cache from '../cache.js';

const router = Router();

router.get('/:vin', async (req, res) => {
  const { vin } = req.params;

  try {
    if (!isAuthenticated()) {
      return res.json(buildDashboard(MOCK_VEHICLE_DATA, MOCK_CHARGING_HISTORY, 'mock'));
    }

    const cached = cache.get(`dashboard-${vin}`);
    if (cached) return res.json(cached);

    const [vehicleRes, chargingRes] = await Promise.all([
      teslaGet(`/api/1/vehicles/${vin}/vehicle_data`),
      teslaGet(`/api/1/vehicles/${vin}/charge_history`).catch(() => null),
    ]);

    const vehicleData = { ...vehicleRes.response, vin };
    const chargingData = chargingRes?.response || chargingRes;
    const dashboard = buildDashboard(vehicleData, chargingData, 'live');
    cache.set(`dashboard-${vin}`, dashboard);
    res.json(dashboard);
  } catch (err) {
    console.error('[Dashboard]', err.message);
    const cached = cache.get(`dashboard-${vin}`);
    res.json(cached || buildDashboard(MOCK_VEHICLE_DATA, MOCK_CHARGING_HISTORY, 'mock'));
  }
});

function buildDashboard(vehicleRaw, chargingRaw, dataSource) {
  const odometerMiles = vehicleRaw.vehicle_state?.odometer || 0;

  const vehicle = {
    vin: vehicleRaw.vin,
    displayName: vehicleRaw.vehicle_state?.vehicle_name || vehicleRaw.display_name || 'My Tesla',
    model: decodeModel(vehicleRaw.vin),
    software: (vehicleRaw.vehicle_state?.car_version || '').split(' ')[0],
    battery: {
      level: vehicleRaw.charge_state?.battery_level ?? 0,
      range_km: Math.round((vehicleRaw.charge_state?.battery_range || 0) * 1.60934),
      charging: vehicleRaw.charge_state?.charging_state || 'Unknown',
      chargerType: interpretChargerType(vehicleRaw.charge_state?.fast_charger_type),
      energyAdded_kWh: vehicleRaw.charge_state?.charge_energy_added || 0,
      chargeLimitPct: vehicleRaw.charge_state?.charge_limit_soc || 80,
      scheduledCharging: vehicleRaw.charge_state?.scheduled_charging_mode || 'Off',
    },
    odometer: {
      miles: Math.round(odometerMiles),
      km: Math.round(odometerMiles * 1.60934),
    },
    climate: {
      insideTemp_C: vehicleRaw.climate_state?.inside_temp ?? null,
      outsideTemp_C: vehicleRaw.climate_state?.outside_temp ?? null,
      isClimateOn: vehicleRaw.climate_state?.is_climate_on ?? false,
    },
    location: {
      latitude: vehicleRaw.drive_state?.latitude ?? null,
      longitude: vehicleRaw.drive_state?.longitude ?? null,
      heading: vehicleRaw.drive_state?.heading ?? null,
    },
    state: {
      locked: vehicleRaw.vehicle_state?.locked ?? true,
      sentryMode: vehicleRaw.vehicle_state?.sentry_mode ?? false,
      softwareUpdate: vehicleRaw.vehicle_state?.software_update?.status || 'none',
    },
  };

  const score = computeGreenScore(vehicleRaw);

  const charging = chargingRaw?.sessions
    ? chargingRaw
    : MOCK_CHARGING_HISTORY;

  return {
    vehicle,
    score: { ...score, dataSource },
    charging,
    metadata: {
      isLive: dataSource === 'live',
      dataSource,
      lastUpdated: new Date().toISOString(),
    },
  };
}

function interpretChargerType(type) {
  if (!type || type === '<invalid>') return 'Home';
  if (type === 'Tesla') return 'Supercharger';
  if (type === 'MCSingleWireCAN') return 'Mobile Connector';
  if (type === 'CCS' || type === 'CHAdeMO') return 'Public DC';
  return type;
}

function decodeModel(vin) {
  const models = { S: 'Model S', '3': 'Model 3', X: 'Model X', Y: 'Model Y', R: 'Roadster', C: 'Cybertruck' };
  return models[vin?.charAt(3)] || 'Tesla';
}

export default router;
