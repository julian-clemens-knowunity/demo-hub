import React, { forwardRef, useImperativeHandle, useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native';
import { play } from '../sounds';
import { INK } from '../theme';
import type { SceneHandle, SceneProps } from '../types';

const { width: SW, height: SH } = Dimensions.get('window');

import introUrl from '../assets/intro.mp4';

// Matches the solid background colour inside the intro clip so there's no
// visible seam during fade-in / first-frame decode.
const INTRO_BG = '#B0E1FC';

// Native video is 720×872. Fit horizontally — width = screen width, height
// scales proportionally. Vertically centered.
const INTRO_W = SW;
const INTRO_H = Math.round(SW * (872 / 720));
const INTRO_TOP = Math.round((SH - INTRO_H) / 2) + 60;

const TitleScene = forwardRef<SceneHandle, SceneProps>(({ onComplete }, ref) => {
  const fade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    play('intro', { loop: true });
  }, []);

  const advanced = useRef(false);
  const advance = () => {
    if (advanced.current) return;
    advanced.current = true;
    onComplete();
  };

  useImperativeHandle(ref, () => ({
    onFlick: () => advance(),
  }));

  return (
    <Animated.View style={[styles.root, { opacity: fade }]}>
      <View style={styles.intro}>
        <video
          src={introUrl}
          autoPlay
          muted
          playsInline
          onEnded={advance}
          style={{ width: '100%', height: '100%', objectFit: 'contain', background: 'transparent' }}
        />
      </View>

      <Text style={styles.title}>Please flick</Text>
      <Text style={styles.sub}>(Do not touch the screen)</Text>
      <Text style={styles.swipeHint}>swipe →</Text>
    </Animated.View>
  );
});

export default TitleScene;

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: INTRO_BG,
    alignItems: 'center',
  },
  intro: {
    position: 'absolute',
    width: INTRO_W,
    height: INTRO_H,
    top: INTRO_TOP,
    left: 0,
    backgroundColor: 'transparent',
  },
  title: {
    position: 'absolute',
    top: 110,
    fontFamily: 'Inter', fontWeight: '700',
    fontSize: 50,
    color: INK,
    letterSpacing: -1.2,
  },
  sub: {
    position: 'absolute',
    top: 168,
    fontFamily: 'Inter', fontWeight: '600',
    fontSize: 15,
    color: INK,
    opacity: 0.62,
  },
  swipeHint: {
    position: 'absolute',
    bottom: 90,
    fontFamily: 'Inter', fontWeight: '700',
    fontSize: 18,
    color: INK,
    opacity: 0.55,
    letterSpacing: 1,
  },
});
