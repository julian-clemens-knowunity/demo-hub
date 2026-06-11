import React, { forwardRef, useImperativeHandle, useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Easing, StyleSheet, Vibration, View } from 'react-native';
import Background from '../components/Background';
import PunchingBag from '../components/PunchingBag';
import ImpactLines from '../components/ImpactLines';
import { play, playImpact } from '../sounds';
import type { SceneHandle, SceneProps } from '../types';

const { width: SW, height: SH } = Dimensions.get('window');

const NUM_PUNCHES = 3;
const BAG_W = 240;
const BAG_H = BAG_W * 2.2;
const TOP_Y = SH * 0.5 - BAG_H * 0.5 + 30;

const MultiBagScene = forwardRef<SceneHandle, SceneProps>(({ onComplete }, ref) => {
  const fade = useRef(new Animated.Value(1)).current;
  // Pendulum swing — bag pivots from the chain at the top.
  const swing = useRef(new Animated.Value(0)).current;
  const squashX = useRef(new Animated.Value(1)).current;
  const squashY = useRef(new Animated.Value(1)).current;
  const drop = useRef(new Animated.Value(0)).current;

  // Fly-off on the final punch — clean upper-left arc, no rotation
  // (rotating a chain-pivoted bag swings the body wildly; skip it).
  const launchX = useRef(new Animated.Value(0)).current;
  const launchY = useRef(new Animated.Value(0)).current;

  const impactOp = useRef(new Animated.Value(0)).current;
  const [impactSide, setImpactSide] = useState<'left' | 'right'>('left');

  const [punchCount, setPunchCount] = useState(0);
  const punchRef = useRef(0);
  const animating = useRef(false);

  useEffect(() => {}, []);

  useImperativeHandle(ref, () => ({
    onFlick: (vx) => {
      if (animating.current) return;
      if (punchRef.current >= NUM_PUNCHES) return;
      animating.current = true;
      const nextPunch = punchRef.current + 1;
      punchRef.current = nextPunch;
      setPunchCount(nextPunch);
      const isFinal = nextPunch >= NUM_PUNCHES;
      if (isFinal) play('shatter');
      else playImpact();
      Vibration.vibrate(isFinal ? 110 : 32);
      const dirX = vx >= 0 ? 1 : -1;

      // Impact lines flash on the side OPPOSITE the swing direction (= where
      // the fist landed). Right-flick = swing right = impact on the left.
      setImpactSide(dirX > 0 ? 'left' : 'right');
      impactOp.setValue(1);
      Animated.sequence([
        Animated.delay(250),
        Animated.timing(impactOp, { toValue: 0, duration: 300, useNativeDriver: false }),
      ]).start();

      if (isFinal) {
        // Cans-style launch — uniform scale-dip, then fly off LEFT.
        const dir = -1;
        Animated.sequence([
          Animated.parallel([
            Animated.timing(squashX, { toValue: 0.82, duration: 75, useNativeDriver: false }),
            Animated.timing(squashY, { toValue: 0.82, duration: 75, useNativeDriver: false }),
          ]),
          Animated.parallel([
            Animated.timing(squashX, { toValue: 1, duration: 112, useNativeDriver: false }),
            Animated.timing(squashY, { toValue: 1, duration: 112, useNativeDriver: false }),
            Animated.timing(launchX, { toValue: dir * SW * 1.2, duration: 300, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
            Animated.timing(launchY, { toValue: -SH * 0.55, duration: 300, easing: Easing.out(Easing.quad), useNativeDriver: false }),
          ]),
        ]).start(() => {
          onComplete();
        });
        return;
      }

      // Non-final contact squash — visible body-blow stretch.
      Animated.sequence([
        Animated.parallel([
          Animated.timing(squashX, { toValue: 1.18, duration: 110, useNativeDriver: false }),
          Animated.timing(squashY, { toValue: 0.84, duration: 110, useNativeDriver: false }),
        ]),
        Animated.parallel([
          Animated.spring(squashX, { toValue: 1, useNativeDriver: false, bounciness: 14, speed: 8 }),
          Animated.spring(squashY, { toValue: 1, useNativeDriver: false, bounciness: 14, speed: 8 }),
        ]),
      ]).start();

      // Non-final: pendulum swing (total 950ms).
      Animated.sequence([
        Animated.timing(swing, { toValue: dirX * 1.25, duration: 125, easing: Easing.out(Easing.quad), useNativeDriver: false }),
        Animated.timing(swing, { toValue: dirX * -0.7, duration: 260, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
        Animated.timing(swing, { toValue: dirX * 0.38, duration: 235, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
        Animated.timing(swing, { toValue: dirX * -0.18, duration: 175, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
        Animated.timing(swing, { toValue: 0, duration: 155, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
      ]).start(() => {
        animating.current = false;
      });
    },
  }));

  const swingStr = swing.interpolate({ inputRange: [-1.3, 1.3], outputRange: ['-58deg', '58deg'] });
  const hitFace = punchCount > 0;

  return (
    <Animated.View
      style={[styles.root, { opacity: fade }]}
    >
      <Background ground={false} />

      <Animated.View
        style={[
          styles.pivot,
          {
            transform: [
              { translateX: launchX },
              { translateY: Animated.add(drop, launchY) },
              { rotate: swingStr },
              { scaleX: squashX },
              { scaleY: squashY },
            ],
            transformOrigin: 'top center' as any,
          },
        ]}
        pointerEvents="none"
      >
        <PunchingBag size={BAG_W} hit={hitFace} />
      </Animated.View>

      {/* Impact lines flash — left or right side depending on hit direction */}
      <Animated.View
        style={[
          styles.impactSlot,
          impactSide === 'left' ? styles.impactLeft : styles.impactRight,
          { opacity: impactOp },
        ]}
        pointerEvents="none"
      >
        <ImpactLines size={110} flip={impactSide === 'right'} />
      </Animated.View>
    </Animated.View>
  );
});

export default MultiBagScene;

const styles = StyleSheet.create({
  root: { ...StyleSheet.absoluteFillObject },
  pivot: {
    position: 'absolute',
    left: SW / 2 - BAG_W / 2,
    top: TOP_Y,
    width: BAG_W,
    alignItems: 'center',
  },
  impactSlot: {
    position: 'absolute',
    width: 110,
    height: 110,
    top: TOP_Y + BAG_H * 0.4,
  },
  impactLeft: {
    left: SW / 2 - BAG_W / 2 - 70,
  },
  impactRight: {
    left: SW / 2 + BAG_W / 2 - 36,
  },
});
