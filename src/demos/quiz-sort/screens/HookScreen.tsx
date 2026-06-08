import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import Knowie from '../components/Knowie';
import { KU } from '../theme';

type Props = { onStart: () => void };

// Hook beats:
//   beat 0  → black screen
//   beat 1  → "Do not study AP Math" punches in
//   beat 2  → "here's why" appears under it
//   beat 3  → "tap to find out" pill + Knowie peeks in overIt
export default function HookScreen({ onStart }: Props) {
  const line1Opacity = useRef(new Animated.Value(0)).current;
  const line1Scale = useRef(new Animated.Value(0.88)).current;
  const line2Opacity = useRef(new Animated.Value(0)).current;
  const line2Y = useRef(new Animated.Value(12)).current;
  const cueOpacity = useRef(new Animated.Value(0)).current;
  const knowieY = useRef(new Animated.Value(60)).current;
  const knowieOpacity = useRef(new Animated.Value(0)).current;
  const tapPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(220),
      Animated.parallel([
        Animated.timing(line1Opacity, { toValue: 1, duration: 260, useNativeDriver: false }),
        Animated.spring(line1Scale, { toValue: 1, friction: 5, tension: 140, useNativeDriver: false }),
      ]),
      Animated.delay(900),
      Animated.parallel([
        Animated.timing(line2Opacity, { toValue: 1, duration: 320, useNativeDriver: false }),
        Animated.timing(line2Y, { toValue: 0, duration: 320, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
      ]),
      Animated.delay(520),
      Animated.parallel([
        Animated.timing(cueOpacity, { toValue: 1, duration: 280, useNativeDriver: false }),
        Animated.timing(knowieOpacity, { toValue: 1, duration: 280, useNativeDriver: false }),
        Animated.spring(knowieY, { toValue: 0, friction: 6, tension: 90, useNativeDriver: false }),
      ]),
    ]).start();

    // Idle pulse on the tap cue once it's visible
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(tapPulse, { toValue: 1.08, duration: 720, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
        Animated.timing(tapPulse, { toValue: 1, duration: 720, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
      ])
    );
    const t = setTimeout(() => pulse.start(), 2400);
    return () => {
      clearTimeout(t);
      pulse.stop();
    };
  }, []);

  return (
    <Pressable style={styles.root} onPress={onStart}>
      <View style={styles.center}>
        <Animated.Text
          style={[
            styles.line1,
            { opacity: line1Opacity, transform: [{ scale: line1Scale }] },
          ]}
        >
          do not study{'\n'}AP Math
        </Animated.Text>

        <Animated.Text
          style={[
            styles.line2,
            { opacity: line2Opacity, transform: [{ translateY: line2Y }] },
          ]}
        >
          here's why ↓
        </Animated.Text>
      </View>

      <Animated.View style={[styles.knowieWrap, { opacity: knowieOpacity, transform: [{ translateY: knowieY }] }]}>
        <Knowie face="overIt" size={150} />
      </Animated.View>

      <Animated.View
        style={[
          styles.tapPill,
          { opacity: cueOpacity, transform: [{ scale: tapPulse }] },
        ]}
      >
        <Text style={styles.tapPillText}>tap to take the AP Math test</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: KU.bg,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 140,
    paddingHorizontal: 24,
  },
  center: {
    alignItems: 'center',
  },
  line1: {
    color: KU.textPrimary,
    fontSize: 52,
    fontWeight: '900',
    textAlign: 'center',
    lineHeight: 58,
    letterSpacing: -1.2,
  },
  line2: {
    marginTop: 22,
    color: KU.accentGreen,
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -0.4,
  },
  knowieWrap: {
    position: 'absolute',
    bottom: 180,
    alignItems: 'center',
  },
  tapPill: {
    position: 'absolute',
    bottom: 130,
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 999,
    backgroundColor: KU.bgElevated,
    borderWidth: 1,
    borderColor: KU.border,
  },
  tapPillText: {
    color: KU.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
});
