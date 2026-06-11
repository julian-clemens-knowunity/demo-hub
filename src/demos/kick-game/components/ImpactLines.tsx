import React from 'react';
import Svg, { Path, Circle, G } from 'react-native-svg';
import { INK } from '../theme';

const STROKE = 4;

// Small cluster of comic impact marks — hash lines + dots. Appears at the
// punch contact point for ~250ms.
type Props = { size?: number; flip?: boolean };

export default function ImpactLines({ size = 90, flip = false }: Props) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 90 90"
      style={flip ? { transform: [{ scaleX: -1 }] } : undefined}
    >
      <G>
        <Path d="M 12 18 L 36 30" stroke={INK} strokeWidth={STROKE} strokeLinecap="round" />
        <Path d="M 6 36 L 30 38" stroke={INK} strokeWidth={STROKE} strokeLinecap="round" />
        <Path d="M 10 56 L 34 48" stroke={INK} strokeWidth={STROKE} strokeLinecap="round" />
        <Path d="M 18 74 L 38 60" stroke={INK} strokeWidth={STROKE} strokeLinecap="round" />
        <Circle cx={50} cy={20} r={3} fill={INK} />
        <Circle cx={56} cy={40} r={2.5} fill={INK} />
        <Circle cx={52} cy={64} r={3} fill={INK} />
      </G>
    </Svg>
  );
}
