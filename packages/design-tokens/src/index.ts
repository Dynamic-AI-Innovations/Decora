/**
 * Decora design tokens. The single source of truth for colour, type,
 * spacing, radius, and shadow — consumed by both web (Tailwind) and
 * mobile (NativeWind). Owned by the product-design agent.
 *
 * Palette draws on Nigerian warmth — terracotta, indigo, brass — over
 * cool greys. Avoid Western/Scandinavian off-whites.
 */

export const tokens = {
  colors: {
    background: '#0F0F0F',
    surface: '#1A1A1A',
    surfaceElevated: '#242424',
    foreground: '#F8F5F0',
    muted: '#9B9B9B',
    mutedSoft: '#C9C2B8',

    brand: {
      DEFAULT: '#C8542A', // terracotta
      soft: '#E8A689',
      deep: '#8A3517',
    },
    accent: {
      DEFAULT: '#2D4A8A', // indigo
      soft: '#7B95C7',
      deep: '#1A2D55',
    },
    gold: {
      DEFAULT: '#C9A24B',
      soft: '#E5C988',
    },

    success: '#2F8F5F',
    warning: '#D4A02D',
    danger: '#C13B3B',
  },
  fontFamily: {
    sans: ['"InterVariable"', 'Inter', 'system-ui', 'sans-serif'],
    display: ['"Fraunces"', 'Georgia', 'serif'],
    mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
  },
  fontSize: {
    xs: ['12px', { lineHeight: '16px' }],
    sm: ['14px', { lineHeight: '20px' }],
    base: ['16px', { lineHeight: '24px' }],
    lg: ['18px', { lineHeight: '28px' }],
    xl: ['20px', { lineHeight: '28px' }],
    '2xl': ['24px', { lineHeight: '32px' }],
    '3xl': ['30px', { lineHeight: '36px' }],
    '4xl': ['36px', { lineHeight: '40px' }],
    '5xl': ['48px', { lineHeight: '52px' }],
  },
  spacing: {
    px: '1px',
    0: '0',
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    8: '32px',
    10: '40px',
    12: '48px',
    16: '64px',
    20: '80px',
    24: '96px',
  },
  borderRadius: {
    none: '0',
    sm: '4px',
    DEFAULT: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    '2xl': '32px',
    full: '9999px',
  },
  boxShadow: {
    sm: '0 1px 2px 0 rgba(0,0,0,0.08)',
    DEFAULT: '0 4px 12px 0 rgba(0,0,0,0.12)',
    lg: '0 12px 32px 0 rgba(0,0,0,0.18)',
  },
  motion: {
    durationFast: 120,
    durationBase: 200,
    durationSlow: 360,
    easingStandard: 'cubic-bezier(0.2, 0, 0, 1)',
    easingEmphasized: 'cubic-bezier(0.3, 0, 0, 1)',
  },
} as const;

export type Tokens = typeof tokens;
