import React from 'react';
import Svg, { Path, G } from 'react-native-svg';
import { INK } from '../theme';

const STROKE = 5.5;

// Open-palm, fingers-spread cartoon hand. Drawn from scratch with geometric
// primitives. The wrist + bottom of the palm sit on the RIGHT side of the
// viewBox so the title scene can position it half-cut at the right edge.
export default function FlickHand({ size = 320 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 320 360">
      <G>
        {/* WRIST stub — bottom-right of viewBox, will be cut by the screen edge */}
        <Path
          d="M 250 354 L 244 250 Q 280 246 320 250 L 320 354 Z"
          fill="#FFFFFF"
          stroke={INK}
          strokeWidth={STROKE}
          strokeLinejoin="round"
        />
        {/* cuff line */}
        <Path d="M 248 258 Q 286 254 320 258" fill="none" stroke={INK} strokeWidth={3} opacity={0.5} />

        {/* PALM — heel + back of hand */}
        <Path
          d="M 168 252 Q 156 150 192 140 L 286 140 Q 314 144 308 252 Q 290 270 230 268 Q 188 268 168 252 Z"
          fill="#FFFFFF"
          stroke={INK}
          strokeWidth={STROKE}
          strokeLinejoin="round"
        />

        {/* THUMB — extends down + left from the palm */}
        <Path
          d="M 178 230 Q 130 250 78 286 Q 60 296 70 312 Q 86 320 110 312 Q 162 286 196 254 Z"
          fill="#FFFFFF"
          stroke={INK}
          strokeWidth={STROKE}
          strokeLinejoin="round"
        />

        {/* INDEX finger — leftmost, long, angled upper-left */}
        <Path
          d="M 188 152 L 76 48 Q 60 30 78 20 Q 100 12 116 32 L 220 138 Z"
          fill="#FFFFFF"
          stroke={INK}
          strokeWidth={STROKE}
          strokeLinejoin="round"
        />

        {/* MIDDLE finger — tallest, nearly vertical */}
        <Path
          d="M 220 140 L 178 18 Q 178 -2 200 -2 Q 222 -2 226 22 L 250 140 Z"
          fill="#FFFFFF"
          stroke={INK}
          strokeWidth={STROKE}
          strokeLinejoin="round"
        />

        {/* RING finger — slightly shorter, tilted right */}
        <Path
          d="M 248 140 L 252 30 Q 256 12 276 16 Q 294 22 288 42 L 280 140 Z"
          fill="#FFFFFF"
          stroke={INK}
          strokeWidth={STROKE}
          strokeLinejoin="round"
        />

        {/* PINKY — shortest, extending upper-right */}
        <Path
          d="M 280 142 L 318 80 Q 332 66 344 82 Q 350 96 332 116 L 298 144 Z"
          fill="#FFFFFF"
          stroke={INK}
          strokeWidth={STROKE}
          strokeLinejoin="round"
        />

        {/* knuckle dots */}
        <Path d="M 198 175 L 200 192" stroke={INK} strokeWidth={2.6} strokeLinecap="round" opacity={0.5} />
        <Path d="M 230 170 L 232 188" stroke={INK} strokeWidth={2.6} strokeLinecap="round" opacity={0.5} />
        <Path d="M 262 172 L 264 190" stroke={INK} strokeWidth={2.6} strokeLinecap="round" opacity={0.5} />
        <Path d="M 290 178 L 292 196" stroke={INK} strokeWidth={2.6} strokeLinecap="round" opacity={0.5} />

        {/* palm crease */}
        <Path d="M 184 222 Q 230 234 296 222" fill="none" stroke={INK} strokeWidth={2.4} opacity={0.45} />

        {/* motion swoosh trailing the flick direction (right side toward off-screen) */}
        <Path d="M 304 200 Q 340 230 332 280" fill="none" stroke={INK} strokeWidth={4} strokeLinecap="round" opacity={0.55} />
        <Path d="M 316 184 Q 354 220 348 280" fill="none" stroke={INK} strokeWidth={3.5} strokeLinecap="round" opacity={0.35} />
      </G>
    </Svg>
  );
}
