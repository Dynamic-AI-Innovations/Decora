import { z } from 'zod';

export const NigeriaStyle = z.enum([
  'lagos_minimalist',
  'afro_contemporary',
  'abuja_executive',
  'yoruba_heritage',
  'diaspora_returnee',
  'tropical_luxe',
  'old_naija_comfort',
  'modern_ph',
]);
export type NigeriaStyle = z.infer<typeof NigeriaStyle>;

export const Plan = z.enum(['free', 'home', 'family', 'elite', 'signature']);
export type Plan = z.infer<typeof Plan>;

export const City = z.enum(['lagos', 'abuja', 'ph', 'other']);
export type City = z.infer<typeof City>;

export const HomeType = z.enum(['apartment', 'duplex', 'bungalow', 'compound', 'other']);
export type HomeType = z.infer<typeof HomeType>;

export const RenderStatus = z.enum([
  'queued',
  'analyzing',
  'generating',
  'scoring',
  'done',
  'failed',
]);
export type RenderStatus = z.infer<typeof RenderStatus>;

export const RenderRequestIn = z.object({
  projectId: z.string().uuid(),
  sourceImageUrl: z.string().url(),
  style: NigeriaStyle,
  budgetNgn: z.number().int().min(50_000).max(200_000_000),
});
export type RenderRequestIn = z.infer<typeof RenderRequestIn>;

export const RenderRequestOut = z.object({
  renderRequestId: z.string().uuid(),
  status: RenderStatus,
});
export type RenderRequestOut = z.infer<typeof RenderRequestOut>;

export const RoomAnalysis = z.object({
  roomType: z.string(),
  widthM: z.number().nullable(),
  lengthM: z.number().nullable(),
  heightM: z.number().nullable(),
  furniture: z.array(z.string()),
  lighting: z.string().nullable(),
  wallFinish: z.string().nullable(),
  floorFinish: z.string().nullable(),
  openings: z.array(z.string()),
});
export type RoomAnalysis = z.infer<typeof RoomAnalysis>;

export const RenderVariant = z.object({
  variantIndex: z.number().int().min(0).max(2),
  imageUrl: z.string().url(),
  seed: z.number().int(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});
export type RenderVariant = z.infer<typeof RenderVariant>;

export const BudgetItem = z.object({
  itemName: z.string(),
  category: z.string(),
  priceMinNgn: z.number().int().nonnegative(),
  priceMidNgn: z.number().int().nonnegative(),
  priceMaxNgn: z.number().int().nonnegative(),
  affiliateUrl: z.string().url().nullable(),
  affiliatePlatform: z.enum(['jumia', 'konga', 'vendor_direct']).nullable(),
});
export type BudgetItem = z.infer<typeof BudgetItem>;

export const BudgetBreakdown = z.object({
  items: z.array(BudgetItem),
  totalMinNgn: z.number().int().nonnegative(),
  totalMidNgn: z.number().int().nonnegative(),
  totalMaxNgn: z.number().int().nonnegative(),
  overBudget: z.boolean(),
  downgradeSuggestions: z.array(z.string()),
});
export type BudgetBreakdown = z.infer<typeof BudgetBreakdown>;
