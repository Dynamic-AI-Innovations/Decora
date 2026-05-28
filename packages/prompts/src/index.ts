/**
 * The Nigerian style-prompt library. This is the platform's IP (docs/BUILD.md §10 #7).
 *
 * Style additions are reviewed like code. Every entry must include:
 *   - mood (what the user feels)
 *   - palette (concrete colour direction)
 *   - materials (specific to Nigerian markets)
 *   - lighting (tropical, parlour-aware)
 *   - signature elements (the unmistakable ones)
 *   - negative prompt (what to keep OUT — usually Scandinavian/Western drift)
 *
 * These objects are stitched into the Stage 2 prompt by the AI service.
 */

import type { NigeriaStyle } from '@decora/shared-types';

export interface StyleProfile {
  id: NigeriaStyle;
  displayName: string;
  oneLiner: string;
  mood: string;
  palette: string;
  materials: string;
  lighting: string;
  signatureElements: string;
  negativePrompt: string;
}

export const STYLE_LIBRARY: Record<NigeriaStyle, StyleProfile> = {
  lagos_minimalist: {
    id: 'lagos_minimalist',
    displayName: 'Lagos Minimalist',
    oneLiner: 'Clean, cool, practical city living.',
    mood: 'calm, uncluttered, urban-grown, slightly luxe but never showy',
    palette: 'warm whites, terracotta accents, charcoal, soft brass',
    materials: 'matte porcelain tile, light oak veneer, brushed brass, raffia, linen',
    lighting: 'warm 2700K, recessed downlights + one statement pendant, soft daylight',
    signatureElements:
      'low-slung sectional, woven floor mat, single botanical, slim built-in TV niche',
    negativePrompt:
      'cluttered, Scandinavian birch, fluorescent lighting, Western suburban, generic IKEA, beige overload',
  },
  afro_contemporary: {
    id: 'afro_contemporary',
    displayName: 'Afro-Contemporary',
    oneLiner: 'African textiles, modern silhouettes, earth tones.',
    mood: 'rooted, warm, confident, contemporary craft',
    palette: 'terracotta, deep ochre, cocoa, indigo, ivory',
    materials:
      'handwoven cotton throws, mudcloth, rattan, carved hardwood, polished concrete, brass',
    lighting: 'warm afternoon glow, rattan pendant, layered table lamps',
    signatureElements:
      'L-shaped sectional in textured fabric, Ankara cushion mix, woven side stool, framed Yoruba textile, large fiddle-leaf or croton plant',
    negativePrompt:
      'tribal-kitsch, costume-y, Western "boho", grey-on-grey, Scandinavian minimalism, generic prints',
  },
  abuja_executive: {
    id: 'abuja_executive',
    displayName: 'Abuja Executive',
    oneLiner: 'Bold, formal, high-end. Marble and leather.',
    mood: 'commanding, formal, well-appointed, conservative luxury',
    palette: 'cream, deep walnut, black, antique gold, burgundy accents',
    materials: 'Italian marble flooring, leather upholstery, walnut veneer, brass and gold trim',
    lighting: 'large crystal or sculptural chandelier, recessed cove lighting',
    signatureElements:
      'tufted leather sofa, marble coffee table, formal armchairs in pairs, framed art with brass frames',
    negativePrompt: 'casual, bohemian, distressed, Scandinavian, minimalist, beachy',
  },
  yoruba_heritage: {
    id: 'yoruba_heritage',
    displayName: 'Yoruba Heritage',
    oneLiner: 'Wood carvings, warm earth tones, batik patterns.',
    mood: 'rooted, generous, dignified, ancestral',
    palette: 'indigo, ochre, terracotta, rich brown, ivory',
    materials: 'carved Iroko wood, adire batik textiles, woven raffia, brass, terracotta tile',
    lighting: 'warm low lamps, candlelit feel, single carved-wood pendant',
    signatureElements:
      'low carved-wood seating, adire wall hanging, calabash decor, indigo cushions, ceremonial stool as side table',
    negativePrompt: 'European antique, theme-park African, modernist white, Scandinavian wood',
  },
  diaspora_returnee: {
    id: 'diaspora_returnee',
    displayName: 'Diaspora Returnee',
    oneLiner: 'Western-inspired but warm, Nigerian-souled.',
    mood: 'familiar to NYC/London tastes but unmistakably Nigerian-warm',
    palette: 'warm white, walnut, sage, terracotta accents, brass',
    materials: 'engineered hardwood, bouclé and linen, walnut, brass hardware, ceramic',
    lighting: 'warm dimmable LED, layered floor + table lamps, statement pendant',
    signatureElements:
      'curved sectional, mix of African and mid-century pieces, gallery wall mixing family photos and African art, large rug',
    negativePrompt: 'cold modernism, hospital lighting, all-grey palette, sterile, IKEA showroom',
  },
  tropical_luxe: {
    id: 'tropical_luxe',
    displayName: 'Tropical Luxe',
    oneLiner: 'Rattan, palms, neutrals, open-air feel.',
    mood: 'breezy, vacation-at-home, ceiling-fan-friendly',
    palette: 'ivory, sand, sage, deep green, natural wood',
    materials: 'rattan, cane, light wood, linen, terrazzo, woven sisal',
    lighting: 'natural daylight, rattan pendants, soft warm evening lamps',
    signatureElements:
      'rattan armchair, large potted palm/monstera, linen-slipcovered sofa, ceiling fan, sheer curtains',
    negativePrompt: 'cold, formal, marble-heavy, dark walnut, fluorescent, cluttered',
  },
  old_naija_comfort: {
    id: 'old_naija_comfort',
    displayName: 'Old Naija Comfort',
    oneLiner: 'Classic Nigerian parlour, plush and dignified.',
    mood: 'familiar, generous, formal-but-warm, parlour-pride',
    palette: 'rich cream, deep red, burgundy, mahogany, gold',
    materials: 'velvet and damask upholstery, mahogany, brass, lace, glass',
    lighting: 'ornate chandelier, table lamps with patterned shades',
    signatureElements:
      '7-seater plush sofa set, large centre table, lace doily detail done tastefully, ornate framed family portraits, glass display cabinet',
    negativePrompt:
      'minimalist, Scandinavian, IKEA, industrial loft, all-white, cold modernism',
  },
  modern_ph: {
    id: 'modern_ph',
    displayName: 'Modern PH',
    oneLiner: 'Coastal Port Harcourt — breezy, polished, lighter palette.',
    mood: 'quietly polished, coastal-aware, restrained-luxe',
    palette: 'soft white, sea-foam, sand, navy accent, warm wood',
    materials: 'light oak, woven jute, linen, polished concrete, brass',
    lighting: 'natural light dominant, layered warm lamps for evening',
    signatureElements:
      'modular sectional, woven jute rug, single bold artwork, indoor plants, ceiling fan',
    negativePrompt: 'heavy formal, marble-overload, Scandinavian birch, dark/moody, cluttered',
  },
};

export function styleProfile(style: NigeriaStyle): StyleProfile {
  return STYLE_LIBRARY[style];
}

export const NIGERIA_SYSTEM_CONTEXT = `You are designing interiors for Nigerian homes. Honour these realities:
- Rooms are described as parlour, bedroom, dining, kitchen, BQ. The parlour is the heart of the home.
- Tropical light is golden and directional. Avoid cold blue-white renders.
- Materials should be findable in Lagos/Abuja/PH markets — Iroko wood, terrazzo, rattan, adire, Ankara, brass, locally-made upholstery.
- Generators, inverters, and overhead water tanks are part of Nigerian life; do not render them prominently but allow space for them.
- Avoid Western suburban defaults: no IKEA showrooms, no Scandinavian birch overload, no cold grey-on-grey palettes.
- Naira budgets are sacred. Match the visible item quality to the user's stated tier (entry / mid / premium).`;
