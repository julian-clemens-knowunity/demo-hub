import { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { DEMOS } from './demos.config';
import { ErrorBoundary } from './ErrorBoundary';

function DemoGallery({ onSelectDemo }) {
  return (
    <ScrollView
      style={styles.galleryRoot}
      contentContainerStyle={styles.galleryContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Demo Hub</Text>
        <Text style={styles.subtitle}>Tap a demo to launch</Text>
      </View>
      <View style={styles.grid}>
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
      </View>
    </ScrollView>
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
        <ErrorBoundary>
          <Component />
        </ErrorBoundary>
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
  galleryContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 40,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  title: {
    color: '#ffffff',
    fontSize: 40,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: -1,
  },
  subtitle: {
    color: '#888888',
    fontSize: 15,
    fontWeight: '500',
  },
  grid: {
    paddingHorizontal: 20,
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
