import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import Knowie from '../components/Knowie';
import { KU } from '../theme';

type Props = { score: number; total: number; onReplay: () => void };

// Closing card. Premise: even getting them all right is the joke.
export default function ResultScreen({ score, total, onReplay }: Props) {
  const cardScale = useRef(new Animated.Value(0.78)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const stampScale = useRef(new Animated.Value(0)).current;
  const stampRot = useRef(new Animated.Value(0)).current;
  const subOpacity = useRef(new Animated.Value(0)).current;
  const replayOpacity = useRef(new Animated.Value(0)).current;
  const flash = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(cardScale, { toValue: 1, friction: 6, tension: 110, useNativeDriver: true }),
        Animated.timing(cardOpacity, { toValue: 1, duration: 320, useNativeDriver: true }),
      ]),
      Animated.delay(220),
      Animated.parallel([
        Animated.timing(flash, { toValue: 1, duration: 80, useNativeDriver: true }),
        Animated.spring(stampScale, { toValue: 1, friction: 4, tension: 200, useNativeDriver: true }),
        Animated.timing(stampRot, { toValue: 1, duration: 320, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]),
      Animated.timing(flash, { toValue: 0, duration: 360, useNativeDriver: true }),
      Animated.delay(220),
      Animated.timing(subOpacity, { toValue: 1, duration: 360, useNativeDriver: true }),
      Animated.delay(360),
      Animated.timing(replayOpacity, { toValue: 1, duration: 320, useNativeDriver: true }),
    ]).start();
  }, []);

  const rot = stampRot.interpolate({ inputRange: [0, 1], outputRange: ['-22deg', '-8deg'] });

  return (
    <View style={styles.root}>
      <Animated.View
        style={[
          styles.card,
          {
            opacity: cardOpacity,
            transform: [{ scale: cardScale }],
          },
        ]}
      >
        <View style={styles.knowieWrap}>
          <Knowie face="laughing" size={170} />
        </View>

        <Text style={styles.eyebrow}>YOUR RESULT</Text>

        <Text style={styles.score}>
          {score}<Text style={styles.scoreOf}>/{total}</Text>
        </Text>

        <Animated.View
          style={[
            styles.stamp,
            { transform: [{ scale: stampScale }, { rotate: rot }] },
          ]}
        >
          <Text style={styles.stampText}>AP MATH{'\n'}PASSED 🎓</Text>
        </Animated.View>

        <Animated.View style={{ opacity: subOpacity, alignItems: 'center' }}>
          <Text style={styles.sub}>congrats, you can read numbers.</Text>
          <Text style={styles.subSmall}>now go major in Business.</Text>
        </Animated.View>
      </Animated.View>

      <Animated.View style={[styles.replayWrap, { opacity: replayOpacity }]}>
        <Pressable onPress={onReplay} style={styles.replayPill}>
          <Text style={styles.replayText}>retake the AP</Text>
        </Pressable>
      </Animated.View>

      <Animated.View pointerEvents="none" style={[styles.flash, { opacity: flash }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: KU.bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    backgroundColor: KU.bgElevated,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: KU.border,
    paddingTop: 36,
    paddingBottom: 36,
    paddingHorizontal: 22,
    alignItems: 'center',
  },
  knowieWrap: {
    marginBottom: 6,
  },
  eyebrow: {
    color: KU.accentGreen,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1.6,
    marginTop: 4,
  },
  score: {
    color: KU.textPrimary,
    fontSize: 100,
    fontWeight: '900',
    letterSpacing: -3,
    lineHeight: 110,
    marginTop: 2,
  },
  scoreOf: {
    color: KU.textMuted,
    fontSize: 48,
    fontWeight: '800',
    letterSpacing: -1.2,
  },
  stamp: {
    marginTop: 6,
    marginBottom: 22,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderWidth: 4,
    borderColor: KU.accentGreen,
    borderRadius: 14,
    backgroundColor: 'rgba(0,201,80,0.10)',
  },
  stampText: {
    color: KU.accentGreen,
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1.2,
    textAlign: 'center',
    lineHeight: 24,
  },
  sub: {
    color: KU.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  subSmall: {
    marginTop: 6,
    color: KU.textSecondary,
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  replayWrap: {
    position: 'absolute',
    bottom: 130,
    alignItems: 'center',
  },
  replayPill: {
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 999,
    backgroundColor: KU.bgElevated,
    borderWidth: 1,
    borderColor: KU.border,
  },
  replayText: {
    color: KU.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  flash: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: '#FFFFFF',
  },
});
