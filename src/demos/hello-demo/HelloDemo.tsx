import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

export default function HelloDemo() {
  const [count, setCount] = useState(0);

  return (
    <View style={styles.root}>
      <View style={styles.container}>
        <Text style={styles.title}>Hello Demo</Text>
        <Text style={styles.subtitle}>This is a test demo</Text>

        <View style={styles.display}>
          <Text style={styles.count}>{count}</Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => setCount(count + 1)}
        >
          <Text style={styles.buttonText}>Tap to increment</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            styles.resetButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => setCount(0)}
        >
          <Text style={styles.buttonText}>Reset</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#888888',
    marginBottom: 40,
  },
  display: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    paddingVertical: 40,
    paddingHorizontal: 60,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: '#333333',
  },
  count: {
    fontSize: 64,
    fontWeight: '800',
    color: '#00ff88',
  },
  button: {
    backgroundColor: '#00ff88',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginBottom: 12,
    width: 200,
  },
  resetButton: {
    backgroundColor: '#444444',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: '#0a0a0a',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
});
