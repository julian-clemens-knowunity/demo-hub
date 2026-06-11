import React from 'react';
import Svg, { Path, Polygon, G } from 'react-native-svg';
import { INK, PLANE_WHITE } from '../theme';

const STROKE = 4.5;

export default function PaperPlane({ size = 180 }: { size?: number }) {
  return (
    <Svg width={size} height={size * 0.72} viewBox="0 0 200 144">
      <G>
        {/* upper wing */}
        <Polygon points="8,16 190,72 8,128" fill={PLANE_WHITE} stroke={INK} strokeWidth={STROKE} strokeLinejoin="round" />
        {/* inner fold (shaded) */}
        <Polygon points="8,16 96,86 8,128" fill="#CBD7E3" stroke={INK} strokeWidth={STROKE} strokeLinejoin="round" />
        {/* center spine */}
        <Path d="M 8 16 L 96 86 L 190 72" fill="none" stroke={INK} strokeWidth={STROKE} strokeLinecap="round" />
        {/* tail crease */}
        <Path d="M 96 86 L 78 128" stroke={INK} strokeWidth={STROKE} strokeLinecap="round" />
        {/* speed lines */}
        <Path d="M -4 50 L 30 50" stroke={INK} strokeWidth={3} strokeLinecap="round" opacity={0.5} />
        <Path d="M -10 84 L 24 84" stroke={INK} strokeWidth={3} strokeLinecap="round" opacity={0.5} />
      </G>
    </Svg>
  );
}
