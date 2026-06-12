import type { TeacherId } from './teachers';

import photosynthesisMeta from './topics/photosynthesis.json';
import frenchRevolutionMeta from './topics/french-revolution.json';
import dnaMeta from './topics/dna.json';
import blackHolesMeta from './topics/black-holes.json';

// Static imports for all 48 mp3s — Vite needs real `import` statements
// (not require()) to bundle them as proper URLs.
import phEnNormalAlice from '../assets/audio/photosynthesis-en-normal-alice.mp3';
import phEnNormalBill from '../assets/audio/photosynthesis-en-normal-bill.mp3';
import phEnEli5Alice from '../assets/audio/photosynthesis-en-eli5-alice.mp3';
import phEnEli5Bill from '../assets/audio/photosynthesis-en-eli5-bill.mp3';
import phPlNormalAlice from '../assets/audio/photosynthesis-pl-normal-alice.mp3';
import phPlNormalBill from '../assets/audio/photosynthesis-pl-normal-bill.mp3';
import phPlEli5Alice from '../assets/audio/photosynthesis-pl-eli5-alice.mp3';
import phPlEli5Bill from '../assets/audio/photosynthesis-pl-eli5-bill.mp3';
import phDeNormalAlice from '../assets/audio/photosynthesis-de-normal-alice.mp3';
import phDeNormalBill from '../assets/audio/photosynthesis-de-normal-bill.mp3';
import phDeEli5Alice from '../assets/audio/photosynthesis-de-eli5-alice.mp3';
import phDeEli5Bill from '../assets/audio/photosynthesis-de-eli5-bill.mp3';

import frEnNormalAlice from '../assets/audio/french-revolution-en-normal-alice.mp3';
import frEnNormalBill from '../assets/audio/french-revolution-en-normal-bill.mp3';
import frEnEli5Alice from '../assets/audio/french-revolution-en-eli5-alice.mp3';
import frEnEli5Bill from '../assets/audio/french-revolution-en-eli5-bill.mp3';
import frPlNormalAlice from '../assets/audio/french-revolution-pl-normal-alice.mp3';
import frPlNormalBill from '../assets/audio/french-revolution-pl-normal-bill.mp3';
import frPlEli5Alice from '../assets/audio/french-revolution-pl-eli5-alice.mp3';
import frPlEli5Bill from '../assets/audio/french-revolution-pl-eli5-bill.mp3';
import frDeNormalAlice from '../assets/audio/french-revolution-de-normal-alice.mp3';
import frDeNormalBill from '../assets/audio/french-revolution-de-normal-bill.mp3';
import frDeEli5Alice from '../assets/audio/french-revolution-de-eli5-alice.mp3';
import frDeEli5Bill from '../assets/audio/french-revolution-de-eli5-bill.mp3';

import dnaEnNormalAlice from '../assets/audio/dna-en-normal-alice.mp3';
import dnaEnNormalBill from '../assets/audio/dna-en-normal-bill.mp3';
import dnaEnEli5Alice from '../assets/audio/dna-en-eli5-alice.mp3';
import dnaEnEli5Bill from '../assets/audio/dna-en-eli5-bill.mp3';
import dnaPlNormalAlice from '../assets/audio/dna-pl-normal-alice.mp3';
import dnaPlNormalBill from '../assets/audio/dna-pl-normal-bill.mp3';
import dnaPlEli5Alice from '../assets/audio/dna-pl-eli5-alice.mp3';
import dnaPlEli5Bill from '../assets/audio/dna-pl-eli5-bill.mp3';
import dnaDeNormalAlice from '../assets/audio/dna-de-normal-alice.mp3';
import dnaDeNormalBill from '../assets/audio/dna-de-normal-bill.mp3';
import dnaDeEli5Alice from '../assets/audio/dna-de-eli5-alice.mp3';
import dnaDeEli5Bill from '../assets/audio/dna-de-eli5-bill.mp3';

import bhEnNormalAlice from '../assets/audio/black-holes-en-normal-alice.mp3';
import bhEnNormalBill from '../assets/audio/black-holes-en-normal-bill.mp3';
import bhEnEli5Alice from '../assets/audio/black-holes-en-eli5-alice.mp3';
import bhEnEli5Bill from '../assets/audio/black-holes-en-eli5-bill.mp3';
import bhPlNormalAlice from '../assets/audio/black-holes-pl-normal-alice.mp3';
import bhPlNormalBill from '../assets/audio/black-holes-pl-normal-bill.mp3';
import bhPlEli5Alice from '../assets/audio/black-holes-pl-eli5-alice.mp3';
import bhPlEli5Bill from '../assets/audio/black-holes-pl-eli5-bill.mp3';
import bhDeNormalAlice from '../assets/audio/black-holes-de-normal-alice.mp3';
import bhDeNormalBill from '../assets/audio/black-holes-de-normal-bill.mp3';
import bhDeEli5Alice from '../assets/audio/black-holes-de-eli5-alice.mp3';
import bhDeEli5Bill from '../assets/audio/black-holes-de-eli5-bill.mp3';

export type Language = 'en' | 'pl' | 'de';
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
  languages: Record<Language, LocalizedScript>;
};

type AudioMap = Record<
  string,
  Record<Language, Record<Mode, Record<TeacherId, string>>>
>;

const AUDIO: AudioMap = {
  photosynthesis: {
    en: {
      normal: { alice: phEnNormalAlice, bill: phEnNormalBill },
      eli5: { alice: phEnEli5Alice, bill: phEnEli5Bill },
    },
    pl: {
      normal: { alice: phPlNormalAlice, bill: phPlNormalBill },
      eli5: { alice: phPlEli5Alice, bill: phPlEli5Bill },
    },
    de: {
      normal: { alice: phDeNormalAlice, bill: phDeNormalBill },
      eli5: { alice: phDeEli5Alice, bill: phDeEli5Bill },
    },
  },
  'french-revolution': {
    en: {
      normal: { alice: frEnNormalAlice, bill: frEnNormalBill },
      eli5: { alice: frEnEli5Alice, bill: frEnEli5Bill },
    },
    pl: {
      normal: { alice: frPlNormalAlice, bill: frPlNormalBill },
      eli5: { alice: frPlEli5Alice, bill: frPlEli5Bill },
    },
    de: {
      normal: { alice: frDeNormalAlice, bill: frDeNormalBill },
      eli5: { alice: frDeEli5Alice, bill: frDeEli5Bill },
    },
  },
  dna: {
    en: {
      normal: { alice: dnaEnNormalAlice, bill: dnaEnNormalBill },
      eli5: { alice: dnaEnEli5Alice, bill: dnaEnEli5Bill },
    },
    pl: {
      normal: { alice: dnaPlNormalAlice, bill: dnaPlNormalBill },
      eli5: { alice: dnaPlEli5Alice, bill: dnaPlEli5Bill },
    },
    de: {
      normal: { alice: dnaDeNormalAlice, bill: dnaDeNormalBill },
      eli5: { alice: dnaDeEli5Alice, bill: dnaDeEli5Bill },
    },
  },
  'black-holes': {
    en: {
      normal: { alice: bhEnNormalAlice, bill: bhEnNormalBill },
      eli5: { alice: bhEnEli5Alice, bill: bhEnEli5Bill },
    },
    pl: {
      normal: { alice: bhPlNormalAlice, bill: bhPlNormalBill },
      eli5: { alice: bhPlEli5Alice, bill: bhPlEli5Bill },
    },
    de: {
      normal: { alice: bhDeNormalAlice, bill: bhDeNormalBill },
      eli5: { alice: bhDeEli5Alice, bill: bhDeEli5Bill },
    },
  },
};

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
  const m = AUDIO[topicId];
  if (!m) throw new Error(`No audio map for topic: ${topicId}`);
  return m[lang][mode][teacherId];
}
