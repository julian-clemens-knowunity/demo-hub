import { useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import type { KnowieFace } from './Knowie';

type SoundKey = KnowieFace | 'cry' | 'correct' | 'wrong' | 'breathing';

const SOUND_SRC: Partial<Record<SoundKey, any>> = {
  cry: require('../../assets/cry.mp3'),
  correct: require('../../assets/correct.mp3'),
  wrong: require('../../assets/wrong.mp3'),
};

export function useKnowieSounds() {
  const cacheRef = useRef<Map<SoundKey, Audio.Sound>>(new Map());
  const cryLoopRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
    }).catch(() => {});

    (async () => {
      for (const key of Object.keys(SOUND_SRC) as SoundKey[]) {
        const src = SOUND_SRC[key];
        if (!src) continue;
        try {
          const { sound } = await Audio.Sound.createAsync(src, { shouldPlay: false });
          cacheRef.current.set(key, sound);
        } catch {}
      }
    })();

    return () => {
      cacheRef.current.forEach((s) => s.unloadAsync().catch(() => {}));
      cacheRef.current.clear();
      cryLoopRef.current?.unloadAsync().catch(() => {});
      cryLoopRef.current = null;
    };
  }, []);

  async function play(key: SoundKey) {
    const sound = cacheRef.current.get(key);
    if (!sound) return;
    try {
      await sound.setPositionAsync(0);
      await sound.playAsync();
    } catch {}
  }

  async function startCryLoop() {
    const src = SOUND_SRC.cry;
    if (!src) return;
    try {
      if (cryLoopRef.current) {
        await cryLoopRef.current.unloadAsync();
        cryLoopRef.current = null;
      }
      const { sound } = await Audio.Sound.createAsync(src, {
        shouldPlay: true,
        isLooping: true,
        volume: 0.95,
      });
      cryLoopRef.current = sound;
    } catch {}
  }

  async function stopCryLoop() {
    const s = cryLoopRef.current;
    if (!s) return;
    try {
      await s.stopAsync();
      await s.unloadAsync();
    } catch {}
    cryLoopRef.current = null;
  }

  return { play, startCryLoop, stopCryLoop };
}
