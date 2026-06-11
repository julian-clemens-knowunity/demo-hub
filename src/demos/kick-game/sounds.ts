export type SoundName =
  | 'whoosh' | 'thud' | 'kick' | 'punch'
  | 'crack' | 'shatter' | 'pop' | 'cheer' | 'ding' | 'reveal' | 'intro' | 'sike'
  | 'kick1' | 'kick2' | 'kick3' | 'kick4' | 'kick5';

const SOURCES: Record<SoundName, any> = {
  whoosh:  require('./assets/sounds/whoosh.mp3'),
  thud:    require('./assets/sounds/thud.mp3'),
  kick:    require('./assets/sounds/kick.mp3'),
  punch:   require('./assets/sounds/punch.mp3'),
  crack:   require('./assets/sounds/crack.mp3'),
  shatter: require('./assets/sounds/shatter.mp3'),
  pop:     require('./assets/sounds/pop.mp3'),
  cheer:   require('./assets/sounds/cheer.mp3'),
  ding:    require('./assets/sounds/ding.mp3'),
  reveal:  require('./assets/sounds/reveal.mp3'),
  intro:   require('./assets/sounds/intro.mp3'),
  sike:    require('./assets/sounds/sike.mp3'),
  kick1:   require('./assets/sounds/kick1.mp3'),
  kick2:   require('./assets/sounds/kick2.mp3'),
  kick3:   require('./assets/sounds/kick3.mp3'),
  kick4:   require('./assets/sounds/kick4.mp3'),
  kick5:   require('./assets/sounds/kick5.mp3'),
};

const cache: Partial<Record<SoundName, HTMLAudioElement>> = {};

export async function initAudio() {
  // No-op on web; audio plays on user interaction
}

export async function play(name: SoundName, opts?: { loop?: boolean; volume?: number }) {
  try {
    if (!cache[name]) {
      const audio = new Audio(SOURCES[name]);
      audio.volume = opts?.volume ?? 0.9;
      audio.loop = opts?.loop ?? false;
      cache[name] = audio;
    } else {
      const audio = cache[name]!;
      if (opts?.loop !== undefined) audio.loop = opts.loop;
      if (opts?.volume !== undefined) audio.volume = opts.volume;
      audio.currentTime = 0;
    }
    await cache[name]!.play();
  } catch {}
}

export async function stop(name: SoundName) {
  try {
    if (cache[name]) {
      cache[name]!.pause();
      cache[name]!.currentTime = 0;
    }
  } catch {}
}

export function playImpact() {
  play('kick2');
}
export function resetImpactCycle() {}
