import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import Svg, { Ellipse, G, Path, Circle } from 'react-native-svg';

const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);

export type EinsteinFace = 'standby' | 'curious' | 'laughing' | 'exasperated';

const TINT: Record<EinsteinFace, string> = {
  standby:     'rgba(255,220,140,0.10)',
  curious:     'rgba(120,180,255,0.16)',
  laughing:    'rgba(255,200,80,0.22)',
  exasperated: 'rgba(255,255,255,0.06)',
};

// Chibi cartoon Einstein in SVG. 200×200 viewBox. Proportions are head-heavy
// (head ~85% of canvas) and features oversized (cartoon style):
//   - Wild electric-shock hair with 14 radiating spike strands, two-tone shaded
//   - Big round face, warm skin, rosy cheeks
//   - Oversized chibi eyes with highlight catches
//   - Bushy walrus mustache spanning ~70% of face width
//   - Tiny suit collar with a bowtie hint at the bottom
// Per-face swap: brows / eyes / mouth only. Hair/face/mustache/collar stay put.
const SKIN_LIGHT = '#F8DDB8';
const SKIN       = '#F2C99A';
const SKIN_SHADE = '#D69E6B';
const CHEEK      = '#F49A8F';
const HAIR_HI    = '#FCFAF6';
const HAIR_MID   = '#E5E1D8';
const HAIR_SHADE = '#BCB6AB';
const STACHE_HI  = '#FCFAF6';
const STACHE_LO  = '#C9C4BB';
const BROW       = '#7A6E5C';
const EYE_WHITE  = '#FFFFFF';
const EYE_PUPIL  = '#1A1A1A';
const EYE_HI     = '#FFFFFF';
const MOUTH_RED  = '#A03A3A';
const TONGUE     = '#F47979';
const LINE       = '#3A2B1A';
const SUIT       = '#2F2A22';
const TIE        = '#B53939';

type Props = {
  face: EinsteinFace;
  size?: number;
  // If provided, the mouth lip-syncs to this 0-1 value (driven by audio
  // envelope in TeacherScreen). When undefined, falls back to the static
  // per-face mouth shape.
  mouthOpen?: Animated.Value;
};

export default function Einstein({ face, size = 240, mouthOpen }: Props) {
  const [currentFace, setCurrentFace] = useState<EinsteinFace>(face);

  const popScale = useRef(new Animated.Value(1)).current;
  const bounce = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  // Continuous floating bob — runs forever regardless of face. ±14px sine wave.
  const idleBob = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(idleBob, { toValue: -1, duration: 850, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(idleBob, { toValue:  1, duration: 850, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();
  }, []);
  const bobY = idleBob.interpolate({ inputRange: [-1, 1], outputRange: [-14, 14] });

  // Per-face reaction motion (additive on top of bob)
  useEffect(() => {
    if (face === currentFace) return;
    setCurrentFace(face);

    popScale.setValue(0.86);
    bounce.setValue(0);
    rotate.setValue(0);
    Animated.spring(popScale, { toValue: 1, friction: 5, tension: 140, useNativeDriver: true }).start();

    if (face === 'laughing') {
      Animated.sequence([
        Animated.delay(60),
        Animated.timing(bounce, { toValue: -22, duration: 200, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(bounce, { toValue:   0, duration: 240, easing: Easing.in(Easing.quad), useNativeDriver: true }),
        Animated.timing(bounce, { toValue: -10, duration: 160, useNativeDriver: true }),
        Animated.timing(bounce, { toValue:   0, duration: 200, easing: Easing.bounce, useNativeDriver: true }),
      ]).start();
    } else if (face === 'curious') {
      Animated.sequence([
        Animated.timing(rotate, { toValue: 0.45, duration: 380, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(rotate, { toValue: 0.30, duration: 1400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]).start();
    } else if (face === 'exasperated') {
      Animated.sequence([
        Animated.delay(40),
        Animated.timing(rotate, { toValue: -0.35, duration: 200, useNativeDriver: true }),
        Animated.timing(rotate, { toValue:  0.35, duration: 220, useNativeDriver: true }),
        Animated.timing(rotate, { toValue: -0.18, duration: 180, useNativeDriver: true }),
        Animated.timing(rotate, { toValue:  0,    duration: 220, useNativeDriver: true }),
      ]).start();
    } else if (face === 'standby') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(popScale, { toValue: 1.02, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
          Animated.timing(popScale, { toValue: 1,    duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        ])
      ).start();
    }
  }, [face]);

  const rotateInterp = rotate.interpolate({ inputRange: [-1, 1], outputRange: ['-7deg', '7deg'] });

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <View
        style={[
          styles.tint,
          { backgroundColor: TINT[currentFace], width: size, height: size, borderRadius: size / 2 },
        ]}
      />

      <Animated.View
        style={[
          styles.faceLayer,
          {
            width: size,
            height: size,
            transform: [
              { scale: popScale },
              { translateY: bobY },
              { translateY: bounce },
              { rotate: rotateInterp },
            ],
          },
        ]}
      >
        <Svg width={size} height={size} viewBox="0 0 200 200">
          {/* SHADE HAIR SPIKES (back layer) — slightly larger, darker, offset to give depth */}
          <G>
            {HAIR_SPIKES_SHADE.map((d, i) => (
              <Path key={`hs-${i}`} d={d} fill={HAIR_SHADE} />
            ))}
          </G>

          {/* MAIN HAIR SHADE BLOB — fluffy base behind the highlights */}
          <Ellipse cx="100" cy="60" rx="76" ry="42" fill={HAIR_SHADE} />

          {/* HAIR HIGHLIGHT SPIKES (front layer) — actual spike strands radiating outward */}
          <G>
            {HAIR_SPIKES_HI.map((d, i) => (
              <Path key={`hh-${i}`} d={d} fill={HAIR_MID} />
            ))}
          </G>

          {/* HAIR HIGHLIGHTS — bright fluffy puffs on top of base */}
          <Ellipse cx="100" cy="48" rx="50" ry="22" fill={HAIR_HI} />
          <Ellipse cx="72"  cy="56" rx="22" ry="14" fill={HAIR_HI} />
          <Ellipse cx="128" cy="56" rx="22" ry="14" fill={HAIR_HI} />
          <Ellipse cx="100" cy="40" rx="34" ry="14" fill={HAIR_HI} />

          {/* EARS — small skin ovals peeking from under the hair sides */}
          <Ellipse cx="38"  cy="108" rx="6" ry="9" fill={SKIN_SHADE} />
          <Ellipse cx="162" cy="108" rx="6" ry="9" fill={SKIN_SHADE} />
          <Ellipse cx="38"  cy="108" rx="4" ry="6" fill={SKIN} />
          <Ellipse cx="162" cy="108" rx="4" ry="6" fill={SKIN} />

          {/* FACE — big round chibi face. Lower portion under the hair mass. */}
          <Path
            d="M 44 100 Q 44 84 60 76 Q 100 70 140 76 Q 156 84 156 100 Q 156 148 100 156 Q 44 148 44 100 Z"
            fill={SKIN}
          />
          {/* face highlight on forehead */}
          <Ellipse cx="100" cy="92" rx="36" ry="10" fill={SKIN_LIGHT} opacity={0.65} />

          {/* ROSY CHEEKS — chibi pink blush */}
          <Ellipse cx="64"  cy="124" rx="11" ry="7" fill={CHEEK} opacity={0.55} />
          <Ellipse cx="136" cy="124" rx="11" ry="7" fill={CHEEK} opacity={0.55} />

          {/* EYEBROWS — bushy gray, per face */}
          {renderBrows(currentFace)}

          {/* EYES — big chibi style, per face */}
          {renderEyes(currentFace)}

          {/* NOSE — small button between eyes/mustache */}
          <Path d="M 96 119 Q 100 130 104 119" stroke={LINE} strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <Ellipse cx="100" cy="123" rx="3" ry="2" fill={SKIN_SHADE} opacity={0.5} />

          {/* MUSTACHE — iconic bushy walrus. Big, dominant, two-tone. */}
          <G>
            {/* shadow under */}
            <Ellipse cx="100" cy="140" rx="40" ry="11" fill={STACHE_LO} />
            {/* main bar */}
            <Ellipse cx="100" cy="137" rx="38" ry="10" fill={STACHE_HI} />
            {/* left flare droops down */}
            <Path
              d="M 64 137 Q 56 140 52 152 Q 58 156 66 150 Q 72 144 70 138 Z"
              fill={STACHE_LO}
            />
            <Path
              d="M 64 135 Q 58 138 54 148 Q 60 152 68 148 Q 72 142 70 136 Z"
              fill={STACHE_HI}
            />
            {/* right flare droops down */}
            <Path
              d="M 136 137 Q 144 140 148 152 Q 142 156 134 150 Q 128 144 130 138 Z"
              fill={STACHE_LO}
            />
            <Path
              d="M 136 135 Q 142 138 146 148 Q 140 152 132 148 Q 128 142 130 136 Z"
              fill={STACHE_HI}
            />
          </G>

          {/* MOUTH — lives INSIDE the mustache center (the V-notch position).
              When idle: a static per-face shape (closed smile / oh / wide laugh
              / flat line). When playing: a lip-sync animated ellipse pair whose
              vertical radius scales with audio amplitude. Rendered AFTER the
              mustache so it sits on top, looking like a mouth opening through
              the bushy 'stache. */}
          {mouthOpen ? (
            <G>
              <AnimatedEllipse
                cx={100}
                cy={141}
                rx={7}
                ry={mouthOpen.interpolate({ inputRange: [0, 1], outputRange: [0.8, 4.5] })}
                fill={MOUTH_RED}
              />
              <AnimatedEllipse
                cx={100}
                cy={142}
                rx={5}
                ry={mouthOpen.interpolate({ inputRange: [0, 1], outputRange: [0.3, 2.8] })}
                fill={TONGUE}
              />
            </G>
          ) : (
            renderMouth(currentFace)
          )}

          {/* CHIN HIGHLIGHT */}
          <Ellipse cx="100" cy="152" rx="14" ry="3" fill={SKIN_LIGHT} opacity={0.4} />

          {/* SUIT COLLAR + BOWTIE — anchors the head, sells the "old professor" vibe */}
          <Path d="M 50 200 Q 56 168 100 168 Q 144 168 150 200 Z" fill={SUIT} />
          {/* white shirt v at center */}
          <Path d="M 92 168 L 100 184 L 108 168 Z" fill="#F4F2EE" />
          {/* bowtie */}
          <Path d="M 88 178 L 96 174 L 96 182 Z" fill={TIE} />
          <Path d="M 112 178 L 104 174 L 104 182 Z" fill={TIE} />
          <Circle cx="100" cy="178" r="2.4" fill={TIE} />
        </Svg>
      </Animated.View>
    </View>
  );
}

// 14 spike strands radiating out from the central hair mass. Each is a wedge
// path from a base near the scalp out to a tapered tip. Coordinates roughed in
// by hand so the hair looks "electric shock" rather than evenly combed.
const HAIR_SPIKES_HI = [
  // top spikes
  'M 90 30 L 78 0 L 102 16 Z',
  'M 100 24 L 100 -2 L 114 16 Z',
  'M 110 30 L 124 2 L 124 22 Z',
  'M 80 32 L 60 4 L 92 22 Z',
  'M 124 32 L 144 6 L 110 22 Z',
  // upper-side spikes
  'M 64 38 L 36 16 L 78 30 Z',
  'M 136 38 L 164 16 L 122 30 Z',
  // side wings
  'M 44 64 L 16 56 L 56 70 Z',
  'M 156 64 L 184 56 L 144 70 Z',
  // lower-side flicks
  'M 38 86 L 14 96 L 52 88 Z',
  'M 162 86 L 186 96 L 148 88 Z',
  // back-upper tufts
  'M 70 22 L 56 0 L 84 18 Z',
  'M 130 22 L 144 0 L 116 18 Z',
  // crown center extra
  'M 100 18 L 96 -8 L 106 -8 Z',
];

// Shadow layer is slightly larger/offset to give the hair depth
const HAIR_SPIKES_SHADE = [
  'M 88 32 L 74 -4 L 104 18 Z',
  'M 100 28 L 98 -6 L 118 18 Z',
  'M 112 32 L 128 -2 L 126 24 Z',
  'M 78 34 L 56 0 L 94 24 Z',
  'M 126 34 L 148 2 L 108 24 Z',
  'M 62 40 L 32 12 L 80 32 Z',
  'M 138 40 L 168 12 L 120 32 Z',
  'M 42 66 L 12 54 L 58 72 Z',
  'M 158 66 L 188 54 L 142 72 Z',
  'M 36 88 L 10 98 L 54 90 Z',
  'M 164 88 L 190 98 L 146 90 Z',
];

function renderBrows(face: EinsteinFace) {
  if (face === 'curious') {
    // one raised (left) + one neutral (right)
    return (
      <G>
        <Path d="M 64 92 Q 76 80 92 88" stroke={BROW} strokeWidth="5" fill="none" strokeLinecap="round" />
        <Path d="M 108 94 Q 122 92 136 94" stroke={BROW} strokeWidth="5" fill="none" strokeLinecap="round" />
      </G>
    );
  }
  if (face === 'laughing') {
    return (
      <G>
        <Path d="M 62 86 Q 78 76 94 86" stroke={BROW} strokeWidth="5" fill="none" strokeLinecap="round" />
        <Path d="M 106 86 Q 122 76 138 86" stroke={BROW} strokeWidth="5" fill="none" strokeLinecap="round" />
      </G>
    );
  }
  if (face === 'exasperated') {
    return (
      <G>
        <Path d="M 62 92 L 94 102" stroke={BROW} strokeWidth="5" fill="none" strokeLinecap="round" />
        <Path d="M 106 102 L 138 92" stroke={BROW} strokeWidth="5" fill="none" strokeLinecap="round" />
      </G>
    );
  }
  return (
    <G>
      <Path d="M 64 94 Q 78 88 92 94" stroke={BROW} strokeWidth="5" fill="none" strokeLinecap="round" />
      <Path d="M 108 94 Q 122 88 136 94" stroke={BROW} strokeWidth="5" fill="none" strokeLinecap="round" />
    </G>
  );
}

function renderEyes(face: EinsteinFace) {
  if (face === 'laughing') {
    // closed-up curves (>‹)
    return (
      <G>
        <Path d="M 70 110 Q 80 100 90 110" stroke={EYE_PUPIL} strokeWidth="4" fill="none" strokeLinecap="round" />
        <Path d="M 110 110 Q 120 100 130 110" stroke={EYE_PUPIL} strokeWidth="4" fill="none" strokeLinecap="round" />
      </G>
    );
  }
  if (face === 'exasperated') {
    // half-lidded — flat top lines + tiny pupils
    return (
      <G>
        <Ellipse cx="80"  cy="110" rx="9" ry="3.5" fill={EYE_WHITE} stroke={LINE} strokeWidth="1.2" />
        <Ellipse cx="120" cy="110" rx="9" ry="3.5" fill={EYE_WHITE} stroke={LINE} strokeWidth="1.2" />
        <Circle cx="80"  cy="108" r="2.6" fill={EYE_PUPIL} />
        <Circle cx="120" cy="108" r="2.6" fill={EYE_PUPIL} />
      </G>
    );
  }
  if (face === 'curious') {
    // big eyes, pupils up-and-to-the-right (looking at the raised brow)
    return (
      <G>
        <Ellipse cx="80"  cy="110" rx="10" ry="9" fill={EYE_WHITE} stroke={LINE} strokeWidth="1.2" />
        <Ellipse cx="120" cy="110" rx="10" ry="9" fill={EYE_WHITE} stroke={LINE} strokeWidth="1.2" />
        <Circle cx="82"  cy="108" r="3.6" fill={EYE_PUPIL} />
        <Circle cx="122" cy="108" r="3.6" fill={EYE_PUPIL} />
        <Circle cx="83.5" cy="106.5" r="1.2" fill={EYE_HI} />
        <Circle cx="123.5" cy="106.5" r="1.2" fill={EYE_HI} />
      </G>
    );
  }
  // standby — big chibi open eyes with highlight catches
  return (
    <G>
      <Ellipse cx="80"  cy="110" rx="9.5" ry="8.5" fill={EYE_WHITE} stroke={LINE} strokeWidth="1.2" />
      <Ellipse cx="120" cy="110" rx="9.5" ry="8.5" fill={EYE_WHITE} stroke={LINE} strokeWidth="1.2" />
      <Circle cx="80"  cy="111" r="3.4" fill={EYE_PUPIL} />
      <Circle cx="120" cy="111" r="3.4" fill={EYE_PUPIL} />
      <Circle cx="81.5" cy="109" r="1.3" fill={EYE_HI} />
      <Circle cx="121.5" cy="109" r="1.3" fill={EYE_HI} />
    </G>
  );
}

function renderMouth(face: EinsteinFace) {
  // All static mouths now sit INSIDE the mustache center (y≈140-144) — the
  // V-notch position. Idle Einstein looks like he has a small mouth opening
  // through the 'stache, matching where the lip-sync mouth animates during play.
  if (face === 'laughing') {
    return (
      <G>
        <Ellipse cx="100" cy="141" rx="6" ry="4" fill={MOUTH_RED} />
        <Ellipse cx="100" cy="143" rx="4" ry="2" fill={TONGUE} />
      </G>
    );
  }
  if (face === 'exasperated') {
    return <Path d="M 92 141 L 108 141" stroke={LINE} strokeWidth="2.4" fill="none" strokeLinecap="round" />;
  }
  if (face === 'curious') {
    return <Ellipse cx="100" cy="141" rx="3.5" ry="3" fill={MOUTH_RED} />;
  }
  // standby — small closed smile in the mustache notch
  return <Path d="M 92 139 Q 100 144 108 139" stroke={LINE} strokeWidth="2.2" fill="none" strokeLinecap="round" />;
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
  tint: { position: 'absolute' },
  faceLayer: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
});
