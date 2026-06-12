// Web port: plays mp3s via HTMLAudioElement, listens via Web Audio API VAD.

import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KU } from '../theme';
import { Waveform } from '../components/Waveform';
import { useVAD } from '../hooks/useVAD';
import { getAudio } from '../data/topics';
import type { Topic, Mode, Language } from '../data/topics';
import type { Teacher } from '../data/teachers';
import { t } from '../i18n';

type Phase = 'preroll' | 'playing' | 'listening' | 'eli5' | 'done';

type Props = {
  topic: Topic;
  teacher: Teacher;
  language: Language;
  onBack: () => void;
};

export function LectureScreen({ topic, teacher, language, onBack }: Props) {
  const s = t(language);
  const loc = topic.languages[language];

  const [phase, setPhase] = useState<Phase>('preroll');
  const [currentMode, setCurrentMode] = useState<Mode>('normal');

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const vad = useVAD({ speechDb: -32, silenceMs: 1300, maxMs: 12000 });

  const ringScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        try {
          audioRef.current.pause();
          audioRef.current.src = '';
        } catch {}
        audioRef.current = null;
      }
      vad.stop('idle').catch(() => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // VAD signals "ended" while listening → play ELI5
  useEffect(() => {
    if (phase === 'listening' && vad.state === 'ended') {
      playMode('eli5');
    }
  }, [vad.state, phase]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (phase !== 'listening') return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(ringScale, {
          toValue: 1.18,
          duration: 900,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
        Animated.timing(ringScale, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [phase, ringScale]);

  const playMode = async (mode: Mode) => {
    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.src = '';
      } catch {}
      audioRef.current = null;
    }
    if (vad.state !== 'idle') {
      await vad.stop('idle');
    }
    vad.reset();

    setCurrentMode(mode);
    setPhase(mode === 'normal' ? 'playing' : 'eli5');

    try {
      const url = getAudio(topic.id, language, mode, teacher.id);
      const audio = new Audio(url);
      audio.volume = 1;
      audioRef.current = audio;
      audio.addEventListener('ended', () => {
        if (audioRef.current !== audio) return;
        if (mode === 'normal') {
          startListening();
        } else {
          setPhase('done');
        }
      });
      await audio.play();
    } catch (e) {
      console.warn('[Lecture] playback error', e);
      setPhase('done');
    }
  };

  const startListening = async () => {
    setPhase('listening');
    await vad.start();
  };

  const handleCardTap = () => {
    if (phase === 'preroll' || phase === 'done') {
      playMode('normal');
    } else if (phase === 'listening') {
      playMode('eli5');
    } else if (phase === 'playing' || phase === 'eli5') {
      if (audioRef.current) {
        try { audioRef.current.pause(); } catch {}
        audioRef.current = null;
      }
      if (currentMode === 'normal') startListening();
      else setPhase('done');
    }
  };

  const handleReexplain = () => playMode('eli5');
  const handleReplay = () => playMode('normal');

  const accent = topic.accent;

  let statusLabel = '';
  let helpLine = '';
  if (phase === 'preroll') {
    statusLabel = s.readyWhen;
    helpLine = s.tapToStart;
  } else if (phase === 'playing') {
    statusLabel = s.teaching(teacher.name);
    helpLine = s.listenThenAsk;
  } else if (phase === 'listening') {
    if (vad.state === 'listening') {
      statusLabel = s.imListening;
      helpLine = s.sayLike;
    } else if (vad.state === 'speaking') {
      statusLabel = s.iHearYou;
      helpLine = s.stopWhenDone;
    } else {
      statusLabel = s.gotIt;
      helpLine = s.oneSec;
    }
  } else if (phase === 'eli5') {
    statusLabel = s.reexplaining(teacher.name);
    helpLine = s.likeFive;
  } else if (phase === 'done') {
    statusLabel = s.done;
    helpLine = s.tapAgain;
  }

  return (
    <SafeAreaView style={styles.root}>
      <Pressable onPress={onBack} hitSlop={12} style={styles.backChip}>
        <Text style={styles.backText}>{s.backTopics}</Text>
      </Pressable>

      <View style={styles.header}>
        <View style={[styles.emojiBadge, { backgroundColor: accent + '26' }]}>
          <Text style={styles.emoji}>{topic.emoji}</Text>
        </View>
        <Text style={styles.topicTitle}>{loc.title}</Text>
        <Text style={styles.teacherName}>with {teacher.name}</Text>
      </View>

      <Pressable style={styles.centerArea} onPress={handleCardTap}>
        <Animated.View
          style={[
            styles.ring,
            {
              borderColor: accent + '55',
              transform: [{ scale: phase === 'listening' ? ringScale : 1 }],
            },
          ]}
        />
        <View style={styles.waveWrap}>
          <Waveform
            level={phase === 'listening' ? vad.level : null}
            color={
              phase === 'listening'
                ? vad.state === 'speaking'
                  ? accent
                  : KU.textSecondary
                : phase === 'playing' || phase === 'eli5'
                ? accent
                : KU.textMuted
            }
          />
        </View>
        <Text style={[styles.statusLabel, { color: KU.textPrimary }]}>{statusLabel}</Text>
        <Text style={styles.helpLine}>{helpLine}</Text>
      </Pressable>

      <View style={styles.actions}>
        <Pressable
          onPress={handleReplay}
          style={({ pressed }) => [styles.action, pressed && { opacity: 0.6 }]}
        >
          <Text style={styles.actionText}>{s.replay}</Text>
        </Pressable>
        <Pressable
          onPress={handleReexplain}
          style={({ pressed }) => [
            styles.actionPrimary,
            { backgroundColor: accent },
            pressed && { opacity: 0.8 },
          ]}
        >
          <Text style={styles.actionPrimaryText}>{s.explainLike5}</Text>
        </Pressable>
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

  header: { alignItems: 'center', paddingTop: 80, paddingBottom: 24 },
  emojiBadge: {
    width: 84,
    height: 84,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emoji: { fontSize: 44 },
  topicTitle: {
    color: KU.textPrimary,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  teacherName: { color: KU.textSecondary, fontSize: 16, marginTop: 6 },

  centerArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 2,
  },
  waveWrap: { marginBottom: 22 },
  statusLabel: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.2,
    marginBottom: 8,
  },
  helpLine: {
    color: KU.textMuted,
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 30,
  },

  actions: {
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 16,
  },
  action: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 28,
    backgroundColor: KU.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: { color: KU.textPrimary, fontSize: 15, fontWeight: '600' },
  actionPrimary: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionPrimaryText: { color: '#000', fontSize: 16, fontWeight: '800' },
});
