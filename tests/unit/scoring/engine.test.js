import { describe, it, expect } from 'vitest';
import { computeGreenScore } from '../../../server/scoring/engine.js';

// ---------------------------------------------------------------------------
// Helper — build minimal vehicleData with sensible defaults
// ---------------------------------------------------------------------------
function makeVehicle(overrides = {}) {
  return {
    vin: overrides.vin || '5YJ3E1EA1NF000001', // Model 3, char[3]='3'
    charge_state: {
      battery_level: 80,
      battery_range: 250,
      fast_charger_type: '<invalid>',
      charging_state: 'Charging',
      ...overrides.charge_state,
    },
    vehicle_state: {
      odometer: 10000, // miles
      car_version: '2025.2.6 abc123',
      ...overrides.vehicle_state,
    },
  };
}

// ---------------------------------------------------------------------------
// computeGreenScore — shape & invariants
// ---------------------------------------------------------------------------
describe('computeGreenScore', () => {
  it('returns all required fields', () => {
    const result = computeGreenScore(makeVehicle());
    expect(result).toHaveProperty('vin');
    expect(result).toHaveProperty('totalScore');
    expect(result).toHaveProperty('maxPossible', 100);
    expect(result).toHaveProperty('tier');
    expect(result).toHaveProperty('tierColor');
    expect(result).toHaveProperty('rateReduction');
    expect(result).toHaveProperty('breakdown');
    expect(result).toHaveProperty('suggestions');
    expect(result).toHaveProperty('computedAt');
  });

  it('totalScore equals sum of breakdown scores', () => {
    const result = computeGreenScore(makeVehicle());
    const breakdownSum = Object.values(result.breakdown).reduce((s, b) => s + b.score, 0);
    expect(result.totalScore).toBe(breakdownSum);
  });

  it('totalScore is between 0 and 100', () => {
    const result = computeGreenScore(makeVehicle());
    expect(result.totalScore).toBeGreaterThanOrEqual(0);
    expect(result.totalScore).toBeLessThanOrEqual(100);
  });

  it('breakdown categories each have score, detail, and max', () => {
    const result = computeGreenScore(makeVehicle());
    for (const [, cat] of Object.entries(result.breakdown)) {
      expect(cat).toHaveProperty('score');
      expect(cat).toHaveProperty('detail');
      expect(cat).toHaveProperty('max');
      expect(cat.score).toBeGreaterThanOrEqual(0);
      expect(cat.score).toBeLessThanOrEqual(cat.max);
    }
  });
});

// ---------------------------------------------------------------------------
// VIN → model decoding
// ---------------------------------------------------------------------------
describe('VIN model decoding', () => {
  const models = [
    { vin: '5YJSA1E40GF000001', expected: 'Model S' },
    { vin: '5YJ3E1EA1NF000001', expected: 'Model 3' },
    { vin: '5YJXCBE22GF000001', expected: 'Model X' },
    { vin: '5YJYGDEE0MF000001', expected: 'Model Y' },
    { vin: '5YJRE1EA5AF000001', expected: 'Roadster' },
    { vin: '7G2CBFEE0PF000001', expected: 'Cybertruck' },
  ];

  models.forEach(({ vin, expected }) => {
    it(`${vin} → ${expected}`, () => {
      const result = computeGreenScore(makeVehicle({ vin }));
      expect(result.model).toBe(expected);
    });
  });
});

// Helper to extract a single category score
function categoryScore(category, vehicleOverrides = {}) {
  const result = computeGreenScore(makeVehicle(vehicleOverrides));
  return result.breakdown[category].score;
}

// ---------------------------------------------------------------------------
// Battery Health scoring
// ---------------------------------------------------------------------------
describe('Battery Health scoring', () => {
  it('scores up to max 20', () => {
    // Perfect battery: 100% range retained (battery_range/battery_level*100 >= epaRange)
    const score = categoryScore('batteryHealth', {
      charge_state: {
        battery_level: 50,
        battery_range: 179,
        fast_charger_type: '',
        charging_state: 'Charging',
      },
    });
    expect(score).toBeLessThanOrEqual(20);
    expect(score).toBeGreaterThan(0);
  });

  it('returns 10 with insufficient data', () => {
    const score = categoryScore('batteryHealth', {
      charge_state: {
        battery_level: 0,
        battery_range: 0,
        fast_charger_type: '',
        charging_state: '',
      },
    });
    expect(score).toBe(10);
  });
});

// ---------------------------------------------------------------------------
// Charging Behavior scoring
// ---------------------------------------------------------------------------
describe('Charging Behavior scoring', () => {
  it('home/wall connector (<invalid>) scores 22', () => {
    const score = categoryScore('chargingBehavior', {
      charge_state: {
        fast_charger_type: '<invalid>',
        charging_state: 'Charging',
        battery_level: 80,
        battery_range: 250,
      },
    });
    expect(score).toBe(22);
  });

  it('home/wall connector (empty string) scores 22', () => {
    const score = categoryScore('chargingBehavior', {
      charge_state: {
        fast_charger_type: '',
        charging_state: 'Charging',
        battery_level: 80,
        battery_range: 250,
      },
    });
    expect(score).toBe(22);
  });

  it('mobile connector scores 20', () => {
    const score = categoryScore('chargingBehavior', {
      charge_state: {
        fast_charger_type: 'MCSingleWireCAN',
        charging_state: 'Charging',
        battery_level: 80,
        battery_range: 250,
      },
    });
    expect(score).toBe(20);
  });

  it('CCS DC fast charger scores 12', () => {
    const score = categoryScore('chargingBehavior', {
      charge_state: {
        fast_charger_type: 'CCS',
        charging_state: 'Charging',
        battery_level: 80,
        battery_range: 250,
      },
    });
    expect(score).toBe(12);
  });

  it('CHAdeMO scores 12', () => {
    const score = categoryScore('chargingBehavior', {
      charge_state: {
        fast_charger_type: 'CHAdeMO',
        charging_state: 'Charging',
        battery_level: 80,
        battery_range: 250,
      },
    });
    expect(score).toBe(12);
  });

  it('supercharger scores 10', () => {
    const score = categoryScore('chargingBehavior', {
      charge_state: {
        fast_charger_type: 'Tesla',
        charging_state: 'Charging',
        battery_level: 80,
        battery_range: 250,
      },
    });
    expect(score).toBe(10);
  });

  it('disconnected with empty charger scores 15', () => {
    const score = categoryScore('chargingBehavior', {
      charge_state: {
        fast_charger_type: '',
        charging_state: 'Disconnected',
        battery_level: 80,
        battery_range: 250,
      },
    });
    expect(score).toBe(15);
  });
});

// ---------------------------------------------------------------------------
// Efficiency (odometer) scoring
// ---------------------------------------------------------------------------
describe('Efficiency scoring', () => {
  // odometer values are in miles, converted to km (* 1.60934)
  const cases = [
    { miles: 1000, expectedScore: 10, label: '<5k km — low usage' },
    { miles: 5000, expectedScore: 13, label: '5-10k km — light usage' },
    { miles: 8000, expectedScore: 15, label: '10-15k km — moderate usage' },
    { miles: 10000, expectedScore: 20, label: '15-20k km — active (sweet spot)' },
    { miles: 15000, expectedScore: 13, label: '20-30k km — high usage' },
    { miles: 20000, expectedScore: 8, label: '30k+ km — very high usage' },
  ];

  cases.forEach(({ miles, expectedScore, label }) => {
    it(`${miles} miles → ${label} → ${expectedScore}pts`, () => {
      const score = categoryScore('efficiency', {
        vehicle_state: { odometer: miles, car_version: '2025.2.6 abc123' },
      });
      expect(score).toBe(expectedScore);
    });
  });
});

// ---------------------------------------------------------------------------
// EV Ownership scoring
// ---------------------------------------------------------------------------
describe('EV Ownership scoring', () => {
  it('known Tesla model scores 15', () => {
    const score = categoryScore('evOwnership');
    expect(score).toBe(15);
  });

  it('unknown model code scores 10', () => {
    const result = computeGreenScore(makeVehicle({ vin: '5YJ0E1EA1NF000001' }));
    expect(result.breakdown.evOwnership.score).toBe(10);
  });
});

// ---------------------------------------------------------------------------
// Vehicle Condition scoring (software version year)
// ---------------------------------------------------------------------------
describe('Vehicle Condition scoring', () => {
  const cases = [
    { version: '2026.1.0 abc', expectedScore: 10, label: '2026+ latest' },
    { version: '2025.2.6 abc', expectedScore: 8, label: '2025 up to date' },
    { version: '2024.44.3 abc', expectedScore: 6, label: '2024 recent' },
    { version: '2023.12.1 abc', expectedScore: 4, label: '<2024 outdated' },
  ];

  cases.forEach(({ version, expectedScore, label }) => {
    it(`${version} → ${label} → ${expectedScore}pts`, () => {
      const score = categoryScore('vehicleCondition', {
        vehicle_state: { car_version: version, odometer: 10000 },
      });
      expect(score).toBe(expectedScore);
    });
  });
});

// ---------------------------------------------------------------------------
// Renewable Energy — always 0 (placeholder)
// ---------------------------------------------------------------------------
describe('Renewable Energy scoring', () => {
  it('always scores 0', () => {
    const score = categoryScore('renewableEnergy');
    expect(score).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// Suggestions
// ---------------------------------------------------------------------------
describe('Suggestions', () => {
  it('always includes DEWA suggestion (renewable energy is 0)', () => {
    const result = computeGreenScore(makeVehicle());
    const dewaSuggestion = result.suggestions.find((s) => s.action.includes('DEWA'));
    expect(dewaSuggestion).toBeDefined();
  });

  it('suggests software update when vehicleCondition < 8', () => {
    const result = computeGreenScore(
      makeVehicle({ vehicle_state: { car_version: '2023.1.0 abc', odometer: 10000 } }),
    );
    const swSuggestion = result.suggestions.find((s) => s.action.includes('software'));
    expect(swSuggestion).toBeDefined();
  });
});
