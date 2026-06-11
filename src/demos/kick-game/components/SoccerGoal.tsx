import React from 'react';
import { Image } from 'react-native';
import Svg, { Circle, Line, Path, Rect, G } from 'react-native-svg';
import { INK } from '../theme';
import ballImage from '../assets/soccerball.png';

// Aspect of the rendered goal — viewBox 280×150 → height/width ≈ 0.536.
// Exported so SoccerScene can derive GOAL_H without drifting out of sync.
export const GOAL_ASPECT = 150 / 280;

// === Cartoon goal — white frame with bold black edges, soft net behind ===
export default function SoccerGoal({ size = 280 }: { size?: number }) {
  // viewBox 280×150. Frame is an inverted-U: outer edge x∈[14,266], inner
  // mouth x∈[28,252], y∈[26,146]. Top outer corners rounded.
  const FRAME_STROKE = 4.5;
  const NET_STROKE = 1.4;
  const innerL = 28;
  const innerR = 252;
  const innerT = 26;
  const innerB = 146;
  const innerW = innerR - innerL;
  const innerH = innerB - innerT;
  const VCOLS = 9;
  const HROWS = 5;

  return (
    <Svg width={size} height={size * GOAL_ASPECT} viewBox="0 0 280 150">
      <G>
        {/* Net background — soft white wash inside the goal mouth */}
        <Rect x={innerL} y={innerT} width={innerW} height={innerH} fill="#FFFFFF" opacity={0.42} />

        {/* Net grid — vertical strands */}
        {Array.from({ length: VCOLS }).map((_, i) => {
          const x = innerL + (innerW * (i + 1)) / (VCOLS + 1);
          return (
            <Line key={`nv-${i}`} x1={x} y1={innerT} x2={x} y2={innerB}
              stroke={INK} strokeWidth={NET_STROKE} opacity={0.55} />
          );
        })}

        {/* Net grid — horizontal strands */}
        {Array.from({ length: HROWS }).map((_, i) => {
          const y = innerT + (innerH * (i + 1)) / (HROWS + 1);
          return (
            <Line key={`nh-${i}`} x1={innerL} y1={y} x2={innerR} y2={y}
              stroke={INK} strokeWidth={NET_STROKE} opacity={0.55} />
          );
        })}

        {/* Cartoon frame — inverted U as a single closed path so corners
            don't show stroke artifacts. */}
        <Path
          d="M 14 146 L 14 22 Q 14 8 28 8 L 252 8 Q 266 8 266 22 L 266 146 L 252 146 L 252 26 L 28 26 L 28 146 Z"
          fill="#FFFFFF"
          stroke={INK}
          strokeWidth={FRAME_STROKE}
          strokeLinejoin="round"
        />
      </G>
    </Svg>
  );
}

// === Soccer ball — Julian's cartoon ref image, background flood-cleared. ===
export function SoccerBall({ size = 180 }: { size?: number }) {
  return (
    <Image source={ballImage} style={{ width: size, height: size }} resizeMode="contain" />
  );
}

// === Tiny crouched stick keeper — sits inside the goal mouth ===
type KeeperPose = 'idle' | 'jump' | 'dive' | 'flat';

export function StickKeeper({ size = 60, pose = 'idle' }: { size?: number; pose?: KeeperPose }) {
  if (pose === 'flat') {
    return (
      <Svg width={size * 1.8} height={size * 0.7} viewBox="0 0 100 40">
        <G>
          <Circle cx={14} cy={20} r={7} fill="#FFFFFF" stroke={INK} strokeWidth={2.6} />
          <Path d="M 11 19 L 15 23 M 15 19 L 11 23" stroke={INK} strokeWidth={1.6} strokeLinecap="round" />
          <Path d="M 17 19 L 21 23 M 21 19 L 17 23" stroke={INK} strokeWidth={1.6} strokeLinecap="round" />
          <Path d="M 18 26 Q 20 28 22 26" fill="none" stroke={INK} strokeWidth={1.4} strokeLinecap="round" />
          {/* body line */}
          <Path d="M 22 20 L 74 20" stroke={INK} strokeWidth={2.6} strokeLinecap="round" />
          {/* arms splayed */}
          <Path d="M 36 20 L 40 8" stroke={INK} strokeWidth={2.4} strokeLinecap="round" />
          <Path d="M 40 20 L 44 32" stroke={INK} strokeWidth={2.4} strokeLinecap="round" />
          {/* legs */}
          <Path d="M 74 20 L 92 14" stroke={INK} strokeWidth={2.4} strokeLinecap="round" />
          <Path d="M 74 20 L 94 26" stroke={INK} strokeWidth={2.4} strokeLinecap="round" />
          {/* impact lines around head */}
          <Path d="M 2 10 L 6 14 M 2 28 L 6 24 M 8 6 L 10 12" stroke={INK} strokeWidth={1.8} strokeLinecap="round" />
        </G>
      </Svg>
    );
  }

  // crouched-standing stick keeper inside the goal
  return (
    <Svg width={size} height={size * 1.5} viewBox="0 0 60 90">
      <G>
        <Circle cx={30} cy={18} r={9} fill="#FFFFFF" stroke={INK} strokeWidth={2.6} />
        <Circle cx={27} cy={18} r={1.2} fill={INK} />
        <Circle cx={33} cy={18} r={1.2} fill={INK} />
        <Path d="M 27 23 Q 30 25 33 23" fill="none" stroke={INK} strokeWidth={1.4} strokeLinecap="round" />
        {/* body */}
        <Path d="M 30 27 L 30 56" stroke={INK} strokeWidth={2.6} strokeLinecap="round" />
        {/* arms */}
        {pose === 'jump' ? (
          <>
            <Path d="M 30 34 L 12 12" stroke={INK} strokeWidth={2.6} strokeLinecap="round" />
            <Path d="M 30 34 L 48 12" stroke={INK} strokeWidth={2.6} strokeLinecap="round" />
            <Circle cx={12} cy={12} r={3.2} fill="#FFC820" stroke={INK} strokeWidth={2} />
            <Circle cx={48} cy={12} r={3.2} fill="#FFC820" stroke={INK} strokeWidth={2} />
          </>
        ) : pose === 'dive' ? (
          <>
            <Path d="M 30 36 L 8 30" stroke={INK} strokeWidth={2.6} strokeLinecap="round" />
            <Path d="M 30 36 L 54 44" stroke={INK} strokeWidth={2.6} strokeLinecap="round" />
            <Circle cx={8} cy={30} r={3.2} fill="#FFC820" stroke={INK} strokeWidth={2} />
            <Circle cx={54} cy={44} r={3.2} fill="#FFC820" stroke={INK} strokeWidth={2} />
          </>
        ) : (
          <>
            <Path d="M 30 36 L 14 46" stroke={INK} strokeWidth={2.6} strokeLinecap="round" />
            <Path d="M 30 36 L 46 46" stroke={INK} strokeWidth={2.6} strokeLinecap="round" />
            <Circle cx={14} cy={46} r={3.2} fill="#FFC820" stroke={INK} strokeWidth={2} />
            <Circle cx={46} cy={46} r={3.2} fill="#FFC820" stroke={INK} strokeWidth={2} />
          </>
        )}
        {/* crouched legs (bent) */}
        <Path d="M 30 56 L 18 70 L 14 84" fill="none" stroke={INK} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M 30 56 L 42 70 L 46 84" fill="none" stroke={INK} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
      </G>
    </Svg>
  );
}

export { StickKeeper as Keeper };
