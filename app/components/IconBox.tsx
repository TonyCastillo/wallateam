import { View } from 'react-native';
import { Icon, IconName } from './Icon';

interface IconBoxProps {
  iconName: IconName;
  color: string;
  size?: number;
  bgOpacity?: number;
}

export function withAlpha(hex: string, alpha: number) {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.substring(1, 3), 16);
    g = parseInt(hex.substring(3, 5), 16);
    b = parseInt(hex.substring(5, 7), 16);
  }
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function IconBox({ iconName, color, size = 44, bgOpacity = 0.15 }: IconBoxProps) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: 12,
        backgroundColor: withAlpha(color, bgOpacity),
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Icon name={iconName} color={color} size={size * 0.5} strokeWidth={2} />
    </View>
  );
}
