import { useId } from 'react';
import Svg, { Rect, Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

interface Props {
  size?: number;
  color1?: string;
  color2?: string;
  color3?: string;
}

export function WTLogo({
  size = 56,
  color1 = '#16A085',
  color2 = '#1F3A5F',
  color3 = '#2ECC71',
}: Props) {
  const gid = `wt-${useId().replace(/:/g, '')}`;
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Defs>
        <LinearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor={color3} />
          <Stop offset="100%" stopColor={color2} />
        </LinearGradient>
      </Defs>
      {/* Wallet body */}
      <Rect
        x="6"
        y="20"
        width="52"
        height="36"
        rx="8"
        fill="none"
        stroke={`url(#${gid})`}
        strokeWidth="3"
      />
      {/* Coin pocket */}
      <Path
        d="M58 32h-8a4 4 0 0 0 0 8h8"
        fill="none"
        stroke={color2}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <Circle cx="51" cy="36" r="1.6" fill={color2} />
      {/* W stylized */}
      <Path
        d="M16 28 L22 46 L28 34 L34 46 L40 28"
        fill="none"
        stroke={color2}
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Heads */}
      <Circle cx="14" cy="14" r="3.5" fill={color3} />
      <Circle cx="32" cy="11" r="3.5" fill={color2} />
      <Circle cx="50" cy="14" r="3.5" stroke={color1} strokeWidth="1" fill="#3B82F6" />
      {/* Arms */}
      <Path
        d="M14 17 L20 22 M32 14 L32 20 M50 17 L44 22"
        stroke={color2}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
}
