import React from 'react';
import Svg, { Circle, Ellipse, Path, G } from 'react-native-svg';
import { INK } from '../theme';

const STROKE = 5;
const ROBE = '#FFFFFF';
const ROBE_SHADE = '#E8EDF2';
const SKIN = '#F4D2A8';
const BAND = '#D8434F';

// Sketchy white-robed karate / ninja figure — mid-kick pose, all white fills
// with thick ink outlines. Matches the reference title-card character.
export default function Ninja({ size = 160 }: { size?: number }) {
  return (
    <Svg width={size} height={size * 1.55} viewBox="0 0 160 250">
      <G>
        {/* shadow */}
        <Ellipse cx={86} cy={244} rx={42} ry={6} fill={INK} opacity={0.16} />

        {/* back leg (kicking up + behind) */}
        <Path d="M 96 150 L 142 168 L 150 188 L 130 196 L 116 178 L 96 168 Z" fill={ROBE} stroke={INK} strokeWidth={STROKE} strokeLinejoin="round" />
        {/* back foot */}
        <Path d="M 130 196 L 152 188 L 152 200 L 132 208 Z" fill={INK} stroke={INK} strokeWidth={STROKE} strokeLinejoin="round" />

        {/* gi body */}
        <Path d="M 40 120 Q 38 92 64 86 L 100 86 Q 126 92 124 120 L 126 174 Q 126 186 110 188 L 54 188 Q 38 186 40 174 Z" fill={ROBE} stroke={INK} strokeWidth={STROKE} strokeLinejoin="round" />
        {/* gi cross-over */}
        <Path d="M 64 86 L 84 108 L 100 86" fill={ROBE_SHADE} stroke={INK} strokeWidth={STROKE} strokeLinejoin="round" />
        {/* belt */}
        <Path d="M 38 150 L 126 150 L 126 164 L 38 164 Z" fill={INK} />
        <Path d="M 52 164 L 46 184 L 60 186 L 64 164 Z" fill={INK} />

        {/* front leg planted */}
        <Path d="M 60 186 L 56 224 L 80 226 L 84 188 Z" fill={ROBE} stroke={INK} strokeWidth={STROKE} strokeLinejoin="round" />
        {/* front foot */}
        <Path d="M 54 224 L 84 226 L 84 236 L 50 236 Z" fill={INK} stroke={INK} strokeWidth={STROKE} strokeLinejoin="round" />

        {/* far arm — punch out */}
        <Path d="M 40 120 L 16 140 L 24 152 L 50 134 Z" fill={ROBE} stroke={INK} strokeWidth={STROKE} strokeLinejoin="round" />
        {/* far fist */}
        <Circle cx={14} cy={142} r={10} fill={SKIN} stroke={INK} strokeWidth={STROKE} />
        {/* knuckle dots */}
        <Circle cx={12} cy={140} r={1.5} fill={INK} />
        <Circle cx={16} cy={144} r={1.5} fill={INK} />

        {/* near arm raised */}
        <Path d="M 124 120 L 146 104 L 154 116 L 134 134 Z" fill={ROBE} stroke={INK} strokeWidth={STROKE} strokeLinejoin="round" />
        {/* near fist */}
        <Circle cx={152} cy={108} r={10} fill={SKIN} stroke={INK} strokeWidth={STROKE} />

        {/* head */}
        <Circle cx={82} cy={48} r={22} fill={SKIN} stroke={INK} strokeWidth={STROKE} />
        {/* hair tuft */}
        <Path d="M 60 38 Q 82 18 104 38 L 100 50 L 64 50 Z" fill={INK} />

        {/* eyes — closed/focused */}
        <Path d="M 70 50 Q 74 46 78 50" fill="none" stroke={INK} strokeWidth={3} strokeLinecap="round" />
        <Path d="M 86 50 Q 90 46 94 50" fill="none" stroke={INK} strokeWidth={3} strokeLinecap="round" />
        {/* mouth */}
        <Path d="M 76 64 Q 82 67 88 64" fill="none" stroke={INK} strokeWidth={2.5} strokeLinecap="round" />

        {/* red headband */}
        <Path d="M 56 42 L 110 42 L 108 52 L 58 52 Z" fill={BAND} stroke={INK} strokeWidth={STROKE} strokeLinejoin="round" />
        {/* headband tails */}
        <Path d="M 108 42 L 138 36 L 132 56 L 110 54 Z" fill={BAND} stroke={INK} strokeWidth={STROKE} strokeLinejoin="round" />
        <Path d="M 132 50 Q 152 56 154 70" fill="none" stroke={INK} strokeWidth={STROKE} strokeLinecap="round" />
        {/* dot emblem */}
        <Circle cx={82} cy={47} r={4.5} fill={ROBE} stroke={INK} strokeWidth={2} />
        <Circle cx={82} cy={47} r={2} fill={INK} />

        {/* motion lines around the kick */}
        <Path d="M 150 138 L 156 134 M 156 154 L 162 152" stroke={INK} strokeWidth={3} strokeLinecap="round" />
      </G>
    </Svg>
  );
}
