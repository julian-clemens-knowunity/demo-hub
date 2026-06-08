import React, { useRef } from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Brand-blue Knowunity pill that lives at the bottom of every screen.
// Decorative for recording — press gives a small scale-bounce so it reads as a real button on camera.
export default function KnowunityBar() {
  const scale = useRef(new Animated.Value(1)).current;
  const insets = useSafeAreaInsets();

  const onPressIn = () => {
    Animated.spring(scale, { toValue: 0.94, friction: 6, tension: 220, useNativeDriver: false }).start();
  };
  const onPressOut = () => {
    Animated.spring(scale, { toValue: 1, friction: 5, tension: 140, useNativeDriver: false }).start();
  };

  return (
    <View pointerEvents="box-none" style={[styles.wrap, { bottom: insets.bottom + 20 }]}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <Pressable onPressIn={onPressIn} onPressOut={onPressOut} style={styles.pill}>
          <View style={styles.logoBubble}>
            <Image
              source={require('../assets/knowunity-logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.label}>Knowunity</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5B6FE4',
    paddingLeft: 8,
    paddingRight: 24,
    paddingVertical: 8,
    borderRadius: 999,
    gap: 12,
    shadowColor: '#5B6FE4',
    shadowOpacity: 0.45,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
  logoBubble: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 28,
    height: 28,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
});
