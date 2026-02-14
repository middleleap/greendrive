import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'greendrive.db');

// Ensure data directory exists
import { mkdirSync } from 'fs';
mkdirSync(path.dirname(DB_PATH), { recursive: true });

const db = new Database(DB_PATH);

// Performance pragmas
db.pragma('journal_mode = WAL');
db.pragma('busy_timeout = 5000');
db.pragma('foreign_keys = ON');

// ===== MIGRATIONS =====

db.exec(`
  CREATE TABLE IF NOT EXISTS score_snapshots (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    vin         TEXT    NOT NULL,
    total_score INTEGER NOT NULL,
    tier        TEXT    NOT NULL,
    rate_reduction REAL NOT NULL,
    breakdown   TEXT    NOT NULL,
    data_source TEXT    NOT NULL DEFAULT 'mock',
    computed_at TEXT    NOT NULL,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_snapshots_vin_date
    ON score_snapshots (vin, computed_at DESC);
`);

// ===== PREPARED STATEMENTS =====

const insertSnapshot = db.prepare(`
  INSERT INTO score_snapshots (vin, total_score, tier, rate_reduction, breakdown, data_source, computed_at)
  VALUES (@vin, @totalScore, @tier, @rateReduction, @breakdown, @dataSource, @computedAt)
`);

const selectHistory = db.prepare(`
  SELECT id, vin, total_score, tier, rate_reduction, breakdown, data_source, computed_at
  FROM score_snapshots
  WHERE vin = @vin
  ORDER BY computed_at DESC
  LIMIT @limit
`);

const selectLatest = db.prepare(`
  SELECT id, vin, total_score, tier, rate_reduction, breakdown, data_source, computed_at
  FROM score_snapshots
  WHERE vin = @vin
  ORDER BY computed_at DESC
  LIMIT 1
`);

const selectStats = db.prepare(`
  SELECT
    COUNT(*)        AS totalSnapshots,
    MIN(total_score) AS lowestScore,
    MAX(total_score) AS highestScore,
    ROUND(AVG(total_score), 1) AS avgScore,
    MIN(computed_at) AS firstRecorded,
    MAX(computed_at) AS lastRecorded
  FROM score_snapshots
  WHERE vin = @vin
`);

// ===== PUBLIC API =====

/**
 * Persist a score snapshot. Deduplicates — won't insert if the most recent
 * snapshot for this VIN has the same total_score and was recorded within
 * the last hour (prevents spam from page refreshes).
 */
export function saveScore(scoreResult, dataSource = 'mock') {
  const latest = selectLatest.get({ vin: scoreResult.vin });
  if (latest) {
    const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    if (latest.total_score === scoreResult.totalScore && latest.computed_at > hourAgo) {
      return latest.id;
    }
  }

  const result = insertSnapshot.run({
    vin: scoreResult.vin,
    totalScore: scoreResult.totalScore,
    tier: scoreResult.tier,
    rateReduction: scoreResult.rateReduction,
    breakdown: JSON.stringify(scoreResult.breakdown),
    dataSource,
    computedAt: scoreResult.computedAt,
  });

  return result.lastInsertRowid;
}

/**
 * Get score history for a VIN. Returns newest-first.
 */
export function getScoreHistory(vin, limit = 90) {
  const rows = selectHistory.all({ vin, limit });
  return rows.map((row) => ({
    id: row.id,
    vin: row.vin,
    totalScore: row.total_score,
    tier: row.tier,
    rateReduction: row.rate_reduction,
    breakdown: JSON.parse(row.breakdown),
    dataSource: row.data_source,
    computedAt: row.computed_at,
  }));
}

/**
 * Get summary statistics for a VIN's score history.
 */
export function getScoreStats(vin) {
  return selectStats.get({ vin });
}

/**
 * Seed historical data for demo/mock mode. Only seeds if the VIN
 * has no existing snapshots.
 */
export function seedIfEmpty(vin, mockScoreResult) {
  const existing = selectLatest.get({ vin });
  if (existing) return false;

  const now = new Date();
  const insert = db.transaction((entries) => {
    for (const entry of entries) {
      insertSnapshot.run(entry);
    }
  });

  // Generate 90 days of daily score history with realistic drift
  const entries = [];
  const baseScore = mockScoreResult.totalScore;

  for (let daysAgo = 89; daysAgo >= 0; daysAgo--) {
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);

    // Score trends upward over time with noise
    const progress = (89 - daysAgo) / 89; // 0 to 1
    const trendBoost = Math.floor(progress * 8); // gradual improvement up to 8 pts
    const noise = Math.floor(Math.random() * 5) - 2; // -2 to +2
    const dayScore = Math.max(0, Math.min(100, baseScore - 8 + trendBoost + noise));

    // Derive tier from score
    let tier, rateReduction;
    if (dayScore >= 85) {
      tier = 'Platinum Green';
      rateReduction = 0.5;
    } else if (dayScore >= 70) {
      tier = 'Gold Green';
      rateReduction = 0.4;
    } else if (dayScore >= 55) {
      tier = 'Silver Green';
      rateReduction = 0.25;
    } else if (dayScore >= 40) {
      tier = 'Bronze Green';
      rateReduction = 0.1;
    } else {
      tier = 'Standard';
      rateReduction = 0.0;
    }

    // Distribute score variance across breakdown categories proportionally
    const scoreDelta = dayScore - baseScore;
    const breakdown = JSON.parse(JSON.stringify(mockScoreResult.breakdown));
    // Apply delta mostly to battery health and charging behavior
    if (scoreDelta !== 0) {
      const batteryAdj = Math.round(scoreDelta * 0.4);
      const chargingAdj = Math.round(scoreDelta * 0.3);
      const efficiencyAdj = scoreDelta - batteryAdj - chargingAdj;
      breakdown.batteryHealth.score = Math.max(
        0,
        Math.min(breakdown.batteryHealth.max, breakdown.batteryHealth.score + batteryAdj),
      );
      breakdown.chargingBehavior.score = Math.max(
        0,
        Math.min(breakdown.chargingBehavior.max, breakdown.chargingBehavior.score + chargingAdj),
      );
      breakdown.efficiency.score = Math.max(
        0,
        Math.min(breakdown.efficiency.max, breakdown.efficiency.score + efficiencyAdj),
      );
    }

    entries.push({
      vin,
      totalScore: dayScore,
      tier,
      rateReduction,
      breakdown: JSON.stringify(breakdown),
      dataSource: 'mock',
      computedAt: date.toISOString(),
    });
  }

  insert(entries);
  return true;
}

export default db;
