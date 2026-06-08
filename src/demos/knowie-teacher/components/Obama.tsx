import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Image, StyleSheet, View } from 'react-native';

export type ObamaFace = 'standby' | 'curious' | 'laughing' | 'exasperated';

// Image-based Obama. Single continuous sine-wave vertical bob — same motion
// pattern as Einstein's `idleBob` (±14 px, 1.7 s period, native driver). No
// per-face transforms, no side sway, no rotation, no mouth overlay. The
// cartoon stays clean; only the head floats. `face` and `mouthOpen` props are
// accepted for API parity with the other character components but ignored.

const OBAMA_IMG = require('../../assets/obama/obama.png');

type Props = {
  face?: ObamaFace;
  size?: number;
  mouthOpen?: Animated.Value;
};

export default function Obama({ size = 240 }: Props) {
  const bob = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bob, { toValue: -1, duration: 850, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(bob, { toValue:  1, duration: 850, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();
  }, []);
  const translateY = bob.interpolate({ inputRange: [-1, 1], outputRange: [-14, 14] });

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <Animated.View
        style={[
          styles.faceLayer,
          { width: size, height: size, transform: [{ translateY }] },
        ]}
      >
        <Image
          source={OBAMA_IMG}
          style={{ width: size, height: size }}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
  faceLayer: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
});
