// Web port: plays mp3s via HTMLAudioElement, listens via Web Audio API VAD.
// Bottom "Let me speak now" button cuts off whatever's playing and opens the
// mic immediately.

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

  const [phase, setPhase] = useState<Phase>('preroll');
  const [currentMode, setCurrentMode] = useState<Mode>('normal');

  const audioRef = useRef<HTMLAudioElement | null>(null);
  // Pre-created Audio elements, keyed by mode. We create + unlock them on the
  // initial user tap so iOS Safari lets us .play() the ELI5 one later (when
  // VAD-driven, NOT user-gesture-driven).
  const audioPool = useRef<Record<Mode, HTMLAudioElement | null>>({ normal: null, eli5: null });
  const unlockedRef = useRef(false);
  const vad = useVAD({ speechDb: -25, silenceMs: 1000, maxMs: 10000 });

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
      // Tear down both pool elements.
      (['normal', 'eli5'] as Mode[]).forEach((m) => {
        const a = audioPool.current[m];
        if (a) {
          try { a.pause(); a.src = ''; } catch {}
        }
        audioPool.current[m] = null;
      });
      vad.stop('idle').catch(() => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // iOS Safari blocks .play() unless triggered by a user gesture. We "unlock"
  // both Audio elements on the user's initial tap by calling .play()+.pause()
  // synchronously inside the gesture handler. We do NOT use the .then() of
  // play() to pause — that resolves asynchronously and was racing with the
  // real playMode() call (the unlock pause was landing AFTER the real play,
  // muting the first audio). Synchronous pause + reload is the workaround.
  const unlockAudioPool = () => {
    if (unlockedRef.current) return;
    unlockedRef.current = true;
    (['normal', 'eli5'] as Mode[]).forEach((m) => {
      try {
        const url = getAudio(topic.id, language, m, teacher.id);
        const audio = new Audio(url);
        audio.preload = 'auto';
        audio.volume = 0;
        // Fire-and-forget — the gesture-bound .play() call is what unlocks
        // future plays on iOS. The promise rejection here is fine.
        const p = audio.play();
        if (p && typeof p.catch === 'function') p.catch(() => {});
        // Immediately pause synchronously inside the gesture so the unlock
        // play doesn't actually keep advancing.
        try { audio.pause(); audio.currentTime = 0; } catch {}
        audioPool.current[m] = audio;
      } catch {}
    });
  };

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
    // Pause any currently-playing audio without nuking the pool element so
    // we can reuse it.
    if (audioRef.current) {
      try { audioRef.current.pause(); } catch {}
      audioRef.current = null;
    }
    if (vad.state !== 'idle') {
      await vad.stop('idle');
    }
    vad.reset();

    setCurrentMode(mode);
    setPhase(mode === 'normal' ? 'playing' : 'eli5');

    try {
      // Prefer the pre-unlocked pool element so iOS Safari lets us play
      // even when VAD (not user gesture) triggered this call.
      let audio = audioPool.current[mode];
      if (!audio) {
        const url = getAudio(topic.id, language, mode, teacher.id);
        audio = new Audio(url);
        audio.volume = 1;
        audioPool.current[mode] = audio;
      }
      // Belt-and-suspenders: make sure any pending unlock play is paused
      // before we restart from currentTime=0.
      try { audio.pause(); } catch {}
      audio.currentTime = 0;
      audio.volume = 1;
      audioRef.current = audio;
      const onEnded = () => {
        audio!.removeEventListener('ended', onEnded);
        if (audioRef.current !== audio) return;
        if (mode === 'normal') {
          startListening();
        } else {
          setPhase('done');
        }
      };
      audio.addEventListener('ended', onEnded);
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
    unlockAudioPool();
    if (phase === 'preroll' || phase === 'done') {
      playMode('normal');
    } else if (phase === 'playing' || phase === 'eli5') {
      // Tap during playback → skip ahead
      if (audioRef.current) {
        try { audioRef.current.pause(); } catch {}
        audioRef.current = null;
      }
      if (currentMode === 'normal') startListening();
      else setPhase('done');
    }
    // Tapping during listening = no-op (use the speak button or speak)
  };

  // "Let me speak now" — cut off whatever's playing, open the mic
  const handleLetMeSpeak = async () => {
    unlockAudioPool();
    if (phase === 'listening') return;
    if (audioRef.current) {
      try { audioRef.current.pause(); } catch {}
      audioRef.current = null;
    }
    await startListening();
  };

  const handleReplay = () => { unlockAudioPool(); playMode('normal'); };

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
        <Text style={styles.topicTitle}>{s.studyWith(teacher.name)}</Text>
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
          onPress={handleLetMeSpeak}
          style={({ pressed }) => [
            styles.actionPrimary,
            { backgroundColor: accent },
            pressed && { opacity: 0.8 },
          ]}
        >
          <Text style={styles.actionPrimaryText}>{s.letMeSpeak}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: KU.bg, paddingHorizontal: 18 },
  backChip: {
    position: 'absolute',
    // Hub's own "‹ back" sits at top:50/left:16 — shift this one to the right
    // so the two buttons sit side-by-side instead of stacked.
    top: 50,
    left: 96,
    zIndex: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: KU.bgElevated,
    borderRadius: 18,
  },
  backText: { color: KU.textSecondary, fontSize: 14, fontWeight: '600' },

  header: { alignItems: 'center', paddingTop: 80, paddingBottom: 24 },
  topicTitle: {
    color: KU.textPrimary,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.4,
  },

  centerArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    borderWidth: 2,
  },
  waveWrap: { marginBottom: 18 },
  statusLabel: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.2,
    marginBottom: 6,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  helpLine: {
    color: KU.textMuted,
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: 50,
    lineHeight: 16,
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
