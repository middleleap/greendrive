import { Router } from 'express';
import { isAuthenticated, teslaGet } from '../tesla-client.js';
import { MOCK_VEHICLE_DATA } from '../mock-data.js';
import { computeGreenScore } from '../scoring/engine.js';
import * as cache from '../cache.js';

const router = Router();

router.get('/:vin', async (req, res) => {
  const { vin } = req.params;

  try {
    if (!isAuthenticated()) {
      const score = computeGreenScore(MOCK_VEHICLE_DATA);
      return res.json({ ...score, dataSource: 'mock' });
    }

    const cached = cache.get(`green-score-${vin}`);
    if (cached) return res.json(cached);

    const data = await teslaGet(`/api/1/vehicles/${vin}/vehicle_data`);
    const vehicleData = { ...data.response, vin };
    const score = { ...computeGreenScore(vehicleData), dataSource: 'live' };
    cache.set(`green-score-${vin}`, score);
    res.json(score);
  } catch (err) {
    console.error('[GreenScore]', err.message);
    const cached = cache.get(`green-score-${vin}`);
    if (cached) return res.json(cached);
    const score = computeGreenScore(MOCK_VEHICLE_DATA);
    res.json({ ...score, dataSource: 'mock' });
  }
});

export default router;
