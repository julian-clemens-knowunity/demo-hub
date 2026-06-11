import React from 'react';
import Svg, { Circle, Ellipse, Line, Path, Rect, G } from 'react-native-svg';
import { INK } from '../theme';

const STROKE = 4.5;
const BULB = '#FFE066';
const BULB_BRIGHT = '#FFF4B0';
const BASE = '#9CA3B0';
const BASE_DARK = '#5D6573';

export default function Lightbulb({ size = 180 }: { size?: number }) {
  return (
    <Svg width={size} height={size * 1.3} viewBox="0 0 180 234">
      <G>
        {/* shine rays */}
        <Line x1={90} y1={2} x2={90} y2={16} stroke={INK} strokeWidth={3.5} strokeLinecap="round" opacity={0.7} />
        <Line x1={30} y1={26} x2={42} y2={36} stroke={INK} strokeWidth={3.5} strokeLinecap="round" opacity={0.7} />
        <Line x1={150} y1={26} x2={138} y2={36} stroke={INK} strokeWidth={3.5} strokeLinecap="round" opacity={0.7} />
        <Line x1={8} y1={86} x2={22} y2={88} stroke={INK} strokeWidth={3.5} strokeLinecap="round" opacity={0.7} />
        <Line x1={172} y1={86} x2={158} y2={88} stroke={INK} strokeWidth={3.5} strokeLinecap="round" opacity={0.7} />

        {/* glass bulb */}
        <Path d="M 90 22 Q 24 30 32 110 Q 36 142 56 156 L 56 176 L 124 176 L 124 156 Q 144 142 148 110 Q 156 30 90 22 Z" fill={BULB} stroke={INK} strokeWidth={STROKE} strokeLinejoin="round" />
        {/* inner shine */}
        <Ellipse cx={66} cy={70} rx={14} ry={26} fill={BULB_BRIGHT} opacity={0.7} />
        {/* filament */}
        <Path d="M 76 110 L 80 124 L 84 110 L 88 124 L 92 110 L 96 124 L 100 110 L 104 124" fill="none" stroke="#FF9E2C" strokeWidth={3.5} strokeLinecap="round" />
        <Line x1={70} y1={108} x2={110} y2={108} stroke={INK} strokeWidth={3} />

        {/* metal base */}
        <Rect x={56} y={176} width={68} height={16} fill={BASE} stroke={INK} strokeWidth={STROKE} />
        <Rect x={60} y={194} width={60} height={10} fill={BASE_DARK} stroke={INK} strokeWidth={STROKE} />
        <Rect x={64} y={206} width={52} height={10} fill={BASE} stroke={INK} strokeWidth={STROKE} />
        {/* screw threads */}
        <Path d="M 56 180 Q 90 184 124 180" fill="none" stroke={BASE_DARK} strokeWidth={2.5} />
        <Path d="M 60 198 Q 90 202 120 198" fill="none" stroke={INK} strokeWidth={2.5} opacity={0.5} />
        {/* tip */}
        <Path d="M 78 216 Q 90 232 102 216 Z" fill={BASE_DARK} stroke={INK} strokeWidth={STROKE} />
      </G>
    </Svg>
  );
}
