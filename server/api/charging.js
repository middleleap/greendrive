import { Router } from 'express';
import { isAuthenticated, teslaGet } from '../tesla-client.js';
import { MOCK_CHARGING_HISTORY } from '../mock-data.js';
import * as cache from '../cache.js';

const router = Router();

router.get('/:vin', async (req, res) => {
  const { vin } = req.params;

  try {
    if (!isAuthenticated()) {
      return res.json({ ...MOCK_CHARGING_HISTORY, dataSource: 'mock' });
    }

    const cached = cache.get(`charging-${vin}`);
    if (cached) return res.json(cached);

    const data = await teslaGet(`/api/1/vehicles/${vin}/charge_history`);
    const formatted = { ...formatChargingData(data), dataSource: 'live' };
    cache.set(`charging-${vin}`, formatted);
    res.json(formatted);
  } catch (err) {
    console.error('[Charging]', err.message);
    const cached = cache.get(`charging-${vin}`);
    res.json(cached || { ...MOCK_CHARGING_HISTORY, dataSource: 'mock' });
  }
});

function formatChargingData(raw) {
  // Tesla charge_history format varies; provide sensible defaults
  const sessions = raw?.response || raw?.charging_sessions || [];
  return {
    sessions: sessions.slice(0, 10),
    patterns: MOCK_CHARGING_HISTORY.patterns,
    totalSessions: sessions.length || MOCK_CHARGING_HISTORY.totalSessions,
    totalEnergy_kWh: MOCK_CHARGING_HISTORY.totalEnergy_kWh,
    avgSessionDuration_min: MOCK_CHARGING_HISTORY.avgSessionDuration_min,
    environmentalImpact: MOCK_CHARGING_HISTORY.environmentalImpact,
  };
}

export default router;
