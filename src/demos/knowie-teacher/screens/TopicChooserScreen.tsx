import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TOPICS } from '../data/lectures';
import { KU } from '../theme';

type Props = {
  onPick: (topicId: string) => void;
};

export default function TopicChooserScreen({ onPick }: Props) {
  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>🎬 GROWTH-AI · KNOWIE TEACHER</Text>
        <Text style={styles.title}>Pick a lecture</Text>
        <Text style={styles.subtitle}>then pick who's teaching it</Text>
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {TOPICS.map((t) => (
          <Pressable
            key={t.id}
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
            onPress={() => onPick(t.id)}
          >
            <Text style={styles.cardEmoji}>{t.emoji}</Text>
            <View style={styles.cardMeta}>
              <Text style={styles.cardEyebrow}>{t.eyebrow}</Text>
              <Text style={styles.cardTitle}>{t.title}</Text>
              <Text style={styles.cardSubtitle}>{t.subtitle}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: KU.bg,
    paddingHorizontal: 16,
  },
  header: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 18,
  },
  eyebrow: {
    color: KU.textMuted,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.4,
    marginBottom: 6,
  },
  title: {
    color: KU.textPrimary,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  subtitle: {
    color: KU.textSecondary,
    fontSize: 13,
    fontWeight: '500',
    marginTop: 4,
  },
  list: {
    paddingBottom: 24,
    gap: 10,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: KU.bgElevated,
    borderRadius: KU.r24,
    paddingVertical: 14,
    paddingHorizontal: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: KU.border,
    gap: 14,
  },
  cardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.985 }],
  },
  cardEmoji: {
    fontSize: 38,
    width: 50,
    textAlign: 'center',
  },
  cardMeta: {
    flex: 1,
  },
  cardEyebrow: {
    color: KU.textMuted,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 3,
  },
  cardTitle: {
    color: KU.textPrimary,
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  cardSubtitle: {
    color: KU.textSecondary,
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 2,
  },
  chevron: {
    color: KU.textMuted,
    fontSize: 28,
    fontWeight: '300',
    paddingRight: 4,
  },
});
