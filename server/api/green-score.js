import { Router } from 'express';
import { isAuthenticated, teslaGet } from '../tesla-client.js';
import { MOCK_VEHICLE_DATA } from '../mock-data.js';
import { computeGreenScore } from '../scoring/engine.js';
import { saveScore } from '../db.js';
import * as cache from '../cache.js';

const router = Router();

router.get('/:vin', async (req, res) => {
  const { vin } = req.params;

  try {
    if (!isAuthenticated()) {
      const score = computeGreenScore(MOCK_VEHICLE_DATA);
      try { saveScore(score, 'mock'); } catch { /* non-critical */ }
      return res.json({ ...score, dataSource: 'mock' });
    }

    const cached = cache.get(`green-score-${vin}`);
    if (cached) return res.json(cached);

    const data = await teslaGet(`/api/1/vehicles/${vin}/vehicle_data`);
    const vehicleData = { ...data.response, vin };
    const score = { ...computeGreenScore(vehicleData), dataSource: 'live' };
    try { saveScore(score, 'live'); } catch { /* non-critical */ }
    cache.set(`green-score-${vin}`, score);
    res.json(score);
  } catch (err) {
    console.error('[GreenScore]', err.message);
    const cached = cache.get(`green-score-${vin}`);
    if (cached) return res.json(cached);
    const score = computeGreenScore(MOCK_VEHICLE_DATA);
    try { saveScore(score, 'mock'); } catch { /* non-critical */ }
    res.json({ ...score, dataSource: 'mock' });
  }
});

export default router;
