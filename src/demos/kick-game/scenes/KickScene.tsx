import React, { forwardRef, useImperativeHandle, useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Easing, StyleSheet, Vibration } from 'react-native';
import Background from '../components/Background';
import { play } from '../sounds';
import type { KickSpec } from '../data/scenes';
import type { SceneHandle, SceneProps } from '../types';

const { width: SW, height: SH } = Dimensions.get('window');

type Props = SceneProps & { spec: KickSpec };

const KickScene = forwardRef<SceneHandle, Props>(({ onComplete, spec }, ref) => {
  const fade = useRef(new Animated.Value(0)).current;
  const tx = useRef(new Animated.Value(0)).current;
  const ty = useRef(new Animated.Value(0)).current;
  const rot = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const swing = useRef(new Animated.Value(0)).current;
  const drop = useRef(new Animated.Value(-280)).current;
  const shake = useRef(new Animated.Value(0)).current;
  const mainOpacity = useRef(new Animated.Value(1)).current;
  const shardsOpacity = useRef(new Animated.Value(0)).current;
  const shardsScale = useRef(new Animated.Value(0.4)).current;
  const idleBob = useRef(new Animated.Value(0)).current;
  const [kicked, setKicked] = useState(false);
  const kickedRef = useRef(false);

  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 280, useNativeDriver: false }).start();
    Animated.spring(drop, { toValue: 0, useNativeDriver: false, bounciness: 7, speed: 7 }).start();
    if (spec.kick !== 'swing') {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(idleBob, { toValue: -6, duration: 1100, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
          Animated.timing(idleBob, { toValue: 0,  duration: 1100, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
        ])
      );
      loop.start();
      return () => loop.stop();
    }
  }, [fade, drop, idleBob, spec.kick]);

  const triggerKick = (vx = 1) => {
    if (kickedRef.current) return;
    kickedRef.current = true;
    setKicked(true);
    play(spec.sound);
    Vibration.vibrate(spec.kick === 'smash' ? 80 : 24);
    const dirX = vx >= 0 ? 1 : -1;

    const finish = () => {
      setTimeout(() => {
        Animated.timing(fade, { toValue: 0, duration: 220, useNativeDriver: false }).start(() => onComplete());
      }, spec.kick === 'smash' ? 520 : 220);
    };

    if (spec.kick === 'launch') {
      Animated.sequence([
        Animated.timing(scale, { toValue: 0.82, duration: 50, useNativeDriver: false }),
        Animated.parallel([
          Animated.timing(scale, { toValue: 1, duration: 90, useNativeDriver: false }),
          Animated.timing(tx, { toValue: dirX * SW * 1.2, duration: 460, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
          Animated.timing(ty, { toValue: -SH * 0.55, duration: 460, easing: Easing.out(Easing.quad), useNativeDriver: false }),
          Animated.timing(rot, { toValue: dirX * 4, duration: 460, easing: Easing.linear, useNativeDriver: false }),
        ]),
      ]).start(finish);
    } else if (spec.kick === 'swing') {
      Animated.sequence([
        Animated.timing(swing, { toValue: dirX * 1.0, duration: 130, easing: Easing.out(Easing.quad), useNativeDriver: false }),
        Animated.timing(swing, { toValue: dirX * -0.55, duration: 210, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
        Animated.timing(swing, { toValue: dirX * 0.30, duration: 170, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
        Animated.timing(swing, { toValue: 0, duration: 140, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
      ]).start(finish);
    } else if (spec.kick === 'smash') {
      Animated.parallel([
        Animated.sequence([
          Animated.timing(shake, { toValue: 14, duration: 40, useNativeDriver: false }),
          Animated.timing(shake, { toValue: -12, duration: 40, useNativeDriver: false }),
          Animated.timing(shake, { toValue: 8, duration: 40, useNativeDriver: false }),
          Animated.timing(shake, { toValue: -5, duration: 40, useNativeDriver: false }),
          Animated.timing(shake, { toValue: 0, duration: 40, useNativeDriver: false }),
        ]),
        Animated.timing(mainOpacity, { toValue: 0, duration: 140, useNativeDriver: false }),
        Animated.timing(scale, { toValue: 1.35, duration: 140, useNativeDriver: false }),
        Animated.parallel([
          Animated.timing(shardsOpacity, { toValue: 1, duration: 220, useNativeDriver: false }),
          Animated.spring(shardsScale, { toValue: 1, useNativeDriver: false, bounciness: 12, speed: 10 }),
        ]),
      ]).start(finish);
    }
  };

  useImperativeHandle(ref, () => ({
    onFlick: (vx) => { triggerKick(vx); },
  }));

  const rotStr = rot.interpolate({ inputRange: [-4, 4], outputRange: ['-1440deg', '1440deg'] });
  const swingStr = swing.interpolate({ inputRange: [-1, 1], outputRange: ['-42deg', '42deg'] });

  const startLeft = SW * spec.startX - spec.width / 2;
  const startTop = SH * spec.startY - spec.height / 2;

  return (
    <Animated.View style={[styles.root, { opacity: fade, transform: [{ translateX: shake }] }]}>
      <Background ground={spec.ground} />

      {spec.renderDecorations?.()}

      <Animated.View
        style={{
          position: 'absolute',
          left: startLeft,
          top: startTop,
          width: spec.width,
          height: spec.height,
          alignItems: 'center',
          justifyContent: 'flex-start',
          opacity: mainOpacity,
          transform: spec.kick === 'swing'
            ? [{ translateY: drop }, { rotate: swingStr }]
            : [
                { translateX: tx },
                { translateY: Animated.add(Animated.add(ty, drop), idleBob) },
                { rotate: rotStr },
                { scale },
              ],
          transformOrigin: spec.kick === 'swing' ? ('top center' as any) : ('center' as any),
        }}
      >
        {spec.render(kicked)}
      </Animated.View>

      {spec.renderShards ? (
        <Animated.View
          style={{
            ...StyleSheet.absoluteFillObject,
            opacity: shardsOpacity,
            transform: [{ scale: shardsScale }],
          }}
          pointerEvents="none"
        >
          {spec.renderShards()}
        </Animated.View>
      ) : null}
    </Animated.View>
  );
});

export default KickScene;

const styles = StyleSheet.create({
  root: { ...StyleSheet.absoluteFillObject },
});
