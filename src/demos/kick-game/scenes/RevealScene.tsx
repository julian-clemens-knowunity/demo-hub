import React, { forwardRef, useImperativeHandle, useEffect, useRef } from 'react';
import { Animated, Dimensions, Easing, StyleSheet, Text, View } from 'react-native';
const Ionicons = ({ name, size = 22, color = '#fff' }: { name: string; size?: number; color?: string }) => {
  const icons: Record<string, string> = {
    menu: '☰',
    hourglass: '⧗',
    add: '+',
    'camera-outline': '📷',
    'mic-outline': '🎤',
  };
  return <Text style={{ fontSize: size, color, lineHeight: size + 2 }}>{icons[name] || '•'}</Text>;
};
import { play, stop } from '../sounds';
import type { SceneHandle, SceneProps } from '../types';

import standby from '../assets/standby.png';
import excited from '../assets/excited.png';

const { width: SW, height: SH } = Dimensions.get('window');

const RevealScene = forwardRef<SceneHandle, SceneProps>((_props, ref) => {
  // Black bg shows instantly on mount — no fade-in transition.
  const sceneFade = useRef(new Animated.Value(1)).current;
  const darkBgOp = useRef(new Animated.Value(0)).current;
  // Start Knowie fully off-screen below — he slides UP from the bottom.
  const knowieY = useRef(new Animated.Value(SH)).current;
  const knowieScale = useRef(new Animated.Value(0.85)).current;
  const knowieFace = useRef(new Animated.Value(0)).current;
  const knowieBob = useRef(new Animated.Value(0)).current;

  const greetOp = useRef(new Animated.Value(0)).current;
  const greetScale = useRef(new Animated.Value(0.85)).current;

  const headerOp = useRef(new Animated.Value(0)).current;
  const barY = useRef(new Animated.Value(180)).current;
  const barOp = useRef(new Animated.Value(0)).current;
  const ctaOp = useRef(new Animated.Value(0)).current;
  const ctaY = useRef(new Animated.Value(18)).current;

  useEffect(() => {
    // Cut the background music ABRUPTLY the moment Knowie starts appearing
    // (end of black-screen hold, start of slide-up). Pure silence covers
    // the slide + face flip.
    const musicCutTimer = setTimeout(() => { stop('intro'); }, 1000);

    // SIKE — fires only AFTER Knowie is fully in the frame.
    // initialHold (1000) + slide (300) + faceFlip (100) = 1400ms.
    const knowieSoundTimer = setTimeout(() => { play('sike'); }, 1400);

    Animated.sequence([
      // Hold on the black screen for a beat before Knowie pops up.
      Animated.delay(1000),
      // Knowie slides UP from below — 300ms smooth deceleration (no overshoot)
      Animated.parallel([
        Animated.timing(knowieY, { toValue: 0, duration: 300, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
        Animated.timing(knowieScale, { toValue: 1, duration: 300, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
      ]),
      Animated.timing(knowieFace, { toValue: 1, duration: 100, useNativeDriver: false }),
      // Hold on Knowie until the 2000ms mark, then the homepage pops in.
      // faceFlip (100) + delay (400) = 500ms wait after knowie spring ends.
      Animated.delay(400),
      // Chat POPS in — snappy 100ms burst, back-easing for that pop feel.
      Animated.parallel([
        Animated.timing(darkBgOp, { toValue: 1, duration: 100, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
        Animated.timing(greetOp, { toValue: 1, duration: 100, useNativeDriver: false }),
        Animated.timing(greetScale, { toValue: 1, duration: 100, easing: Easing.out(Easing.back(2)), useNativeDriver: false }),
        Animated.timing(headerOp, { toValue: 1, duration: 100, useNativeDriver: false }),
        Animated.timing(barY, { toValue: 0, duration: 100, easing: Easing.out(Easing.back(1.8)), useNativeDriver: false }),
        Animated.timing(barOp, { toValue: 1, duration: 100, useNativeDriver: false }),
        Animated.timing(ctaOp, { toValue: 1, duration: 100, useNativeDriver: false }),
        Animated.timing(ctaY, { toValue: 0, duration: 100, easing: Easing.out(Easing.back(1.8)), useNativeDriver: false }),
      ]),
    ]).start();

    // No outro sound — music was already cut at the 1000ms mark when
    // Knowie started appearing, and the SIKE is the only sting.

    const bobLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(knowieBob, { toValue: -8, duration: 900, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
        Animated.timing(knowieBob, { toValue: 0, duration: 900, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
      ])
    );
    bobLoop.start();
    return () => { bobLoop.stop(); clearTimeout(musicCutTimer); clearTimeout(knowieSoundTimer); };
  }, [darkBgOp, knowieY, knowieScale, knowieFace, greetOp, greetScale, headerOp, barY, barOp, ctaOp, ctaY, knowieBob]);

  useImperativeHandle(ref, () => ({ onFlick: () => {} }));

  return (
    <Animated.View style={[styles.root, { opacity: sceneFade }]}>
      {/* clean white stage Knowie pops up onto */}
      <View style={styles.whiteLayer} pointerEvents="none" />

      {/* dark KU bg crossfades over the white bg → reveals the chat screen */}
      <Animated.View style={[styles.darkLayer, { opacity: darkBgOp }]} pointerEvents="none" />

      {/* Header pills (KU app chrome) */}
      <Animated.View style={[styles.header, { opacity: headerOp }]}>
        <View style={styles.headerPill}><Ionicons name="menu" size={22} color="#FFFFFF" /></View>
        <View style={styles.statsRow}>
          <View style={styles.statPill}><Text style={styles.statText}>⚡ 0</Text></View>
          <View style={styles.statPill}><Text style={styles.statText}>🔥 2</Text></View>
        </View>
        <View style={styles.headerPill}><Ionicons name="hourglass" size={20} color="#FFFFFF" /></View>
      </Animated.View>

      {/* Knowie — centered, springs up first */}
      <Animated.View
        style={[
          styles.knowieSlot,
          { transform: [{ translateY: Animated.add(knowieY, knowieBob) }, { scale: knowieScale }] },
        ]}
      >
        <Animated.Image
          source={standby}
          style={[styles.knowie, { opacity: knowieFace.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }) }]}
        />
        <Animated.Image source={excited} style={[styles.knowie, styles.knowieAbs, { opacity: knowieFace }]} />
      </Animated.View>

      {/* greeting appears with the dark transition */}
      <Animated.View
        style={[
          styles.greetWrap,
          { opacity: greetOp, transform: [{ scale: greetScale }] },
        ]}
      >
        <Text style={styles.greet}>what are we{'\n'}working on today?</Text>
      </Animated.View>

      {/* "Go study." tagline */}
      <Animated.View style={[styles.ctaWrap, { opacity: ctaOp, transform: [{ translateY: ctaY }] }]}>
        <Text style={styles.cta}>Go study.</Text>
      </Animated.View>

      {/* KU AI search bar — the punchline */}
      <Animated.View
        style={[
          styles.barWrap,
          { opacity: barOp, transform: [{ translateY: barY }] },
        ]}
      >
        <View style={styles.searchBar}>
          <View style={styles.barIconBtn}>
            <Ionicons name="add" size={22} color="#FFFFFF" />
          </View>
          <Text style={styles.placeholder}>Ask anything…</Text>
          <View style={styles.barIconRow}>
            <Ionicons name="camera-outline" size={20} color="rgba(255,255,255,0.5)" />
            <View style={{ width: 12 }} />
            <Ionicons name="mic-outline" size={20} color="rgba(255,255,255,0.5)" />
          </View>
        </View>
      </Animated.View>
    </Animated.View>
  );
});

export default RevealScene;

const KNOWIE_SIZE = 220;
// Vertical center of where Knowie lands. Was 0.34 (upper third) — bumped
// down so he reads as centered on the screen, not floating at the top.
const KNOWIE_CENTER_Y = SH * 0.45;

const styles = StyleSheet.create({
  root: { ...StyleSheet.absoluteFillObject, backgroundColor: '#000000' },
  whiteLayer: { ...StyleSheet.absoluteFillObject, backgroundColor: '#000000' },
  darkLayer: { ...StyleSheet.absoluteFillObject, backgroundColor: '#000000' },

  header: {
    position: 'absolute',
    top: 70,
    left: 0, right: 0,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerPill: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#1A1A1A',
    alignItems: 'center', justifyContent: 'center',
  },
  statsRow: { flexDirection: 'row', gap: 8 },
  statPill: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 18,
    backgroundColor: '#1A1A1A',
    alignItems: 'center', justifyContent: 'center',
  },
  statText: { color: '#FFFFFF', fontFamily: 'Inter', fontWeight: '700', fontSize: 14 },

  knowieSlot: {
    position: 'absolute',
    left: SW / 2 - KNOWIE_SIZE / 2,
    top: KNOWIE_CENTER_Y - KNOWIE_SIZE / 2,
    width: KNOWIE_SIZE,
    height: KNOWIE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  knowie: { width: KNOWIE_SIZE, height: KNOWIE_SIZE, resizeMode: 'contain' },
  knowieAbs: { position: 'absolute', top: 0, left: 0 },

  greetWrap: {
    position: 'absolute',
    left: 0, right: 0,
    top: KNOWIE_CENTER_Y + KNOWIE_SIZE / 2 + 10,
    alignItems: 'center',
  },
  greet: {
    fontFamily: 'Inter', fontWeight: '700',
    fontSize: 28,
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: -0.6,
    lineHeight: 34,
  },

  ctaWrap: {
    position: 'absolute',
    left: 0, right: 0,
    bottom: 156,
    alignItems: 'center',
  },
  cta: { fontFamily: 'Inter', fontWeight: '700', fontSize: 36, color: '#FFFFFF', letterSpacing: -0.8 },

  barWrap: {
    position: 'absolute',
    left: 0, right: 0,
    bottom: 60,
    paddingHorizontal: 20,
  },
  searchBar: {
    height: 56,
    borderRadius: 28,
    backgroundColor: '#252525',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  barIconBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#3A3A3A',
    alignItems: 'center', justifyContent: 'center',
  },
  placeholder: {
    flex: 1,
    marginLeft: 12,
    color: 'rgba(255,255,255,0.55)',
    fontFamily: 'Inter', fontWeight: '600',
    fontSize: 16,
  },
  barIconRow: { flexDirection: 'row', alignItems: 'center', paddingRight: 14 },
});
