import React, { forwardRef, useImperativeHandle, useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Easing, StyleSheet, Vibration } from 'react-native';
import Background from '../components/Background';
import SodaCan, { CanColorKey } from '../components/SodaCan';
import ImpactStar from '../components/ImpactStar';
import { playImpact } from '../sounds';
import { setBodyBg } from '../setBodyBg';
import { BG_FLOOR } from '../theme';
import type { SceneHandle, SceneProps } from '../types';

const { width: SW, height: SH } = Dimensions.get('window');

const CAN_COLORS: CanColorKey[] = ['red', 'green', 'yellow', 'blue'];
const NUM_CANS = CAN_COLORS.length;
const CAN_SIZE = 140;
// Can SVG renders at CAN_SIZE × CAN_SIZE * 1.55. Use that exactly so the
// bounding box bottom == can bottom == floor (no gap, no floating).
const CAN_H = CAN_SIZE * 1.55;
// Floor line — must match Background's HORIZON_PCT (=0.6)
const FLOOR_TOP = SH * 0.6;
const CAN_X = SW * 0.5 - CAN_SIZE / 2;
const CAN_Y = FLOOR_TOP - CAN_H;
const OFF_RIGHT = SW * 0.65;
// Impact star — centered on the takeoff spot at floor level
const STAR_SIZE = 200;
const STAR_LEFT = SW * 0.5 - STAR_SIZE / 2;
const STAR_TOP = FLOOR_TOP - STAR_SIZE / 2;

const MultiCanScene = forwardRef<SceneHandle, SceneProps>(({ onComplete }, ref) => {
  const fade = useRef(new Animated.Value(1)).current;
  const tx = useRef(new Animated.Value(OFF_RIGHT)).current;
  const ty = useRef(new Animated.Value(0)).current;
  const rot = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const shake = useRef(new Animated.Value(0)).current;
  const impactOp = useRef(new Animated.Value(0)).current;
  const impactScale = useRef(new Animated.Value(0.4)).current;
  const [showCrack, setShowCrack] = useState(false);
  const [colorIdx, setColorIdx] = useState(0);
  const kickedCountRef = useRef(0);
  const animating = useRef(false);

  const slideInNext = (nextColorIdx: number) => {
    tx.setValue(OFF_RIGHT);
    ty.setValue(0);
    rot.setValue(0);
    scale.setValue(1);
    shake.setValue(0);
    setShowCrack(false);
    setColorIdx(nextColorIdx);
    Animated.spring(tx, { toValue: 0, useNativeDriver: false, bounciness: 8, speed: 9 }).start();
  };

  useEffect(() => {
    setBodyBg(BG_FLOOR);
    Animated.spring(tx, { toValue: 0, useNativeDriver: false, bounciness: 8, speed: 11 }).start();
  }, [tx]);

  useImperativeHandle(ref, () => ({
    onFlick: (vx) => {
      if (animating.current) return;
      if (kickedCountRef.current >= NUM_CANS) return;
      animating.current = true;
      playImpact();
      Vibration.vibrate(36);
      // ALWAYS launch left, regardless of flick direction.
      const dirX = -1;
      void vx;

      // Flash the crack on impact
      setShowCrack(true);
      // Quick hit shake (object recoils before launching)
      Animated.sequence([
        Animated.timing(shake, { toValue: -dirX * 8, duration: 50, useNativeDriver: false }),
        Animated.timing(shake, { toValue: dirX * 4, duration: 50, useNativeDriver: false }),
        Animated.timing(shake, { toValue: 0, duration: 50, useNativeDriver: false }),
      ]).start();
      // Comic-style impact starburst pops in on the floor and lingers briefly
      impactOp.setValue(1);
      impactScale.setValue(0.4);
      Animated.parallel([
        Animated.spring(impactScale, { toValue: 1, useNativeDriver: false, bounciness: 14, speed: 11 }),
        Animated.sequence([
          Animated.delay(450),
          Animated.timing(impactOp, { toValue: 0, duration: 350, useNativeDriver: false }),
        ]),
      ]).start();

      Animated.sequence([
        Animated.timing(scale, { toValue: 0.82, duration: 100, useNativeDriver: false }),
        Animated.parallel([
          Animated.timing(scale, { toValue: 1, duration: 150, useNativeDriver: false }),
          Animated.timing(tx, { toValue: dirX * SW * 1.2, duration: 900, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
          Animated.timing(ty, { toValue: -SH * 0.55, duration: 900, easing: Easing.out(Easing.quad), useNativeDriver: false }),
          Animated.timing(rot, { toValue: dirX * 4, duration: 900, easing: Easing.linear, useNativeDriver: false }),
        ]),
      ]).start(() => {
        const newCount = kickedCountRef.current + 1;
        kickedCountRef.current = newCount;
        if (newCount >= NUM_CANS) {
          onComplete();
        } else {
          slideInNext(newCount % CAN_COLORS.length);
          animating.current = false;
        }
      });
    },
  }));

  const rotStr = rot.interpolate({ inputRange: [-4, 4], outputRange: ['-1440deg', '1440deg'] });

  return (
    <Animated.View style={[styles.root, { opacity: fade }]}>
      <Background ground />

      {/* comic impact starburst — left behind on the floor where the can launched from */}
      <Animated.View
        style={[
          styles.impactSlot,
          { opacity: impactOp, transform: [{ scale: impactScale }] },
        ]}
        pointerEvents="none"
      >
        <ImpactStar size={STAR_SIZE} />
      </Animated.View>

      <Animated.View
        style={[
          styles.canSlot,
          {
            transform: [
              { translateX: Animated.add(tx, shake) },
              { translateY: ty },
              { rotate: rotStr },
              { scale },
            ],
          },
        ]}
      >
        <SodaCan size={CAN_SIZE} color={CAN_COLORS[colorIdx]} cracked={showCrack} />
      </Animated.View>

    </Animated.View>
  );
});

export default MultiCanScene;

const styles = StyleSheet.create({
  root: { ...StyleSheet.absoluteFillObject },
  canSlot: {
    position: 'absolute',
    left: CAN_X,
    top: CAN_Y,
    width: CAN_SIZE,
    height: CAN_H,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  impactSlot: {
    position: 'absolute',
    left: STAR_LEFT,
    top: STAR_TOP,
    width: STAR_SIZE,
    height: STAR_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
