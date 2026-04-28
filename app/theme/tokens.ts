export const colors = {
  primary:        '#16A085',
  primaryDark:    '#138D75',
  secondary:      '#1F3A5F',
  accent:         '#2ECC71',
  background:     '#FFFFFF',
  surface:        '#F8F9FA',
  surfaceAlt:     '#F1F4F6',
  textPrimary:    '#2C3E50',
  textSecondary:  '#7F8C8D',
  border:         '#E5E7EB',
  danger:         '#E74C3C',
  warning:        '#F39C12',
  success:        '#2ECC71',
  chipBg:         'rgba(22,160,133,0.10)',
  chipBgBlue:     'rgba(31,58,95,0.08)',
} as const;

export const colorsDark = {
  primary:        '#16A085',
  primaryDark:    '#138D75',
  secondary:      '#5DA9E9',
  accent:         '#2ECC71',
  background:     '#0E1B2C',
  surface:        '#15263C',
  surfaceAlt:     '#1B2E47',
  textPrimary:    '#ECF0F1',
  textSecondary:  '#9AA8B6',
  border:         '#243B58',
  danger:         '#FF6B5B',
  warning:        '#F39C12',
  success:        '#2ECC71',
  chipBg:         'rgba(46,204,113,0.14)',
  chipBgBlue:     'rgba(93,169,233,0.16)',
} as const;

export type Colors = { readonly [K in keyof typeof colors]: string };

export const typography = {
  fontFamily: {
    regular:  'Inter_400Regular',
    medium:   'Inter_500Medium',
    semibold: 'Inter_600SemiBold',
    bold:     'Inter_700Bold',
  },
  fontSize: {
    xs: 12, sm: 14, base: 16, lg: 18, xl: 22, '2xl': 28, '3xl': 36,
  },
  lineHeight: { sm: 18, base: 22, lg: 26 },
} as const;

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 } as const;

export const radius = { sm: 6, md: 10, lg: 16, xl: 24, full: 9999 } as const;

export const shadows = {
  card: {
    shadowColor: '#1F3A5F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHi: {
    shadowColor: '#1F3A5F',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  ctaPrimary: {
    shadowColor: '#16A085',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.30,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;

export const gradients = {
  ctaPrimary: ['#16A085', '#1F3A5F'] as const,
} as const;
