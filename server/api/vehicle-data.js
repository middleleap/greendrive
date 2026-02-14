import { Router } from 'express';
import { isAuthenticated, teslaGet } from '../tesla-client.js';
import { MOCK_VEHICLE_DATA } from '../mock-data.js';
import * as cache from '../cache.js';

const router = Router();

router.get('/:vin', async (req, res) => {
  const { vin } = req.params;

  try {
    if (!isAuthenticated()) {
      return res.json(formatVehicleData(MOCK_VEHICLE_DATA, 'mock'));
    }

    const cached = cache.get(`vehicle-data-${vin}`);
    if (cached) return res.json(cached);

    const data = await teslaGet(`/api/1/vehicles/${vin}/vehicle_data`);
    const formatted = formatVehicleData({ ...data.response, vin }, 'live');
    cache.set(`vehicle-data-${vin}`, formatted);
    res.json(formatted);
  } catch (err) {
    console.error('[VehicleData]', err.message);
    const cached = cache.get(`vehicle-data-${vin}`);
    res.json(cached || formatVehicleData(MOCK_VEHICLE_DATA, 'mock'));
  }
});

function formatVehicleData(raw, dataSource) {
  const odometerMiles = raw.vehicle_state?.odometer || 0;
  return {
    vin: raw.vin,
    displayName: raw.vehicle_state?.vehicle_name || raw.display_name || 'My Tesla',
    model: decodeModel(raw.vin),
    software: (raw.vehicle_state?.car_version || '').split(' ')[0],
    battery: {
      level: raw.charge_state?.battery_level ?? 0,
      range_km: Math.round((raw.charge_state?.battery_range || 0) * 1.60934),
      charging: raw.charge_state?.charging_state || 'Unknown',
      chargerType: interpretChargerType(raw.charge_state?.fast_charger_type),
      energyAdded_kWh: raw.charge_state?.charge_energy_added || 0,
      chargeLimitPct: raw.charge_state?.charge_limit_soc || 80,
      scheduledCharging: raw.charge_state?.scheduled_charging_mode || 'Off',
    },
    odometer: {
      miles: Math.round(odometerMiles),
      km: Math.round(odometerMiles * 1.60934),
    },
    climate: {
      insideTemp_C: raw.climate_state?.inside_temp ?? null,
      outsideTemp_C: raw.climate_state?.outside_temp ?? null,
      isClimateOn: raw.climate_state?.is_climate_on ?? false,
    },
    location: {
      latitude: raw.drive_state?.latitude ?? null,
      longitude: raw.drive_state?.longitude ?? null,
      heading: raw.drive_state?.heading ?? null,
    },
    state: {
      locked: raw.vehicle_state?.locked ?? true,
      sentryMode: raw.vehicle_state?.sentry_mode ?? false,
      softwareUpdate: raw.vehicle_state?.software_update?.status || 'none',
    },
    dataSource,
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
  const models = {
    S: 'Model S',
    3: 'Model 3',
    X: 'Model X',
    Y: 'Model Y',
    R: 'Roadster',
    C: 'Cybertruck',
  };
  return models[vin?.charAt(3)] || 'Tesla';
}

export default router;
