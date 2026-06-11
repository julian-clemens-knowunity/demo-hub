import React from 'react';
import Svg, { Circle, Ellipse, Path, G } from 'react-native-svg';
import { INK } from '../theme';

const STROKE = 4.5;
const RIND = '#2EAF55';
const RIND_DARK = '#1F7B3D';
const FLESH = '#F25B7A';
const FLESH_LIGHT = '#FF8DA6';
const SEED = '#2A2A36';

export function Watermelon({ size = 180 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 180 180">
      <G>
        <Circle cx={90} cy={90} r={80} fill={RIND} stroke={INK} strokeWidth={STROKE} />
        <Path d="M 22 78 Q 90 60 158 78" fill="none" stroke={RIND_DARK} strokeWidth={8} opacity={0.7} />
        <Path d="M 18 102 Q 90 116 162 102" fill="none" stroke={RIND_DARK} strokeWidth={8} opacity={0.7} />
        <Path d="M 32 56 Q 90 80 148 56" fill="none" stroke="#5BCB78" strokeWidth={5} opacity={0.6} />
        <Ellipse cx={70} cy={56} rx={20} ry={8} fill="#FFFFFF" opacity={0.18} />
      </G>
    </Svg>
  );
}

export function WatermelonSlice({ size = 90, flip = false }: { size?: number; flip?: boolean }) {
  return (
    <Svg width={size} height={size * 0.65} viewBox="0 0 180 120" style={flip ? { transform: [{ scaleX: -1 }] } : undefined}>
      <G>
        <Path d="M 10 100 Q 90 -20 170 100 Z" fill={RIND} stroke={INK} strokeWidth={STROKE} strokeLinejoin="round" />
        <Path d="M 26 96 Q 90 0 154 96 Z" fill={FLESH} stroke={INK} strokeWidth={3} />
        <Path d="M 40 92 Q 90 24 140 92" fill="none" stroke={FLESH_LIGHT} strokeWidth={3} opacity={0.7} />
        <Ellipse cx={70} cy={70} rx={4} ry={6} fill={SEED} />
        <Ellipse cx={100} cy={62} rx={4} ry={6} fill={SEED} />
        <Ellipse cx={86} cy={84} rx={4} ry={6} fill={SEED} />
        <Ellipse cx={112} cy={82} rx={4} ry={6} fill={SEED} />
        <Ellipse cx={56} cy={88} rx={4} ry={6} fill={SEED} />
      </G>
    </Svg>
  );
}
