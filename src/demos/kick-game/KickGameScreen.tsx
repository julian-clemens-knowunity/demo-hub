import React, { useEffect, useRef, useState } from 'react';
import { Image, PanResponder, StyleSheet, Text, View } from 'react-native';
import soccerballUrl from './assets/soccerball.png';

const PRELOAD_ASSETS = [soccerballUrl];
import TitleScene from './scenes/TitleScene';
import MultiCanScene from './scenes/MultiCanScene';
import MultiBagScene from './scenes/MultiBagScene';
import SoccerScene from './scenes/SoccerScene';
import RevealScene from './scenes/RevealScene';
import { initAudio, resetImpactCycle, stop, stopAll } from './sounds';
import type { SceneHandle } from './types';
import { BG_SKY } from './theme';
import { BEAT_MS } from './rhythm';

type Entry =
  | { kind: 'title' }
  | { kind: 'cans' }
  | { kind: 'bag' }
  | { kind: 'soccer' }
  | { kind: 'reveal' };

const ORDER: Entry[] = [
  { kind: 'title' },
  { kind: 'cans' },
  { kind: 'bag' },
  { kind: 'soccer' },
  { kind: 'reveal' },
];

const REVEAL_INDEX = ORDER.length - 1;
const FLICK_VX = 0.5;
const FLICK_VY = 0.5;

export default function KickGameScreen() {
  const [idx, setIdx] = useState(0);
  const sceneRef = useRef<SceneHandle>(null);
  const lastFlickAt = useRef(0);
  const idxRef = useRef(0);
  idxRef.current = idx;

  useEffect(() => {
    initAudio();
    return () => { stopAll(); };
  }, []);

  useEffect(() => {
    const entry = ORDER[idx];
    if (entry.kind === 'title' || entry.kind === 'reveal') return;
    const firstFlickDelay =
      entry.kind === 'cans' ? 200 :
      entry.kind === 'bag' ? 50 :
      entry.kind === 'soccer' ? 200 :
      200;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const flick = () => {
      sceneRef.current?.onFlick(1, 0);
      timer = setTimeout(flick, 100);
    };
    timer = setTimeout(flick, firstFlickDelay);
    return () => { if (timer) clearTimeout(timer); };
  }, [idx]);

  const advance = () => {
    setIdx(i => Math.min(i + 1, REVEAL_INDEX));
  };

  const reset = () => {
    lastFlickAt.current = 0;
    stop('intro');
    resetImpactCycle();
    setIdx(0);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_e, g) => Math.abs(g.dx) > 6 || Math.abs(g.dy) > 6,
      onPanResponderRelease: (_e, g) => {
        const now = Date.now();
        if (now - lastFlickAt.current < BEAT_MS) return;
        const speed = Math.max(Math.abs(g.vx), Math.abs(g.vy));
        const isFlick = Math.abs(g.vx) > FLICK_VX || Math.abs(g.vy) > FLICK_VY || speed > 0.45;
        if (!isFlick) return;
        if (idxRef.current >= REVEAL_INDEX) return;
        lastFlickAt.current = now;
        sceneRef.current?.onFlick(g.vx, g.vy);
      },
    })
  ).current;

  const entry = ORDER[idx];
  let scene: React.ReactNode = null;
  if (entry.kind === 'title') {
    scene = <TitleScene key="title" ref={sceneRef} onComplete={advance} />;
  } else if (entry.kind === 'cans') {
    scene = <MultiCanScene key={`cans-${idx}`} ref={sceneRef} onComplete={advance} />;
  } else if (entry.kind === 'bag') {
    scene = <MultiBagScene key={`bag-${idx}`} ref={sceneRef} onComplete={advance} />;
  } else if (entry.kind === 'soccer') {
    scene = <SoccerScene key={`soccer-${idx}`} ref={sceneRef} onComplete={advance} />;
  } else {
    scene = <RevealScene key="reveal" ref={sceneRef} onComplete={() => {}} />;
  }

  return (
    <View style={styles.root} {...panResponder.panHandlers}>
      {scene}
      <View style={styles.preloadHost} pointerEvents="none">
        {PRELOAD_ASSETS.map((src, i) => (
          <Image key={i} source={src} style={styles.preloadImage} />
        ))}
      </View>
      {idx === REVEAL_INDEX ? (
        <Text style={styles.reset} onPress={reset}>↺ again</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG_SKY },
  preloadHost: {
    position: 'absolute',
    left: -9999,
    top: -9999,
    width: 1,
    height: 1,
    overflow: 'hidden',
    opacity: 0,
  },
  preloadImage: { width: 1, height: 1 },
  reset: {
    position: 'absolute',
    bottom: 36,
    alignSelf: 'center',
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.12)',
    overflow: 'hidden',
  },
});
