import { Router } from 'express';
import { getScoreHistory, getScoreStats } from '../db.js';

const router = Router();

/**
 * GET /api/score-history/:vin
 * Returns score snapshots for a VIN, newest first.
 * Query params:
 *   limit  — max records (default 90, max 365)
 *   period — "week" | "month" | "quarter" | "all" (convenience filters)
 */
router.get('/:vin', (req, res) => {
  const { vin } = req.params;
  if (!/^[A-HJ-NPR-Z0-9]{17}$/i.test(vin)) {
    return res.status(400).json({ error: 'Invalid VIN format' });
  }

  const periodLimits = { week: 7, month: 30, quarter: 90, all: 365 };
  const period = req.query.period || 'quarter';
  const limit = Math.min(
    parseInt(req.query.limit, 10) || periodLimits[period] || 90,
    365,
  );

  const history = getScoreHistory(vin, limit);
  const stats = getScoreStats(vin);

  // Compute trend (difference between average of last 7 vs previous 7)
  let trend = null;
  if (history.length >= 14) {
    const recent7 = history.slice(0, 7);
    const prev7 = history.slice(7, 14);
    const avgRecent = recent7.reduce((s, h) => s + h.totalScore, 0) / 7;
    const avgPrev = prev7.reduce((s, h) => s + h.totalScore, 0) / 7;
    trend = {
      direction: avgRecent > avgPrev ? 'up' : avgRecent < avgPrev ? 'down' : 'stable',
      delta: Math.round((avgRecent - avgPrev) * 10) / 10,
      recentAvg: Math.round(avgRecent * 10) / 10,
      previousAvg: Math.round(avgPrev * 10) / 10,
    };
  }

  res.json({
    vin,
    period,
    count: history.length,
    stats: {
      totalSnapshots: stats?.totalSnapshots || 0,
      lowestScore: stats?.lowestScore ?? null,
      highestScore: stats?.highestScore ?? null,
      avgScore: stats?.avgScore ?? null,
      firstRecorded: stats?.firstRecorded || null,
      lastRecorded: stats?.lastRecorded || null,
    },
    trend,
    history: history.reverse(), // return chronological (oldest first) for charts
  });
});

export default router;
