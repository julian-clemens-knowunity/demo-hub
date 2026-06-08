import React, { useMemo, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Knowie, { KnowieFace } from '../components/Knowie';
import SortBoard from '../components/SortBoard';
import { QUESTIONS } from '../data/questions';
import { KU } from '../theme';

type Props = { onComplete: (score: number, total: number) => void };

// Knowie's quip cycles per-question (line + face). The joke is he gets MORE bored every time.
const QUIPS: { line: string; face: KnowieFace }[] = [
  { line: "you're really studying for THIS?", face: 'overIt' },
  { line: 'bro this is page 1 of the textbook.', face: 'dazed' },
  { line: 'i am begging you to close the app.', face: 'overIt' },
  { line: '...you sure you took algebra?', face: 'confused' },
  { line: 'last one. i can\'t watch anymore.', face: 'dazed' },
];

export default function QuizScreen({ onComplete }: Props) {
  const [idx, setIdx] = useState(0);
  const [wrongs, setWrongs] = useState(0);
  const total = QUESTIONS.length;

  // Fade between questions
  const fade = useRef(new Animated.Value(1)).current;

  const question = QUESTIONS[idx];
  const quip = QUIPS[idx] ?? QUIPS[QUIPS.length - 1];

  const advance = () => {
    if (idx + 1 >= total) {
      onComplete(total, total);
      return;
    }
    setIdx(idx + 1);
  };

  // Progress dots row (one per question)
  const dots = useMemo(
    () =>
      QUESTIONS.map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            { backgroundColor: i <= idx ? KU.accentGreen : 'rgba(255,255,255,0.15)' },
          ]}
        />
      )),
    [idx]
  );

  return (
    <SafeAreaView edges={['top']} style={styles.root}>
      <View style={styles.topBar}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>AP MATH</Text>
        </View>
        <View style={styles.dotsRow}>{dots}</View>
      </View>

      <View style={styles.knowieRow}>
        <Knowie face={quip.face} size={84} />
        <View style={styles.quipBubble}>
          <Text style={styles.quipText}>{quip.line}</Text>
        </View>
      </View>

      <Animated.View style={[styles.board, { opacity: fade }]}>
        <SortBoard
          key={question.id}
          question={question}
          onWrongDrop={() => setWrongs((w) => w + 1)}
          onAllPlaced={advance}
        />
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: KU.bg,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 4,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: KU.bgElevated,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: KU.border,
  },
  badgeText: {
    color: KU.textPrimary,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  knowieRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 4,
  },
  quipBubble: {
    flex: 1,
    backgroundColor: KU.bgElevated,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: KU.border,
  },
  quipText: {
    color: KU.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  board: {
    flex: 1,
  },
});
