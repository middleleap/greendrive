import { Router } from 'express';
import { isAuthenticated, teslaGet } from '../tesla-client.js';
import { MOCK_VEHICLE_LIST } from '../mock-data.js';
import * as cache from '../cache.js';

const router = Router();

router.get('/', async (req, res) => {
  const forceMock = req.query.forceMock === 'true';
  try {
    if (forceMock || !isAuthenticated()) {
      return res.json(MOCK_VEHICLE_LIST.map(v => ({
        id: v.id,
        vin: v.vin,
        displayName: v.display_name,
        model: 'Model Y',
        state: v.state,
        inService: v.in_service,
        dataSource: 'mock',
      })));
    }

    const cached = cache.get('vehicles');
    if (cached) return res.json(cached);

    const data = await teslaGet('/api/1/vehicles');
    const vehicles = (data.response || []).map(v => ({
      id: v.id,
      vin: v.vin,
      displayName: v.display_name,
      model: v.vin ? decodeModel(v.vin) : 'Tesla',
      state: v.state,
      inService: v.in_service,
      dataSource: 'live',
    }));

    cache.set('vehicles', vehicles);
    res.json(vehicles);
  } catch (err) {
    console.error('[Vehicles]', err.message);
    res.json(MOCK_VEHICLE_LIST.map(v => ({
      id: v.id, vin: v.vin, displayName: v.display_name,
      model: 'Model Y', state: v.state, inService: v.in_service, dataSource: 'mock',
    })));
  }
});

function decodeModel(vin) {
  const models = { S: 'Model S', '3': 'Model 3', X: 'Model X', Y: 'Model Y', R: 'Roadster', C: 'Cybertruck' };
  return models[vin.charAt(3)] || 'Tesla';
}

export default router;
