import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, ImageSourcePropType, StyleSheet, View } from 'react-native';

export type KnowieFace =
  | 'standby'
  | 'approving'
  | 'excited'
  | 'laughing'
  | 'giggling'
  | 'amazed'
  | 'angry'
  | 'dazed'
  | 'overIt'
  | 'confused'
  | 'questioning';

const FACE_IMAGES: Record<KnowieFace, ImageSourcePropType> = {
  standby: require('../assets/standby.png'),
  approving: require('../assets/approving.png'),
  excited: require('../assets/excited.png'),
  laughing: require('../assets/laughing.png'),
  giggling: require('../assets/giggling.png'),
  amazed: require('../assets/amazed.png'),
  angry: require('../assets/angry.png'),
  dazed: require('../assets/dazed.png'),
  overIt: require('../assets/overIt.png'),
  confused: require('../assets/confused.png'),
  questioning: require('../assets/questioning.png'),
};

// Subtle dark-theme glow behind Knowie — color hints at reaction without overpowering.
const TINT: Record<KnowieFace, string> = {
  standby: 'rgba(255,255,255,0.04)',
  approving: 'rgba(0,201,80,0.16)',
  excited: 'rgba(255,180,40,0.20)',
  laughing: 'rgba(255,210,60,0.20)',
  giggling: 'rgba(255,160,80,0.16)',
  amazed: 'rgba(232,77,162,0.20)',
  angry: 'rgba(251,44,54,0.22)',
  dazed: 'rgba(120,120,200,0.18)',
  overIt: 'rgba(255,255,255,0.06)',
  confused: 'rgba(142,81,255,0.18)',
  questioning: 'rgba(43,127,255,0.18)',
};

type Props = {
  face: KnowieFace;
  size?: number;
};

// Crossfade duration when the face changes
const FADE_MS = 280;

export default function Knowie({ face, size = 180 }: Props) {
  // Two overlapping layers: "current" (showing) and "incoming" (fading in).
  // When `face` prop changes, snapshot the current into a state slot,
  // mount the new one with opacity 0, then crossfade.
  const [currentFace, setCurrentFace] = useState<KnowieFace>(face);
  const [prevFace, setPrevFace] = useState<KnowieFace | null>(null);

  const prevOpacity = useRef(new Animated.Value(1)).current;
  const nextOpacity = useRef(new Animated.Value(1)).current;
  const nextScale = useRef(new Animated.Value(1)).current;
  const popScale = useRef(new Animated.Value(1)).current;
  const bounce = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const tintAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (face === currentFace) return;

    // Snapshot the outgoing face
    setPrevFace(currentFace);
    setCurrentFace(face);

    // Reset animations
    prevOpacity.setValue(1);
    nextOpacity.setValue(0);
    nextScale.setValue(0.82);
    popScale.setValue(1);
    bounce.setValue(0);
    rotate.setValue(0);
    tintAnim.setValue(0);

    // Crossfade + scale-in for the new face
    Animated.parallel([
      Animated.timing(prevOpacity, {
        toValue: 0,
        duration: FADE_MS,
        easing: Easing.in(Easing.quad),
        useNativeDriver: false,
      }),
      Animated.timing(nextOpacity, {
        toValue: 1,
        duration: FADE_MS,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }),
      Animated.spring(nextScale, {
        toValue: 1,
        friction: 5,
        tension: 140,
        useNativeDriver: false,
      }),
      Animated.timing(tintAnim, {
        toValue: 1,
        duration: FADE_MS,
        useNativeDriver: false,
      }),
    ]).start(() => {
      setPrevFace(null);
    });

    // Reaction-specific motion overlay — amplitudes tuned for camera-friendly punch
    if (face === 'excited' || face === 'laughing') {
      // Big celebratory triple-bounce + scale pop
      Animated.sequence([
        Animated.delay(80),
        Animated.timing(bounce, { toValue: -36, duration: 180, easing: Easing.out(Easing.quad), useNativeDriver: false }),
        Animated.timing(bounce, { toValue: 0, duration: 200, easing: Easing.in(Easing.quad), useNativeDriver: false }),
        Animated.timing(bounce, { toValue: -22, duration: 140, easing: Easing.out(Easing.quad), useNativeDriver: false }),
        Animated.timing(bounce, { toValue: 0, duration: 180, easing: Easing.in(Easing.quad), useNativeDriver: false }),
        Animated.timing(bounce, { toValue: -10, duration: 120, useNativeDriver: false }),
        Animated.timing(bounce, { toValue: 0, duration: 160, easing: Easing.bounce, useNativeDriver: false }),
      ]).start();
      Animated.sequence([
        Animated.delay(60),
        Animated.spring(popScale, { toValue: 1.25, friction: 4, tension: 200, useNativeDriver: false }),
        Animated.spring(popScale, { toValue: 1, friction: 5, tension: 140, useNativeDriver: false }),
      ]).start();
      Animated.sequence([
        Animated.delay(80),
        Animated.timing(rotate, { toValue: 0.6, duration: 120, useNativeDriver: false }),
        Animated.timing(rotate, { toValue: -0.6, duration: 120, useNativeDriver: false }),
        Animated.timing(rotate, { toValue: 0.4, duration: 120, useNativeDriver: false }),
        Animated.timing(rotate, { toValue: 0, duration: 120, useNativeDriver: false }),
      ]).start();
    } else if (face === 'approving') {
      Animated.sequence([
        Animated.delay(80),
        Animated.timing(bounce, { toValue: -18, duration: 180, easing: Easing.out(Easing.quad), useNativeDriver: false }),
        Animated.timing(bounce, { toValue: 0, duration: 220, easing: Easing.bounce, useNativeDriver: false }),
      ]).start();
    } else if (face === 'amazed') {
      // Recoil-back then forward jitter
      Animated.sequence([
        Animated.delay(60),
        Animated.timing(bounce, { toValue: -14, duration: 100, useNativeDriver: false }),
        Animated.parallel([
          Animated.timing(bounce, { toValue: 0, duration: 240, easing: Easing.bounce, useNativeDriver: false }),
          Animated.sequence([
            Animated.timing(rotate, { toValue: 1, duration: 50, useNativeDriver: false }),
            Animated.timing(rotate, { toValue: -1, duration: 50, useNativeDriver: false }),
            Animated.timing(rotate, { toValue: 1, duration: 50, useNativeDriver: false }),
            Animated.timing(rotate, { toValue: 0, duration: 50, useNativeDriver: false }),
          ]),
        ]),
      ]).start();
    } else if (face === 'angry') {
      // Violent fast shake
      Animated.sequence([
        Animated.delay(60),
        Animated.timing(rotate, { toValue: 1.2, duration: 40, useNativeDriver: false }),
        Animated.timing(rotate, { toValue: -1.2, duration: 40, useNativeDriver: false }),
        Animated.timing(rotate, { toValue: 1.2, duration: 40, useNativeDriver: false }),
        Animated.timing(rotate, { toValue: -1.2, duration: 40, useNativeDriver: false }),
        Animated.timing(rotate, { toValue: 1, duration: 40, useNativeDriver: false }),
        Animated.timing(rotate, { toValue: -1, duration: 40, useNativeDriver: false }),
        Animated.timing(rotate, { toValue: 0, duration: 40, useNativeDriver: false }),
      ]).start();
    } else if (face === 'dazed') {
      // Heavy slow droop with sideways wobble
      Animated.parallel([
        Animated.sequence([
          Animated.timing(bounce, { toValue: -8, duration: 100, useNativeDriver: false }),
          Animated.timing(bounce, { toValue: 18, duration: 600, easing: Easing.bounce, useNativeDriver: false }),
        ]),
        Animated.timing(rotate, { toValue: 0.5, duration: 700, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
      ]).start();
    } else if (face === 'overIt') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(rotate, { toValue: 0.4, duration: 1200, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
          Animated.timing(rotate, { toValue: -0.4, duration: 1200, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
        ])
      ).start();
    }
  }, [face]);

  const rotateInterp = rotate.interpolate({ inputRange: [-1, 1], outputRange: ['-8deg', '8deg'] });

  // Tint background crossfades from prev tint to next tint
  const tintBg = tintAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [prevFace ? TINT[prevFace] : TINT[currentFace], TINT[currentFace]],
  });

  const faceSize = size * 0.85;

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <Animated.View
        style={[
          styles.tint,
          { backgroundColor: tintBg, width: size, height: size, borderRadius: size / 2 },
        ]}
      />

      {/* Outgoing face (fades out) */}
      {prevFace && (
        <Animated.View
          style={[
            styles.faceLayer,
            { opacity: prevOpacity },
          ]}
        >
          <Image
            source={FACE_IMAGES[prevFace]}
            style={{ width: faceSize, height: faceSize }}
            resizeMode="contain"
          />
        </Animated.View>
      )}

      {/* Incoming face (fades in + scales + reaction motion) */}
      <Animated.View
        style={[
          styles.faceLayer,
          {
            opacity: nextOpacity,
            transform: [
              { scale: nextScale },
              { scale: popScale },
              { translateY: bounce },
              { rotate: rotateInterp },
            ],
          },
        ]}
      >
        <Image
          source={FACE_IMAGES[currentFace]}
          style={{ width: faceSize, height: faceSize }}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tint: {
    position: 'absolute',
  },
  faceLayer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
