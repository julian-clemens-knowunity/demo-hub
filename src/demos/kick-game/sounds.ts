import whooshUrl from './assets/sounds/whoosh.mp3';
import thudUrl from './assets/sounds/thud.mp3';
import kickUrl from './assets/sounds/kick.mp3';
import punchUrl from './assets/sounds/punch.mp3';
import crackUrl from './assets/sounds/crack.mp3';
import shatterUrl from './assets/sounds/shatter.mp3';
import popUrl from './assets/sounds/pop.mp3';
import cheerUrl from './assets/sounds/cheer.mp3';
import dingUrl from './assets/sounds/ding.mp3';
import revealUrl from './assets/sounds/reveal.mp3';
import introUrl from './assets/sounds/intro.mp3';
import sikeUrl from './assets/sounds/sike.mp3';
import kick1Url from './assets/sounds/kick1.mp3';
import kick2Url from './assets/sounds/kick2.mp3';
import kick3Url from './assets/sounds/kick3.mp3';
import kick4Url from './assets/sounds/kick4.mp3';
import kick5Url from './assets/sounds/kick5.mp3';

export type SoundName =
  | 'whoosh' | 'thud' | 'kick' | 'punch'
  | 'crack' | 'shatter' | 'pop' | 'cheer' | 'ding' | 'reveal' | 'intro' | 'sike'
  | 'kick1' | 'kick2' | 'kick3' | 'kick4' | 'kick5';

const SOURCES: Record<SoundName, string> = {
  whoosh: whooshUrl,
  thud: thudUrl,
  kick: kickUrl,
  punch: punchUrl,
  crack: crackUrl,
  shatter: shatterUrl,
  pop: popUrl,
  cheer: cheerUrl,
  ding: dingUrl,
  reveal: revealUrl,
  intro: introUrl,
  sike: sikeUrl,
  kick1: kick1Url,
  kick2: kick2Url,
  kick3: kick3Url,
  kick4: kick4Url,
  kick5: kick5Url,
};

const cache: Partial<Record<SoundName, HTMLAudioElement>> = {};

export async function initAudio() {}

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
