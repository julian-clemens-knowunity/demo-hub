import React from 'react';
import Svg, { Path, Polygon, G } from 'react-native-svg';
import { INK } from '../theme';

const STROKE = 3.5;

export function GlassShards({ size = 220 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 220 220">
      <G>
        <Polygon points="40,90 70,40 90,80 60,110" fill="#FFE066" stroke={INK} strokeWidth={STROKE} strokeLinejoin="round" />
        <Polygon points="120,40 160,30 170,80 130,90" fill="#FFEC8A" stroke={INK} strokeWidth={STROKE} strokeLinejoin="round" />
        <Polygon points="40,140 80,160 70,190 30,180" fill="#FFE066" stroke={INK} strokeWidth={STROKE} strokeLinejoin="round" />
        <Polygon points="140,140 180,150 190,190 150,200" fill="#FFEC8A" stroke={INK} strokeWidth={STROKE} strokeLinejoin="round" />
        <Polygon points="100,140 130,150 120,180 90,170" fill="#FFE066" stroke={INK} strokeWidth={STROKE} strokeLinejoin="round" />
        <Path d="M 110 110 L 130 60 M 110 110 L 80 70 M 110 110 L 60 130 M 110 110 L 160 140 M 110 110 L 110 170 M 110 110 L 170 90" stroke="#FFD700" strokeWidth={4} strokeLinecap="round" opacity={0.9} />
      </G>
    </Svg>
  );
}

export function MelonChunk({ size = 90, rot = 0 }: { size?: number; rot?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" style={{ transform: [{ rotate: `${rot}deg` }] }}>
      <G>
        <Polygon points="10,50 50,12 90,50 60,90 40,90" fill="#2EAF55" stroke={INK} strokeWidth={STROKE} strokeLinejoin="round" />
        <Polygon points="20,52 50,24 80,52 56,82 44,82" fill="#F25B7A" stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
        <Path d="M 36 50 L 36 52 M 50 46 L 50 48 M 60 56 L 60 58" stroke="#2A2A36" strokeWidth={5} strokeLinecap="round" />
      </G>
    </Svg>
  );
}
