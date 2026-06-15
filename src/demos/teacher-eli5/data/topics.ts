// Topic registry — 4 topics × 9 languages × 2 modes × 2 teachers = 144 mp3s.
// We use Vite's import.meta.glob (eager) so every audio URL ends up in the
// final bundle as a real static asset without listing 144 import lines.

import type { TeacherId } from './teachers';

import photosynthesisMeta from './topics/photosynthesis.json';
import frenchRevolutionMeta from './topics/french-revolution.json';
import dnaMeta from './topics/dna.json';
import blackHolesMeta from './topics/black-holes.json';

export type Language = 'en' | 'pl' | 'de' | 'es' | 'fr' | 'it' | 'tr' | 'nl' | 'pt';
export type Mode = 'normal' | 'eli5';

export type LocalizedScript = {
  title: string;
  subtitle: string;
  normal: string;
  eli5: string;
};

export type Topic = {
  id: string;
  emoji: string;
  accent: string;
  teacher: TeacherId;
  languages: Record<Language, LocalizedScript>;
};

// Eager-glob every mp3 in assets/audio — each value is the bundled URL string.
const audioModules = import.meta.glob('../assets/audio/*.mp3', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

const AUDIO_BUNDLE: Record<string, string> = {};
for (const [path, url] of Object.entries(audioModules)) {
  // path looks like '../assets/audio/photosynthesis-en-normal-alice.mp3' →
  // key 'photosynthesis-en-normal-alice'.
  const filename = path.split('/').pop()!.replace(/\.mp3$/, '');
  AUDIO_BUNDLE[filename] = url;
}

export const TOPICS: Topic[] = [
  photosynthesisMeta as Topic,
  frenchRevolutionMeta as Topic,
  dnaMeta as Topic,
  blackHolesMeta as Topic,
];

export function getAudio(
  topicId: string,
  lang: Language,
  mode: Mode,
  teacherId: TeacherId
): string {
  const key = `${topicId}-${lang}-${mode}-${teacherId}`;
  const url = AUDIO_BUNDLE[key];
  if (!url) throw new Error(`No audio for ${key}`);
  return url;
}
