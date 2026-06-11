import React from 'react';
import Svg, { Circle, Line, Path, Rect, G } from 'react-native-svg';
import { BAG_RED, BAG_RED_DARK, INK } from '../theme';

const STROKE = 4.5;

export default function PunchingBag({ size = 200, hit = false }: { size?: number; hit?: boolean }) {
  return (
    <Svg width={size} height={size * 2.2} viewBox="0 0 200 440">
      <G>
        {/* hanging chain */}
        <Line x1={100} y1={6} x2={100} y2={36} stroke={INK} strokeWidth={STROKE} />
        <Circle cx={100} cy={10} r={6} fill="#B5BBC6" stroke={INK} strokeWidth={3} />
        <Path d="M 78 32 L 100 50 L 122 32" fill="none" stroke={INK} strokeWidth={STROKE} strokeLinecap="round" />
        <Path d="M 70 40 L 100 56 L 130 40" fill="none" stroke={INK} strokeWidth={STROKE} strokeLinecap="round" />

        {/* top cap */}
        <Rect x={44} y={50} width={112} height={26} rx={5} fill={INK} />
        <Rect x={48} y={54} width={104} height={4} fill="#FFFFFF" opacity={0.18} />

        {/* body */}
        <Rect x={44} y={74} width={112} height={310} rx={40} fill={BAG_RED} stroke={INK} strokeWidth={STROKE} />

        {/* mid stripe */}
        <Rect x={42} y={230} width={116} height={18} fill={BAG_RED_DARK} stroke={INK} strokeWidth={STROKE} />
        <Rect x={42} y={232} width={116} height={4} fill="#FFFFFF" opacity={0.25} />

        {/* highlight */}
        <Path d="M 60 90 Q 70 220 60 360" fill="none" stroke="#FFFFFF" strokeWidth={8} opacity={0.22} strokeLinecap="round" />
        {/* shadow */}
        <Path d="M 142 90 Q 132 230 142 360" fill="none" stroke={BAG_RED_DARK} strokeWidth={12} opacity={0.55} strokeLinecap="round" />

        {/* bottom cap */}
        <Rect x={44} y={378} width={112} height={10} rx={3} fill={INK} />

        {/* face */}
        {!hit ? (
          <>
            {/* angry eyebrows */}
            <Path d="M 60 152 L 90 168" stroke={INK} strokeWidth={5} strokeLinecap="round" />
            <Path d="M 140 152 L 110 168" stroke={INK} strokeWidth={5} strokeLinecap="round" />
            {/* squint eyes */}
            <Path d="M 64 178 Q 76 168 88 178" fill="none" stroke={INK} strokeWidth={4.5} strokeLinecap="round" />
            <Path d="M 112 178 Q 124 168 136 178" fill="none" stroke={INK} strokeWidth={4.5} strokeLinecap="round" />
            {/* smirky mouth */}
            <Path d="M 78 200 Q 100 218 122 200" fill="none" stroke={INK} strokeWidth={4.5} strokeLinecap="round" />
            {/* tongue */}
            <Path d="M 96 212 Q 104 226 116 220 L 116 210 Z" fill="#FF6E8A" stroke={INK} strokeWidth={3} />
          </>
        ) : (
          <>
            {/* x-eyes */}
            <Path d="M 60 152 L 92 184 M 92 152 L 60 184" stroke={INK} strokeWidth={5} strokeLinecap="round" />
            <Path d="M 108 152 L 140 184 M 140 152 L 108 184" stroke={INK} strokeWidth={5} strokeLinecap="round" />
            {/* o mouth */}
            <Path d="M 80 200 Q 100 220 120 200 Q 100 184 80 200 Z" fill={INK} />
          </>
        )}
      </G>
    </Svg>
  );
}
