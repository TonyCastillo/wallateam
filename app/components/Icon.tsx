import { ComponentType } from 'react';
import * as Lucide from 'lucide-react-native';

export type IconName = keyof typeof Lucide;

interface Props {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export function Icon({ name, size = 22, color = 'currentColor', strokeWidth = 1.8 }: Props) {
  const Cmp = Lucide[name] as ComponentType<{
    size?: number;
    color?: string;
    strokeWidth?: number;
  }>;
  if (!Cmp) return null;
  return <Cmp size={size} color={color} strokeWidth={strokeWidth} />;
}
