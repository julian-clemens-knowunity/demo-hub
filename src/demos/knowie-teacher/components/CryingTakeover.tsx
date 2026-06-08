import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Easing, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { KU } from '../theme';

const { width: SCREEN_W } = Dimensions.get('window');
// Banner-sized Knowie: bigger of full screen width or 480, capped to fit comfortably.
const CRY_SIZE = Math.min(SCREEN_W * 0.95, 520);

// Escalating crying frames — cycles through to make Knowie ramp up into a full sob.
const CRY_FRAMES = [
  require('../../assets/cry-small.png'),
  require('../../assets/cry-medium.png'),
  require('../../assets/cry-medium-2.png'),
  require('../../assets/cry-full.png'),
];
// Frame hold times: snap through the first three (100ms each), then settle on cry-full (500ms loop).
const FRAME_HOLD_MS = [100, 100, 100, 500];

type Props = {
  visible: boolean;
  onDismiss: () => void;
  headline?: string;
  subline?: string;
  hint?: string;
};

export default function CryingTakeover({
  visible,
  onDismiss,
  headline = 'STOP IT',
  subline = "You're killing me",
  hint = 'tap to dismiss',
}: Props) {
  const fade = useRef(new Animated.Value(0)).current;
  const knowieScale = useRef(new Animated.Value(0.3)).current;
  const shake = useRef(new Animated.Value(0)).current;
  const headlinePulse = useRef(new Animated.Value(1)).current;
  const frameSwap = useRef(new Animated.Value(1)).current;
  const redPulse = useRef(new Animated.Value(0)).current;
  const [frameIdx, setFrameIdx] = useState(0);
  const frameTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!visible) {
      fade.setValue(0);
      knowieScale.setValue(0.3);
      setFrameIdx(0);
      if (frameTimerRef.current) {
        clearTimeout(frameTimerRef.current);
        frameTimerRef.current = null;
      }
      return;
    }

    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.spring(knowieScale, {
        toValue: 1,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();

    const shakeLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(shake, { toValue: 1, duration: 90, useNativeDriver: true }),
        Animated.timing(shake, { toValue: -1, duration: 90, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 0, duration: 90, useNativeDriver: true }),
        Animated.delay(120),
      ])
    );
    shakeLoop.start();

    const headlineLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(headlinePulse, { toValue: 1.15, duration: 360, useNativeDriver: true }),
        Animated.timing(headlinePulse, { toValue: 1, duration: 360, useNativeDriver: true }),
      ])
    );
    headlineLoop.start();

    // Strobing red intensity layer — pulses brighter / darker to feel siren-like.
    const redLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(redPulse, { toValue: 1, duration: 280, easing: Easing.out(Easing.quad), useNativeDriver: false }),
        Animated.timing(redPulse, { toValue: 0.4, duration: 280, easing: Easing.in(Easing.quad), useNativeDriver: false }),
      ])
    );
    redLoop.start();

    // Frame escalation: small (100ms) → medium (100ms) → medium-2 (100ms) → full (500ms loop).
    // After reaching the last frame we hold there indefinitely; each refresh keeps the swap alive.
    setFrameIdx(0);
    const advanceFrame = (i: number) => {
      const nextIdx = i < CRY_FRAMES.length - 1 ? i + 1 : CRY_FRAMES.length - 1;
      frameSwap.setValue(0.92);
      Animated.spring(frameSwap, {
        toValue: 1,
        friction: 5,
        tension: 200,
        useNativeDriver: true,
      }).start();
      setFrameIdx(nextIdx);
      frameTimerRef.current = setTimeout(() => advanceFrame(nextIdx), FRAME_HOLD_MS[nextIdx]);
    };
    frameTimerRef.current = setTimeout(() => advanceFrame(0), FRAME_HOLD_MS[0]);

    return () => {
      shakeLoop.stop();
      headlineLoop.stop();
      redLoop.stop();
      if (frameTimerRef.current) {
        clearTimeout(frameTimerRef.current);
        frameTimerRef.current = null;
      }
    };
  }, [visible]);

  if (!visible) return null;

  const shakeInterp = shake.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-3deg', '3deg'],
  });

  // Red strobe: interpolate from dim red to vivid bright red
  const redBg = redPulse.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(180,10,20,0.92)', 'rgba(255,40,55,0.98)'],
  });

  return (
    <Animated.View style={[styles.root, { opacity: fade }]} pointerEvents="box-none">
      {/* Red strobing layer (JS driver — must be on its own View so it doesn't mix with the native opacity driver above) */}
      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, { backgroundColor: redBg }]}
      />

      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={onDismiss}
      />

      <View style={styles.center} pointerEvents="none">
        <Animated.Text
          style={[
            styles.headline,
            { transform: [{ scale: headlinePulse }] },
          ]}
        >
          {headline}
        </Animated.Text>

        <Animated.View
          style={{
            transform: [
              { scale: knowieScale },
              { scale: frameSwap },
              { rotate: shakeInterp },
            ],
          }}
        >
          <Image
            source={CRY_FRAMES[frameIdx]}
            style={styles.cryImage}
            resizeMode="contain"
          />
        </Animated.View>

        <Text style={styles.subline}>{subline}</Text>
        <Text style={styles.hint}>{hint}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 9999,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headline: {
    fontSize: 64,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -1.5,
    marginBottom: 12,
    textShadowColor: 'rgba(0,0,0,0.45)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  subline: {
    fontSize: 22,
    color: '#FFFFFF',
    marginTop: 12,
    fontWeight: '800',
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  hint: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 24,
  },
  cryImage: {
    width: CRY_SIZE,
    height: CRY_SIZE,
  },
});
