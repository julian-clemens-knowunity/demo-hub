import React from 'react';
import Svg, { Ellipse, Path, Rect, G } from 'react-native-svg';
import { INK } from '../theme';

const STROKE = 4.5;

export type CanColorKey = 'red' | 'green' | 'yellow' | 'blue' | 'orange' | 'purple';

const PALETTE: Record<CanColorKey, { body: string; dark: string }> = {
  red:    { body: '#D8434F', dark: '#A8242E' },
  green:  { body: '#2EAF55', dark: '#1F7B3D' },
  yellow: { body: '#FFC820', dark: '#C99500' },
  blue:   { body: '#3F8EFA', dark: '#2362C7' },
  orange: { body: '#FF7A28', dark: '#C44E0A' },
  purple: { body: '#8E51FF', dark: '#5A2DC2' },
};

type Props = {
  size?: number;
  color?: CanColorKey;
  cracked?: boolean;
};

const LID_GREY = '#B5BBC6';
const LID_GREY_DARK = '#7C8493';

export default function SodaCan({ size = 140, color = 'red', cracked = false }: Props) {
  const { body, dark } = PALETTE[color];
  return (
    <Svg width={size} height={size * 1.55} viewBox="0 0 100 155">
      <G>
        <Rect x={12} y={14} width={76} height={130} rx={4} fill={body} stroke={INK} strokeWidth={STROKE} />
        <Path d="M 18 30 Q 50 22 82 30 L 82 50 Q 50 42 18 50 Z" fill="#FFFFFF" opacity={0.18} />
        <Rect x={70} y={20} width={5} height={120} fill={dark} opacity={0.55} />
        <Rect x={18} y={20} width={3} height={120} fill="#FFFFFF" opacity={0.30} />
        <Path d="M 22 70 L 78 70" stroke="#FFFFFF" strokeWidth={1.5} opacity={0.5} />
        <Path d="M 22 84 L 78 84" stroke={dark} strokeWidth={1.5} opacity={0.7} />
        {/* GREY LID — makes it read clearly as a can */}
        <Ellipse cx={50} cy={14} rx={38} ry={9} fill={LID_GREY} stroke={INK} strokeWidth={STROKE} />
        <Ellipse cx={50} cy={11} rx={34} ry={5} fill={LID_GREY_DARK} stroke={INK} strokeWidth={1.6} />
        <Path d="M 41 11 Q 50 7 56 13" fill="none" stroke={INK} strokeWidth={2} strokeLinecap="round" />
        {/* grey bottom rim too */}
        <Ellipse cx={50} cy={144} rx={38} ry={9} fill={LID_GREY} stroke={INK} strokeWidth={STROKE} />

        {/* CRACK OVERLAY — jagged dark lines + a small dent */}
        {cracked ? (
          <>
            <Path d="M 30 36 L 40 56 L 28 70 L 46 90 L 30 112 L 50 130" fill="none" stroke={INK} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M 40 56 L 52 50 M 28 70 L 18 64 M 46 90 L 60 84 M 30 112 L 22 104 M 50 130 L 64 124" fill="none" stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
            {/* dent shading on left */}
            <Path d="M 12 60 Q 24 76 12 100 Z" fill={dark} opacity={0.5} />
            {/* secondary horizontal crack */}
            <Path d="M 14 96 L 26 92 L 34 98 L 50 92 L 64 100 L 80 94" fill="none" stroke={INK} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
          </>
        ) : null}
      </G>
    </Svg>
  );
}
