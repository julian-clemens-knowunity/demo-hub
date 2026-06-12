// Idle / listening / speaking visualizer — 7 vertical bars that pulse with mic level.

import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

type Props = {
  level: number | null;
  color: string;
};

const BAR_COUNT = 7;

export function Waveform({ level, color }: Props) {
  const bars = useRef(Array.from({ length: BAR_COUNT }, () => new Animated.Value(0.2))).current;

  useEffect(() => {
    if (level !== null) return;
    const loops = bars.map((b, i) => {
      const offset = i * 90;
      return Animated.loop(
        Animated.sequence([
          Animated.delay(offset),
          Animated.timing(b, {
            toValue: 0.7,
            duration: 480,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: false,
          }),
          Animated.timing(b, {
            toValue: 0.2,
            duration: 480,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: false,
          }),
        ])
      );
    });
    loops.forEach((l) => l.start());
    return () => loops.forEach((l) => l.stop());
  }, [level, bars]);

  useEffect(() => {
    if (level === null) return;
    bars.forEach((b, i) => {
      const phase = Math.sin((Date.now() / 120) + i * 0.7) * 0.18;
      const target = Math.max(0.15, Math.min(1, level + phase));
      Animated.timing(b, {
        toValue: target,
        duration: 90,
        useNativeDriver: false,
      }).start();
    });
  }, [level, bars]);

  return (
    <View style={styles.row}>
      {bars.map((b, i) => (
        <Animated.View
          key={i}
          style={[
            styles.bar,
            {
              backgroundColor: color,
              height: b.interpolate({ inputRange: [0, 1], outputRange: [10, 64] }),
              opacity: b.interpolate({ inputRange: [0, 1], outputRange: [0.45, 1] }),
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    height: 70,
  },
  bar: { width: 7, borderRadius: 4 },
});
