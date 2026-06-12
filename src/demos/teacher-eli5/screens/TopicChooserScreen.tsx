import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KU } from '../theme';
import { TOPICS } from '../data/topics';
import type { Topic, Language } from '../data/topics';
import { t } from '../i18n';

type Props = {
  language: Language;
  onLanguageChange: (l: Language) => void;
  onPick: (t: Topic) => void;
};

export function TopicChooserScreen({ language, onLanguageChange, onPick }: Props) {
  const s = t(language);
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <View style={styles.langRow}>
          {(['en', 'pl', 'de'] as const).map((l) => {
            const active = l === language;
            const label = l === 'en' ? '🇬🇧 EN' : l === 'pl' ? '🇵🇱 PL' : '🇩🇪 DE';
            return (
              <Pressable
                key={l}
                onPress={() => onLanguageChange(l)}
                style={[styles.langChip, active && styles.langChipActive]}
              >
                <Text style={[styles.langText, active && styles.langTextActive]}>
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Text style={styles.eyebrow}>{s.pickLessonEyebrow}</Text>
        <Text style={styles.title}>{s.pickLessonTitle}</Text>
        <Text style={styles.sub}>{s.pickLessonSub}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {TOPICS.map((topic) => {
          const loc = topic.languages[language];
          return (
            <Pressable
              key={topic.id}
              onPress={() => onPick(topic)}
              style={({ pressed }) => [
                styles.card,
                { borderColor: topic.accent + '55' },
                pressed && { opacity: 0.7 },
              ]}
            >
              <View style={[styles.emojiWrap, { backgroundColor: topic.accent + '26' }]}>
                <Text style={styles.emoji}>{topic.emoji}</Text>
              </View>
              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>{loc.title}</Text>
                <Text style={styles.cardSub}>{loc.subtitle}</Text>
              </View>
              <Text style={[styles.chev, { color: topic.accent }]}>›</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: KU.bg },
  header: { paddingHorizontal: 22, paddingTop: 6, paddingBottom: 20 },
  langRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 18,
    alignSelf: 'flex-end',
  },
  langChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: KU.bgElevated,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  langChipActive: {
    backgroundColor: KU.bgElevated,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  langText: {
    color: KU.textMuted,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  langTextActive: { color: KU.textPrimary },
  eyebrow: {
    color: KU.accentGreen,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.4,
    marginBottom: 10,
  },
  title: {
    color: KU.textPrimary,
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 38,
    letterSpacing: -0.6,
  },
  sub: {
    color: KU.textSecondary,
    fontSize: 15,
    lineHeight: 20,
    marginTop: 10,
  },
  list: { paddingHorizontal: 18, paddingBottom: 48, gap: 12 },
  card: {
    backgroundColor: KU.bgElevated,
    borderRadius: 18,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    marginBottom: 12,
  },
  emojiWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 30 },
  cardText: { flex: 1, marginHorizontal: 14 },
  cardTitle: {
    color: KU.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  cardSub: {
    color: KU.textSecondary,
    fontSize: 14,
    marginTop: 4,
  },
  chev: { fontSize: 26, fontWeight: '300' },
});
