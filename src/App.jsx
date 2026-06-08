import { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DEMOS } from './demos.config';

function DemoGallery({ onSelectDemo }) {
  return (
    <SafeAreaView style={styles.galleryRoot} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>Demo Hub</Text>
        <Text style={styles.subtitle}>Tap a demo to launch</Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      >
        {DEMOS.map((demo) => (
          <Pressable
            key={demo.id}
            style={({ pressed }) => [
              styles.demoCard,
              pressed && styles.demoCardPressed,
            ]}
            onPress={() => onSelectDemo(demo.id)}
          >
            <Text style={styles.demoCardText}>{demo.name}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function App() {
  const [selectedDemo, setSelectedDemo] = useState(null);

  if (selectedDemo) {
    const demo = DEMOS.find((d) => d.id === selectedDemo);
    if (!demo) return null;

    const Component = demo.component;
    return (
      <View style={styles.demoContainer}>
        <Pressable
          style={styles.backButton}
          onPress={() => setSelectedDemo(null)}
        >
          <Text style={styles.backButtonText}>‹ back</Text>
        </Pressable>
        <Component />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <DemoGallery onSelectDemo={setSelectedDemo} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  galleryRoot: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: 'center',
  },
  title: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    color: '#888888',
    fontSize: 14,
    fontWeight: '500',
  },
  grid: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 12,
  },
  demoCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#333333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  demoCardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  demoCardText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  demoContainer: {
    flex: 1,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    zIndex: 1000,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default App;
