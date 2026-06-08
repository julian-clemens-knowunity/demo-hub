import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
  Vibration,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Einstein, { EinsteinFace } from '../components/Einstein';
import Knowie, { KnowieFace } from '../components/Knowie';
import Obama, { ObamaFace } from '../components/Obama';
import { RenderedLecture, RenderedBeat } from '../data/types';
import { KU } from '../theme';

type Phase = 'idle' | 'playing' | 'done';

const TICK_MS = 60;

type Props = {
  lecture: RenderedLecture;
  onBack: () => void;
};

export default function TeacherScreen({ lecture, onBack }: Props) {
  const { topic, teacher, beats, totalMs, audioFile, envelope } = lecture;

  const [phase, setPhase] = useState<Phase>('idle');
  const [beatIdx, setBeatIdx] = useState<number>(0);

  const soundRef = useRef<HTMLAudioElement | null>(null);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fallbackStartRef = useRef<number>(0);

  const captionOpacity = useRef(new Animated.Value(0)).current;
  const captionShift = useRef(new Animated.Value(0)).current;
  const topicY = useRef(new Animated.Value(0)).current;
  const topicOpacity = useRef(new Animated.Value(1)).current;
  const mouthOpen = useRef(new Animated.Value(0)).current;

  const hintPulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (phase !== 'idle') return;
    Animated.loop(
      Animated.sequence([
        Animated.timing(hintPulse, { toValue: 1, duration: 900, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(hintPulse, { toValue: 0, duration: 900, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();
  }, [phase]);

  const start = async () => {
    if (phase !== 'idle') return;
    setPhase('playing');
    setBeatIdx(0);

    Animated.parallel([
      Animated.timing(topicY, { toValue: -7, duration: 420, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(topicOpacity, { toValue: 0.35, duration: 420, useNativeDriver: true }),
    ]).start();

    Vibration.vibrate(40);

    try {
      const audio = new Audio(audioFile);
      audio.play();
      soundRef.current = audio;
      beginTickLoop();
    } catch (err) {
      console.warn('audio load failed, falling back to setTimeout playback', err);
      fallbackStartRef.current = Date.now();
      beginTickLoop();
    }
  };

  const beginTickLoop = () => {
    if (tickRef.current) clearInterval(tickRef.current);
    tickRef.current = setInterval(() => {
      let elapsed: number;
      if (soundRef.current && soundRef.current.readyState >= 2) {
        elapsed = soundRef.current.currentTime * 1000;
      } else {
        elapsed = Date.now() - fallbackStartRef.current;
      }

      const idx = currentBeatIndex(elapsed, beats);
      setBeatIdx(idx);

      if (envelope) {
        const frameIdx = Math.min(Math.floor(elapsed / 50), envelope.length - 1);
        const db = envelope[frameIdx]?.[1] ?? -90;
        const norm = Math.max(0, Math.min(1, (db + 55) / 45));
        mouthOpen.setValue(norm);
      }

      if (elapsed >= totalMs) {
        if (tickRef.current) {
          clearInterval(tickRef.current);
          tickRef.current = null;
        }
        setPhase('done');
      }
    }, TICK_MS);
  };

  const lastCaptionKeyRef = useRef<number>(-1);
  useEffect(() => {
    if (lastCaptionKeyRef.current === beatIdx) return;
    lastCaptionKeyRef.current = beatIdx;
    captionOpacity.setValue(0);
    captionShift.setValue(10);
    Animated.parallel([
      Animated.timing(captionOpacity, { toValue: 1, duration: 220, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(captionShift, { toValue: 0, duration: 260, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, [beatIdx]);

  const reset = () => {
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
    if (soundRef.current) {
      soundRef.current.pause();
      soundRef.current.currentTime = 0;
      soundRef.current = null;
    }
    setBeatIdx(0);
    setPhase('idle');
    topicY.setValue(0);
    topicOpacity.setValue(1);
    mouthOpen.setValue(0);
  };

  useEffect(() => {
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
      if (soundRef.current) {
        soundRef.current.pause();
        soundRef.current.currentTime = 0;
      }
    };
  }, []);

  const beat: RenderedBeat = beats[Math.min(beatIdx, beats.length - 1)];
  const hintOp = hintPulse.interpolate({ inputRange: [0, 1], outputRange: [0.35, 1] });

  return (
    <Pressable
      style={styles.root}
      onPress={() => {
        if (phase === 'idle') start();
        else if (phase === 'done') reset();
      }}
    >
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <Pressable style={styles.backChip} onPress={onBack} hitSlop={10}>
          <Text style={styles.backChipText}>‹ change teacher</Text>
        </Pressable>

        <Animated.View
          style={[
            styles.topicWrap,
            { transform: [{ translateY: topicY }], opacity: topicOpacity },
          ]}
        >
          <Text style={[styles.topicEyebrow, { color: teacher.accentColor }]}>{topic.eyebrow}</Text>
          <Text style={styles.topic}>{topic.title}</Text>
          <Text style={styles.subtitle}>{topic.subtitle}</Text>
        </Animated.View>

        <View style={styles.characterWrap}>
          {teacher.id === 'einstein' ? (
            <Einstein
              face={(phase === 'idle' ? 'standby' : beat.face) as EinsteinFace}
              size={220}
              mouthOpen={phase === 'playing' ? mouthOpen : undefined}
            />
          ) : teacher.id === 'obama' ? (
            <Obama
              face={(phase === 'idle' ? 'standby' : beat.face) as ObamaFace}
              size={220}
              mouthOpen={phase === 'playing' ? mouthOpen : undefined}
            />
          ) : (
            <Knowie face={(phase === 'idle' ? 'standby' : beat.face) as KnowieFace} size={220} />
          )}
        </View>

        <View style={styles.captionWrap}>
          {phase === 'idle' ? (
            <Animated.Text style={[styles.hint, { opacity: hintOp }]}>tap to begin</Animated.Text>
          ) : (
            <Animated.Text
              style={[
                styles.caption,
                { opacity: captionOpacity, transform: [{ translateY: captionShift }] },
              ]}
            >
              {beat.highlight
                ? renderHighlighted(beat.caption, beat.highlight, teacher.accentColor)
                : beat.caption}
            </Animated.Text>
          )}
          {phase === 'done' && <Text style={styles.replay}>tap to replay</Text>}
        </View>

        {phase !== 'idle' && (
          <View style={styles.progressRow}>
            {beats.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  i <= beatIdx && { backgroundColor: teacher.accentColor },
                ]}
              />
            ))}
          </View>
        )}
      </SafeAreaView>
    </Pressable>
  );
}

function currentBeatIndex(elapsedMs: number, beats: RenderedBeat[]): number {
  for (let i = beats.length - 1; i >= 0; i--) {
    if (elapsedMs >= beats[i].startMs) return i;
  }
  return 0;
}

function renderHighlighted(caption: string, highlight: string, color: string) {
  const idx = caption.indexOf(highlight);
  if (idx < 0) return caption;
  return (
    <>
      {caption.slice(0, idx)}
      <Text style={{ color }}>{highlight}</Text>
      {caption.slice(idx + highlight.length)}
    </>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: KU.bg },
  safe: { flex: 1, paddingHorizontal: 20, justifyContent: 'space-between' },
  backChip: {
    position: 'absolute',
    top: 8,
    left: 16,
    zIndex: 50,
    backgroundColor: KU.bgElevated,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
  },
  backChipText: { color: KU.textSecondary, fontSize: 12, fontWeight: '600' },
  topicWrap: { alignItems: 'center', paddingTop: 8 },
  topicEyebrow: { fontSize: 12, fontWeight: '700', letterSpacing: 1.2, marginBottom: 8 },
  topic: {
    color: KU.textPrimary,
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  subtitle: { color: KU.textSecondary, fontSize: 13, fontWeight: '500', marginTop: 4, textAlign: 'center' },
  characterWrap: { alignItems: 'center', justifyContent: 'center', paddingVertical: 12 },
  captionWrap: {
    minHeight: 140,
    paddingHorizontal: 8,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  caption: {
    color: KU.textPrimary,
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 34,
    letterSpacing: -0.4,
  },
  hint: {
    color: KU.textSecondary,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'lowercase',
  },
  replay: { color: KU.textMuted, fontSize: 13, fontWeight: '600', marginTop: 18, letterSpacing: 0.5 },
  progressRow: { flexDirection: 'row', justifyContent: 'center', gap: 6, paddingBottom: 12 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.15)' },
});
