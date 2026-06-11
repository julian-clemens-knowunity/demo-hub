import React, { forwardRef, useImperativeHandle, useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Easing, StyleSheet, Vibration, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import SoccerGoal, { GOAL_ASPECT, SoccerBall, StickKeeper } from '../components/SoccerGoal';
import { playImpact } from '../sounds';
import { BG_FLOOR, BG_SKY, INK } from '../theme';
import type { SceneHandle, SceneProps } from '../types';

const { width: SW, height: SH } = Dimensions.get('window');

// Layout — goal sits in upper-left third, ball sits centered on the floor.
const FLOOR_TOP = SH * 0.78;

const GOAL_W = Math.min(320, SW * 0.82);
const GOAL_H = GOAL_W * GOAL_ASPECT;
const GOAL_LEFT = 14;
const GOAL_TOP = SH * 0.15;

const BALL = Math.min(180, SW * 0.46);
const BALL_HALF = BALL / 2;
const BALL_X = SW / 2;
const BALL_Y = FLOOR_TOP - BALL_HALF + 6;

// keeper positioning — inside the goal mouth, feet on goal ground bar
const KEEPER_W = 72;
const KEEPER_H = KEEPER_W * 1.4;
const KEEPER_X = GOAL_LEFT + GOAL_W / 2 - KEEPER_W / 2;
const KEEPER_Y = GOAL_TOP + GOAL_H - KEEPER_H - 6;

// 4 shots — all into the upper-left goal. Target offsets from ball center.
const goalCenterX = GOAL_LEFT + GOAL_W / 2;
const goalCenterY = GOAL_TOP + GOAL_H / 2;
const SHOTS = [
  { tx: goalCenterX + GOAL_W * 0.30 - BALL_X, ty: GOAL_TOP + GOAL_H * 0.38 - BALL_Y, pose: 'jump' as const },
  { tx: goalCenterX - GOAL_W * 0.32 - BALL_X, ty: GOAL_TOP + GOAL_H * 0.42 - BALL_Y, pose: 'dive' as const },
  { tx: goalCenterX + GOAL_W * 0.20 - BALL_X, ty: GOAL_TOP + GOAL_H * 0.62 - BALL_Y, pose: 'dive' as const },
  { tx: goalCenterX - BALL_X, ty: goalCenterY - BALL_Y, pose: 'flat' as const },
];

const SoccerScene = forwardRef<SceneHandle, SceneProps>(({ onComplete }, ref) => {
  const fade = useRef(new Animated.Value(1)).current;
  const ballTx = useRef(new Animated.Value(0)).current;
  const ballTy = useRef(new Animated.Value(0)).current;
  const ballRot = useRef(new Animated.Value(0)).current;
  const ballScale = useRef(new Animated.Value(1)).current;
  const ballDrop = useRef(new Animated.Value(0)).current;
  const ballOpacity = useRef(new Animated.Value(1)).current;

  const keeperJump = useRef(new Animated.Value(0)).current;
  const keeperX = useRef(new Animated.Value(0)).current;
  const keeperFlatProg = useRef(new Animated.Value(0)).current;

  const goalOpacity = useRef(new Animated.Value(1)).current;
  const sceneShake = useRef(new Animated.Value(0)).current;

  const [pose, setPose] = useState<'idle' | 'jump' | 'dive' | 'flat'>('idle');
  const [showFlat, setShowFlat] = useState(false);
  const shotRef = useRef(0);
  const animating = useRef(false);

  useEffect(() => {}, []);

  const respawnBall = () => {
    ballTx.setValue(0);
    ballTy.setValue(0);
    ballRot.setValue(0);
    ballScale.setValue(1);
    ballOpacity.setValue(1);
  };

  useImperativeHandle(ref, () => ({
    onFlick: () => {
      if (animating.current) return;
      if (shotRef.current >= SHOTS.length) return;
      animating.current = true;
      const idx = shotRef.current;
      const shot = SHOTS[idx];
      const isFinal = idx === SHOTS.length - 1;
      playImpact();
      Vibration.vibrate(isFinal ? 130 : 24);

      // Keeper dives in the OPPOSITE direction of the ball (except the
      // final shot, which goes flat at center).
      setPose(shot.pose);
      const keeperShift = isFinal ? 0 : shot.tx > 0 ? -36 : 36;

      // Final shot is a touch quicker so the wreckage kicks in sooner.
      const motionMs = isFinal ? 800 : 1100;
      const recedeMs = motionMs - 210; // squash dip (80+130) + recede = motionMs
      Animated.parallel([
        // Squash dip on takeoff, then ball recedes (shrinks) as it travels
        // into the background toward the goal.
        Animated.sequence([
          Animated.timing(ballScale, { toValue: 0.78, duration: 80, useNativeDriver: false }),
          Animated.timing(ballScale, { toValue: 1, duration: 130, useNativeDriver: false }),
          Animated.timing(ballScale, { toValue: 0.30, duration: recedeMs, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
        ]),
        Animated.timing(ballTx, { toValue: shot.tx, duration: motionMs, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
        Animated.timing(ballTy, { toValue: shot.ty, duration: motionMs, easing: Easing.out(Easing.quad), useNativeDriver: false }),
        Animated.timing(ballRot, { toValue: 4, duration: motionMs, easing: Easing.linear, useNativeDriver: false }),
        // keeper reaction
        Animated.sequence([
          Animated.delay(140),
          Animated.parallel([
            Animated.timing(keeperJump, {
              toValue: shot.pose === 'jump' ? 1 : shot.pose === 'dive' ? 0.5 : 0.2,
              duration: 420, useNativeDriver: false,
            }),
            Animated.timing(keeperX, { toValue: keeperShift, duration: 420, useNativeDriver: false }),
          ]),
        ]),
      ]).start(() => {
        const nextIdx = idx + 1;
        shotRef.current = nextIdx;

        if (isFinal) {
          // GOAL OBLITERATED + keeper laid flat on the floor
          setShowFlat(true);
          Animated.parallel([
            Animated.timing(ballOpacity, { toValue: 0, duration: 150, useNativeDriver: false }),
            Animated.sequence([
              Animated.timing(sceneShake, { toValue: 14, duration: 38, useNativeDriver: false }),
              Animated.timing(sceneShake, { toValue: -12, duration: 38, useNativeDriver: false }),
              Animated.timing(sceneShake, { toValue: 8, duration: 38, useNativeDriver: false }),
              Animated.timing(sceneShake, { toValue: 0, duration: 36, useNativeDriver: false }),
            ]),
            Animated.timing(goalOpacity, { toValue: 0, duration: 100, useNativeDriver: false }),
            Animated.timing(keeperFlatProg, { toValue: 1, duration: 400, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
          ]).start(() => {
            onComplete();
          });
        } else {
          // reset keeper + respawn ball immediately so the next 300ms-poll
          // flick can land as soon as it arrives.
          Animated.parallel([
            Animated.timing(keeperJump, { toValue: 0, duration: 200, useNativeDriver: false }),
            Animated.timing(keeperX, { toValue: 0, duration: 200, useNativeDriver: false }),
          ]).start(() => setPose('idle'));
          respawnBall();
          animating.current = false;
        }
      });
    },
  }));

  const ballRotStr = ballRot.interpolate({ inputRange: [0, 4], outputRange: ['0deg', '1440deg'] });
  const keeperLift = keeperJump.interpolate({ inputRange: [0, 1], outputRange: [0, -40] });
  // when "flat" anim plays, keeper translates from goal area down to the floor at center
  const flatX = keeperFlatProg.interpolate({
    inputRange: [0, 1],
    outputRange: [0, SW / 2 - (KEEPER_X + KEEPER_W / 2)],
  });
  const flatY = keeperFlatProg.interpolate({
    inputRange: [0, 1],
    outputRange: [0, FLOOR_TOP - KEEPER_Y - KEEPER_H * 0.4],
  });

  return (
    <Animated.View style={[styles.root, { opacity: fade, transform: [{ translateX: sceneShake }] }]}>
      <View style={[styles.sky, { height: FLOOR_TOP }]} pointerEvents="none" />
      <View style={[styles.floor, { top: FLOOR_TOP, height: SH - FLOOR_TOP }]} pointerEvents="none">
        <View style={styles.horizonLine} />
      </View>

      {/* small dent only under the ball */}
      <View style={[styles.dentWrap, { top: FLOOR_TOP - 6 }]} pointerEvents="none">
        <Svg width={SW} height={50}>
          <Path
            d={`M ${BALL_X - 60} 12 Q ${BALL_X - 26} 12 ${BALL_X} 32 Q ${BALL_X + 26} 12 ${BALL_X + 60} 12`}
            fill="none"
            stroke={INK}
            strokeWidth={3.5}
            strokeLinecap="round"
            opacity={0.55}
          />
        </Svg>
      </View>


      {/* goal (intact) */}
      <Animated.View style={[styles.goalSlot, { opacity: goalOpacity }]} pointerEvents="none">
        <SoccerGoal size={GOAL_W} />
      </Animated.View>

      {/* keeper inside the goal */}
      {!showFlat ? (
        <Animated.View
          style={[
            styles.keeperSlot,
            {
              opacity: goalOpacity,
              transform: [
                { translateX: keeperX },
                { translateY: keeperLift },
              ],
            },
          ]}
          pointerEvents="none"
        >
          <StickKeeper size={KEEPER_W} pose={pose === 'flat' ? 'idle' : pose} />
        </Animated.View>
      ) : null}

      {/* keeper FLAT on the floor at center (final shot wreckage) */}
      {showFlat ? (
        <Animated.View
          style={[
            styles.keeperSlot,
            {
              transform: [
                { translateX: flatX },
                { translateY: flatY },
              ],
            },
          ]}
          pointerEvents="none"
        >
          <StickKeeper size={KEEPER_W} pose="flat" />
        </Animated.View>
      ) : null}

      {/* ball */}
      <Animated.View
        style={[
          styles.ballSlot,
          {
            left: BALL_X - BALL_HALF,
            top: BALL_Y - BALL_HALF,
            opacity: ballOpacity,
            transform: [
              { translateX: ballTx },
              { translateY: Animated.add(ballTy, ballDrop) },
              { rotate: ballRotStr },
              { scale: ballScale },
            ],
          },
        ]}
      >
        <SoccerBall size={BALL} />
      </Animated.View>
    </Animated.View>
  );
});

export default SoccerScene;

const styles = StyleSheet.create({
  root: { ...StyleSheet.absoluteFillObject },
  sky: { position: 'absolute', left: 0, right: 0, top: 0, backgroundColor: BG_SKY },
  floor: { position: 'absolute', left: 0, right: 0, backgroundColor: BG_FLOOR },
  horizonLine: { position: 'absolute', left: 0, right: 0, top: 0, height: 2, backgroundColor: 'rgba(12,34,56,0.20)' },
  dentWrap: { position: 'absolute', left: 0, right: 0 },
  goalSlot: { position: 'absolute', left: GOAL_LEFT, top: GOAL_TOP, width: GOAL_W },
  keeperSlot: { position: 'absolute', left: KEEPER_X, top: KEEPER_Y, width: KEEPER_W, height: KEEPER_H },
  ballSlot: { position: 'absolute', width: BALL, height: BALL },
});
