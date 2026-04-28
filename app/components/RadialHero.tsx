import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';

interface Props {
  color?: string;
  width: number;
  height: number;
  top?: number;
}

export function RadialHero({ color = '#16A085', width, height, top = -120 }: Props) {
  return (
    <Svg
      width={width}
      height={height}
      style={{ position: 'absolute', top, left: 0 }}
      pointerEvents="none"
    >
      <Defs>
        <RadialGradient id="hero" cx="50%" cy="40%" rx="60%" ry="60%">
          <Stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <Stop offset="70%" stopColor={color} stopOpacity="0" />
        </RadialGradient>
      </Defs>
      <Rect width={width} height={height} fill="url(#hero)" />
    </Svg>
  );
}
