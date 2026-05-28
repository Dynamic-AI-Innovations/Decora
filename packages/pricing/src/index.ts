/**
 * Naira formatting and pricing helpers.
 *
 * RULE (docs/BUILD.md §10 #3): never inline `₦${n}`. Always use formatNaira.
 */

const naira = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  maximumFractionDigits: 0,
});

const nairaCompact = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  notation: 'compact',
  maximumFractionDigits: 1,
});

export function formatNaira(amount: number): string {
  return naira.format(amount);
}

export function formatNairaCompact(amount: number): string {
  // ₦1.2M, ₦850K, etc.
  return nairaCompact.format(amount);
}

export function formatNairaRange(min: number, max: number): string {
  if (min === max) return formatNaira(min);
  return `${formatNaira(min)} – ${formatNaira(max)}`;
}

export type PriceTier = 'entry' | 'mid' | 'premium';

export function tierFromBudget(budgetNgn: number, perItemFactor = 10): PriceTier {
  // Rough heuristic — refined as price_catalogue matures.
  const perItem = budgetNgn / perItemFactor;
  if (perItem < 50_000) return 'entry';
  if (perItem < 250_000) return 'mid';
  return 'premium';
}

export const FOUNDING_USER_CAP = 1000;
export const FOUNDING_LOCK_UNTIL = new Date('2027-10-01T00:00:00Z');
