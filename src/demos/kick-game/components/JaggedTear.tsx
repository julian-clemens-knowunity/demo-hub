import React from 'react';
import Svg, { Path, G } from 'react-native-svg';
import { INK } from '../theme';

// Zigzag tear edge — used at the cut between the top + bottom of a torn
// punching bag. `inverted=true` flips it so the tear opens downward instead
// of upward.
type Props = { width: number; height?: number; inverted?: boolean };

export default function JaggedTear({ width, height = 28, inverted = false }: Props) {
  const teeth = 9;
  const step = width / teeth;
  const midY = height / 2;
  const points: string[] = [];
  for (let i = 0; i <= teeth; i++) {
    const x = i * step;
    const y = i % 2 === 0 ? midY - 9 : midY + 9;
    points.push(`${x} ${y}`);
  }
  const path = `M 0 ${height} L ${points.join(' L ')} L ${width} ${height} Z`;
  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={inverted ? { transform: [{ scaleY: -1 }] } : undefined}>
      <G>
        <Path d={path} fill={INK} stroke={INK} strokeWidth={2} strokeLinejoin="miter" />
      </G>
    </Svg>
  );
}
