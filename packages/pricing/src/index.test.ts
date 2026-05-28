import { describe, expect, it } from 'vitest';
import { formatNaira, formatNairaCompact, formatNairaRange, tierFromBudget } from './index';

describe('formatNaira', () => {
  it('formats whole Naira amounts with NGN symbol', () => {
    expect(formatNaira(15000)).toMatch(/15,000/);
  });
});

describe('formatNairaCompact', () => {
  it('returns a compact representation for large amounts', () => {
    expect(formatNairaCompact(1_500_000)).toMatch(/1\.5M/);
  });
});

describe('formatNairaRange', () => {
  it('collapses identical bounds', () => {
    expect(formatNairaRange(100, 100)).toBe(formatNaira(100));
  });

  it('renders a dash-separated range otherwise', () => {
    expect(formatNairaRange(100, 250)).toContain('–');
  });
});

describe('tierFromBudget', () => {
  it('classifies entry, mid, and premium', () => {
    expect(tierFromBudget(200_000)).toBe('entry');
    expect(tierFromBudget(1_500_000)).toBe('mid');
    expect(tierFromBudget(10_000_000)).toBe('premium');
  });
});
