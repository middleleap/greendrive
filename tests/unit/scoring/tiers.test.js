import { describe, it, expect } from 'vitest';
import { TIERS, getTier } from '../../../server/scoring/tiers.js';

// ---------------------------------------------------------------------------
// TIERS constant validation
// ---------------------------------------------------------------------------
describe('TIERS constant', () => {
  it('has 5 tiers', () => {
    expect(TIERS).toHaveLength(5);
  });

  it('covers full 0–100 range without gaps', () => {
    const sorted = [...TIERS].sort((a, b) => a.minScore - b.minScore);
    expect(sorted[0].minScore).toBe(0);
    expect(sorted[sorted.length - 1].maxScore).toBe(100);

    for (let i = 1; i < sorted.length; i++) {
      expect(sorted[i].minScore).toBe(sorted[i - 1].maxScore + 1);
    }
  });

  it('each tier has required properties', () => {
    for (const tier of TIERS) {
      expect(tier).toHaveProperty('name');
      expect(tier).toHaveProperty('minScore');
      expect(tier).toHaveProperty('maxScore');
      expect(tier).toHaveProperty('rateReduction');
      expect(tier).toHaveProperty('color');
      expect(typeof tier.rateReduction).toBe('number');
    }
  });

  it('rate reductions increase with higher tiers', () => {
    const sorted = [...TIERS].sort((a, b) => a.minScore - b.minScore);
    for (let i = 1; i < sorted.length; i++) {
      expect(sorted[i].rateReduction).toBeGreaterThanOrEqual(sorted[i - 1].rateReduction);
    }
  });
});

// ---------------------------------------------------------------------------
// getTier — boundary values
// ---------------------------------------------------------------------------
describe('getTier', () => {
  it('score 0 → Standard', () => {
    expect(getTier(0).name).toBe('Standard');
  });

  it('score 39 → Standard (upper boundary)', () => {
    expect(getTier(39).name).toBe('Standard');
  });

  it('score 40 → Bronze Green (lower boundary)', () => {
    expect(getTier(40).name).toBe('Bronze Green');
  });

  it('score 54 → Bronze Green (upper boundary)', () => {
    expect(getTier(54).name).toBe('Bronze Green');
  });

  it('score 55 → Silver Green (lower boundary)', () => {
    expect(getTier(55).name).toBe('Silver Green');
  });

  it('score 69 → Silver Green (upper boundary)', () => {
    expect(getTier(69).name).toBe('Silver Green');
  });

  it('score 70 → Gold Green (lower boundary)', () => {
    expect(getTier(70).name).toBe('Gold Green');
  });

  it('score 84 → Gold Green (upper boundary)', () => {
    expect(getTier(84).name).toBe('Gold Green');
  });

  it('score 85 → Platinum Green (lower boundary)', () => {
    expect(getTier(85).name).toBe('Platinum Green');
  });

  it('score 100 → Platinum Green (upper boundary)', () => {
    expect(getTier(100).name).toBe('Platinum Green');
  });

  // Rate reduction spot checks
  it('Standard tier has 0% rate reduction', () => {
    expect(getTier(20).rateReduction).toBe(0.0);
  });

  it('Platinum Green tier has 0.5% rate reduction', () => {
    expect(getTier(90).rateReduction).toBe(0.5);
  });

  // Edge case: score outside range falls back to last tier
  it('negative score falls back to Standard', () => {
    const tier = getTier(-1);
    expect(tier.name).toBe('Standard');
  });
});
