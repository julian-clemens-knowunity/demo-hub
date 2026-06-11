import React from 'react';
import Svg, { Path, Polygon, G } from 'react-native-svg';
import { INK } from '../theme';

const STROKE = 4;

// Directional impact burst — spikes radiate from a central focal point,
// but they're biased toward one side (the direction the can flew). Heavier
// spikes on the LEFT, shorter on the right. Reads as a one-sided splash,
// not a symmetric star.
const N_SPIKES = 11;
const VIEW_SIZE = 220;
const CX = VIEW_SIZE / 2;
const CY = VIEW_SIZE / 2;
const INNER_R = 28;
const BASE_OUTER_R = 56;
const EXTRA_OUTER_R = 50;
const TARGET_DEG = 200; // upper-left side, where the can flew
const RAD = Math.PI / 180;

function angularDiff(a: number, b: number) {
  const d = ((a - b) + 540) % 360 - 180;
  return Math.abs(d);
}

// Pre-compute the alternating outer/inner polygon points once.
const POINTS: string[] = [];
for (let i = 0; i < N_SPIKES; i++) {
  const outerDeg = (i / N_SPIKES) * 360;
  const innerDeg = outerDeg + 180 / N_SPIKES; // halfway to the next spike
  const diff = angularDiff(outerDeg, TARGET_DEG);
  const bias = Math.max(0, Math.cos(diff * RAD));
  const L = BASE_OUTER_R + bias * EXTRA_OUTER_R;
  const ox = CX + L * Math.cos(outerDeg * RAD);
  const oy = CY + L * Math.sin(outerDeg * RAD);
  const ix = CX + INNER_R * Math.cos(innerDeg * RAD);
  const iy = CY + INNER_R * Math.sin(innerDeg * RAD);
  POINTS.push(`${ox.toFixed(1)},${oy.toFixed(1)}`);
  POINTS.push(`${ix.toFixed(1)},${iy.toFixed(1)}`);
}

// Same shape, smaller, for the inner accent
const INNER_POINTS: string[] = [];
for (let i = 0; i < N_SPIKES; i++) {
  const outerDeg = (i / N_SPIKES) * 360;
  const innerDeg = outerDeg + 180 / N_SPIKES;
  const diff = angularDiff(outerDeg, TARGET_DEG);
  const bias = Math.max(0, Math.cos(diff * RAD));
  const L = (BASE_OUTER_R + bias * EXTRA_OUTER_R) * 0.62;
  const innerLocal = INNER_R * 0.55;
  const ox = CX + L * Math.cos(outerDeg * RAD);
  const oy = CY + L * Math.sin(outerDeg * RAD);
  const ix = CX + innerLocal * Math.cos(innerDeg * RAD);
  const iy = CY + innerLocal * Math.sin(innerDeg * RAD);
  INNER_POINTS.push(`${ox.toFixed(1)},${oy.toFixed(1)}`);
  INNER_POINTS.push(`${ix.toFixed(1)},${iy.toFixed(1)}`);
}

export default function ImpactStar({ size = 220 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${VIEW_SIZE} ${VIEW_SIZE}`}>
      <G>
        <Polygon
          points={POINTS.join(' ')}
          fill="#FFFFFF"
          stroke={INK}
          strokeWidth={STROKE * 1.4}
          strokeLinejoin="miter"
        />
        <Polygon
          points={INNER_POINTS.join(' ')}
          fill="none"
          stroke={INK}
          strokeWidth={2}
          opacity={0.55}
          strokeLinejoin="miter"
        />
        {/* one extra long swoosh on the left to sell the "comet trail" direction */}
        <Path d={`M ${CX - 20} ${CY + 4} L ${CX - 92} ${CY - 4}`} stroke={INK} strokeWidth={3} strokeLinecap="round" />
        <Path d={`M ${CX - 14} ${CY - 14} L ${CX - 78} ${CY - 36}`} stroke={INK} strokeWidth={2.6} strokeLinecap="round" />
      </G>
    </Svg>
  );
}
