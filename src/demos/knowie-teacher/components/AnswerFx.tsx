import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Easing, StyleSheet, View } from 'react-native';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

type Props = {
  mode: 'correct' | 'wrong' | null;
  trigger: number;
  onDone?: () => void;
};

const CONFETTI_EMOJIS = ['🎉', '✨', '⭐', '💥', '🔥', '💯'];
const CONFETTI_COUNT = 18;

// Pre-randomized particle launch params, regenerated each trigger.
function makeParticles() {
  return Array.from({ length: CONFETTI_COUNT }).map((_, i) => ({
    emoji: CONFETTI_EMOJIS[i % CONFETTI_EMOJIS.length],
    // initial angle around the circle
    angle: (i / CONFETTI_COUNT) * Math.PI * 2 + (Math.random() - 0.5) * 0.4,
    distance: 180 + Math.random() * 140,
    rotation: (Math.random() - 0.5) * 720,
    size: 22 + Math.random() * 14,
    delay: Math.random() * 80,
  }));
}

export default function AnswerFx({ mode, trigger, onDone }: Props) {
  const flash = useRef(new Animated.Value(0)).current;
  const shake = useRef(new Animated.Value(0)).current;
  const particles = useRef(makeParticles()).current;
  const particleAnims = useRef(particles.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    if (!mode || trigger === 0) return;

    // Regenerate particle layout for each trigger
    const newParts = makeParticles();
    particles.forEach((_, i) => Object.assign(particles[i], newParts[i]));

    flash.setValue(0);
    shake.setValue(0);
    particleAnims.forEach((a) => a.setValue(0));

    // Flash overlay — wrong is shorter + dimmer so it doesn't drown out Knowie's face.
    const flashIn = mode === 'wrong' ? 50 : 80;
    const flashOut = mode === 'wrong' ? 180 : 380;
    Animated.sequence([
      Animated.timing(flash, {
        toValue: 1,
        duration: flashIn,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(flash, {
        toValue: 0,
        duration: flashOut,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();

    if (mode === 'correct') {
      // Burst confetti outward
      particleAnims.forEach((a, i) => {
        Animated.sequence([
          Animated.delay(particles[i].delay),
          Animated.timing(a, {
            toValue: 1,
            duration: 900 + Math.random() * 300,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]).start();
      });
    } else {
      // Screen-shake on wrong
      Animated.sequence([
        Animated.timing(shake, { toValue: 1, duration: 50, useNativeDriver: true }),
        Animated.timing(shake, { toValue: -1, duration: 50, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 1, duration: 50, useNativeDriver: true }),
        Animated.timing(shake, { toValue: -1, duration: 50, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start(() => onDone?.());
    }
  }, [trigger, mode]);

  if (!mode) return null;

  // Wrong flash is much dimmer than correct so the red doesn't tint Knowie's face into oblivion.
  const flashBg = mode === 'correct' ? 'rgba(0,201,80,0.35)' : 'rgba(251,44,54,0.16)';

  const shakeInterp = shake.interpolate({
    inputRange: [-1, 1],
    outputRange: [-10, 10],
  });

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {/* Color flash */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: flashBg, opacity: flash },
        ]}
      />

      {/* Screen shake wrapper (for wrong only — we shake the flash layer subtly) */}
      {mode === 'wrong' && (
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            { transform: [{ translateX: shakeInterp }] },
          ]}
        />
      )}

      {/* Confetti burst (correct only) */}
      {mode === 'correct' &&
        particles.map((p, i) => {
          const cx = SCREEN_W / 2;
          const cy = SCREEN_H * 0.32; // burst from where Knowie sits
          const tx = particleAnims[i].interpolate({
            inputRange: [0, 1],
            outputRange: [0, Math.cos(p.angle) * p.distance],
          });
          const ty = particleAnims[i].interpolate({
            inputRange: [0, 1],
            outputRange: [0, Math.sin(p.angle) * p.distance + 120],
          });
          const rot = particleAnims[i].interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', `${p.rotation}deg`],
          });
          const opacity = particleAnims[i].interpolate({
            inputRange: [0, 0.15, 0.85, 1],
            outputRange: [0, 1, 1, 0],
          });
          return (
            <Animated.Text
              key={i}
              style={{
                position: 'absolute',
                left: cx,
                top: cy,
                fontSize: p.size,
                opacity,
                transform: [{ translateX: tx }, { translateY: ty }, { rotate: rot }],
              }}
            >
              {p.emoji}
            </Animated.Text>
          );
        })}
    </View>
  );
}
