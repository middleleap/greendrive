import { Router } from 'express';
import { getPortfolioStats } from '../db.js';

const router = Router();

router.get('/api/portfolio-stats', (_req, res) => {
  try {
    const stats = getPortfolioStats();
    if (!stats) {
      return res.json({ connectedVehicles: 0, avgScore: 0, tierDistribution: [], vehicles: [] });
    }
    res.json(stats);
  } catch (err) {
    console.error('[Portfolio Stats]', err.message);
    res.status(500).json({ error: 'Failed to compute portfolio stats' });
  }
});

export default router;
