import { StyleSheet, Text, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KU } from '../theme';
import { TEACHERS } from '../data/teachers';
import type { Teacher } from '../data/teachers';
import type { Topic, Language } from '../data/topics';
import { t } from '../i18n';

type Props = {
  topic: Topic;
  language: Language;
  onPick: (t: Teacher) => void;
  onBack: () => void;
};

export function TeacherChooserScreen({ topic, language, onPick, onBack }: Props) {
  const s = t(language);
  const loc = topic.languages[language];
  return (
    <SafeAreaView style={styles.root}>
      <Pressable onPress={onBack} hitSlop={12} style={styles.backChip}>
        <Text style={styles.backText}>{s.backTopics}</Text>
      </Pressable>

      <View style={styles.header}>
        <Text style={styles.eyebrow}>{s.whosTeaching}</Text>
        <Text style={styles.title}>{loc.title}?</Text>
        <Text style={styles.sub}>{s.pickTeacherSub}</Text>
      </View>

      <View style={styles.cards}>
        {TEACHERS.map((teacher) => (
          <Pressable
            key={teacher.id}
            onPress={() => onPick(teacher)}
            style={({ pressed }) => [
              styles.card,
              { borderColor: teacher.accent + '55' },
              pressed && { opacity: 0.7 },
            ]}
          >
            <View style={[styles.emojiWrap, { backgroundColor: teacher.accent + '26' }]}>
              <Text style={styles.emoji}>{teacher.emoji}</Text>
            </View>
            <Text style={styles.name}>{teacher.name}</Text>
            <Text style={styles.blurb}>{teacher.blurb}</Text>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: KU.bg, paddingHorizontal: 18 },
  backChip: {
    position: 'absolute',
    top: 58,
    left: 18,
    zIndex: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: KU.bgElevated,
    borderRadius: 18,
  },
  backText: { color: KU.textSecondary, fontSize: 14, fontWeight: '600' },
  header: { paddingTop: 100, paddingBottom: 28 },
  eyebrow: {
    color: KU.accentPurple,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.4,
    marginBottom: 8,
  },
  title: {
    color: KU.textPrimary,
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.6,
  },
  sub: { color: KU.textSecondary, fontSize: 15, marginTop: 8 },
  cards: { gap: 14 },
  card: {
    backgroundColor: KU.bgElevated,
    borderRadius: 20,
    padding: 22,
    alignItems: 'center',
    borderWidth: 1,
    marginBottom: 14,
  },
  emojiWrap: {
    width: 72,
    height: 72,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emoji: { fontSize: 40 },
  name: {
    color: KU.textPrimary,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  blurb: { color: KU.textSecondary, fontSize: 14, marginTop: 4 },
});
