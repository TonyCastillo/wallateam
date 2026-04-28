import { TextStyle } from 'react-native';
import { typography } from './tokens';

export type Weight = 'regular' | 'medium' | 'semibold' | 'bold';

export function fontFamily(weight: Weight = 'regular'): string {
  return typography.fontFamily[weight];
}

export const text: Record<Weight, TextStyle> = {
  regular:  { fontFamily: typography.fontFamily.regular },
  medium:   { fontFamily: typography.fontFamily.medium },
  semibold: { fontFamily: typography.fontFamily.semibold },
  bold:     { fontFamily: typography.fontFamily.bold },
};
