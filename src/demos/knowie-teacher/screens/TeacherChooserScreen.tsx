import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Einstein from '../components/Einstein';
import Knowie from '../components/Knowie';
import Obama from '../components/Obama';
import { TEACHERS } from '../data/teachers';
import { TOPICS } from '../data/lectures';
import { TeacherId } from '../data/types';
import { KU } from '../theme';

type Props = {
  topicId: string;
  onPick: (t: TeacherId) => void;
  onBack: () => void;
};

export default function TeacherChooserScreen({ topicId, onPick, onBack }: Props) {
  const topic = TOPICS.find(t => t.id === topicId);
  const einstein = TEACHERS.einstein;
  const knowie = TEACHERS.knowie;
  const obama = TEACHERS.obama;

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <Pressable onPress={onBack} style={styles.backChip} hitSlop={10}>
        <Text style={styles.backChipText}>‹ topics</Text>
      </Pressable>

      <View style={styles.header}>
        <Text style={styles.eyebrow}>{topic?.eyebrow ?? ''}</Text>
        <Text style={styles.title}>{topic?.title ?? 'Pick your teacher'}</Text>
        <Text style={styles.subtitle}>who's teaching this?</Text>
      </View>

      <View style={styles.cards}>
        <Pressable
          style={({ pressed }) => [
            styles.card,
            { borderColor: einstein.accentColor + '2A', backgroundColor: '#1F1A12' },
            pressed && styles.cardPressed,
          ]}
          onPress={() => onPick('einstein')}
        >
          <View style={styles.preview}>
            <Einstein face="standby" size={130} />
          </View>
          <View style={styles.cardMeta}>
            <Text style={[styles.cardEyebrow, { color: einstein.accentColor }]}>🧠 {einstein.displayName.toUpperCase()}</Text>
            <Text style={styles.cardTitle}>Old storyteller energy</Text>
            <Text style={styles.cardSubtitle}>{einstein.voiceName}</Text>
          </View>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.card,
            { borderColor: knowie.accentColor + '2A', backgroundColor: '#0E1A10' },
            pressed && styles.cardPressed,
          ]}
          onPress={() => onPick('knowie')}
        >
          <View style={styles.preview}>
            <Knowie face="overIt" size={130} />
          </View>
          <View style={styles.cardMeta}>
            <Text style={[styles.cardEyebrow, { color: knowie.accentColor }]}>📚 {knowie.displayName.toUpperCase()}</Text>
            <Text style={styles.cardTitle}>Childish chill energy</Text>
            <Text style={styles.cardSubtitle}>{knowie.voiceName}</Text>
          </View>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.card,
            { borderColor: obama.accentColor + '2A', backgroundColor: '#0F1426' },
            pressed && styles.cardPressed,
          ]}
          onPress={() => onPick('obama')}
        >
          <View style={styles.preview}>
            <Obama face="standby" size={130} />
          </View>
          <View style={styles.cardMeta}>
            <Text style={[styles.cardEyebrow, { color: obama.accentColor }]}>🇺🇸 {obama.displayName.toUpperCase()}</Text>
            <Text style={styles.cardTitle}>Presidential storyteller</Text>
            <Text style={styles.cardSubtitle}>{obama.voiceName}</Text>
          </View>
        </Pressable>
      </View>

      <Text style={styles.footer}>tap a teacher to start</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: KU.bg, paddingHorizontal: 20 },
  backChip: {
    alignSelf: 'flex-start',
    backgroundColor: KU.bgElevated,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    marginTop: 4,
  },
  backChipText: { color: KU.textSecondary, fontSize: 12, fontWeight: '600' },
  header: { alignItems: 'center', paddingTop: 16, paddingBottom: 8 },
  eyebrow: {
    color: KU.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.4,
    marginBottom: 6,
  },
  title: {
    color: KU.textPrimary,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
    textAlign: 'center',
  },
  subtitle: {
    color: KU.textSecondary,
    fontSize: 13,
    fontWeight: '500',
    marginTop: 4,
  },
  cards: { flex: 1, justifyContent: 'center', gap: 10 },
  card: {
    flexDirection: 'row',
    backgroundColor: KU.bgElevated,
    borderRadius: KU.r24,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: KU.border,
  },
  cardPressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  preview: { width: 105, height: 105, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  cardMeta: { flex: 1, paddingLeft: 8 },
  cardEyebrow: { fontSize: 11, fontWeight: '700', letterSpacing: 1.2, marginBottom: 4 },
  cardTitle: { color: KU.textPrimary, fontSize: 18, fontWeight: '800', letterSpacing: -0.3 },
  cardSubtitle: { color: KU.textSecondary, fontSize: 12, fontStyle: 'italic', marginTop: 4 },
  footer: { color: KU.textMuted, fontSize: 12, textAlign: 'center', paddingBottom: 8 },
});
