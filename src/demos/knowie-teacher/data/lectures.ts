import { Topic, TeacherId, RenderedLecture, RenderedBeat } from './types';
import { TEACHERS } from './teachers';

import bioTopic from './topics/bio.json';
import divideZeroTopic from './topics/divide-zero.json';
import pemdasTopic from './topics/pemdas.json';
import ww1Topic from './topics/ww1.json';
import pledgeTopic from './topics/pledge.json';

// Static require() calls for all 10 (topic × teacher) renders. Metro can't
// resolve dynamic require paths, so each combination is listed explicitly.
// To add a new topic: create the JSON + run `node scripts/generate-voice.mjs
// <topic> einstein` and `<topic> knowie`, then add 6 lines here (3 per teacher).
const ASSETS = {
  bio: {
    einstein: {
      mp3: require('../../assets/audio/bio-einstein.mp3'),
      envelope: require('../../assets/audio/bio-einstein.envelope.json'),
      beats: require('../../assets/audio/bio-einstein.beats.json'),
    },
    knowie: {
      mp3: require('../../assets/audio/bio-knowie.mp3'),
      envelope: require('../../assets/audio/bio-knowie.envelope.json'),
      beats: require('../../assets/audio/bio-knowie.beats.json'),
    },
    obama: {
      mp3: require('../../assets/audio/bio-obama.mp3'),
      envelope: require('../../assets/audio/bio-obama.envelope.json'),
      beats: require('../../assets/audio/bio-obama.beats.json'),
    },
  },
  'divide-zero': {
    einstein: {
      mp3: require('../../assets/audio/divide-zero-einstein.mp3'),
      envelope: require('../../assets/audio/divide-zero-einstein.envelope.json'),
      beats: require('../../assets/audio/divide-zero-einstein.beats.json'),
    },
    knowie: {
      mp3: require('../../assets/audio/divide-zero-knowie.mp3'),
      envelope: require('../../assets/audio/divide-zero-knowie.envelope.json'),
      beats: require('../../assets/audio/divide-zero-knowie.beats.json'),
    },
    obama: {
      mp3: require('../../assets/audio/divide-zero-obama.mp3'),
      envelope: require('../../assets/audio/divide-zero-obama.envelope.json'),
      beats: require('../../assets/audio/divide-zero-obama.beats.json'),
    },
  },
  pemdas: {
    einstein: {
      mp3: require('../../assets/audio/pemdas-einstein.mp3'),
      envelope: require('../../assets/audio/pemdas-einstein.envelope.json'),
      beats: require('../../assets/audio/pemdas-einstein.beats.json'),
    },
    knowie: {
      mp3: require('../../assets/audio/pemdas-knowie.mp3'),
      envelope: require('../../assets/audio/pemdas-knowie.envelope.json'),
      beats: require('../../assets/audio/pemdas-knowie.beats.json'),
    },
    obama: {
      mp3: require('../../assets/audio/pemdas-obama.mp3'),
      envelope: require('../../assets/audio/pemdas-obama.envelope.json'),
      beats: require('../../assets/audio/pemdas-obama.beats.json'),
    },
  },
  ww1: {
    einstein: {
      mp3: require('../../assets/audio/ww1-einstein.mp3'),
      envelope: require('../../assets/audio/ww1-einstein.envelope.json'),
      beats: require('../../assets/audio/ww1-einstein.beats.json'),
    },
    knowie: {
      mp3: require('../../assets/audio/ww1-knowie.mp3'),
      envelope: require('../../assets/audio/ww1-knowie.envelope.json'),
      beats: require('../../assets/audio/ww1-knowie.beats.json'),
    },
    obama: {
      mp3: require('../../assets/audio/ww1-obama.mp3'),
      envelope: require('../../assets/audio/ww1-obama.envelope.json'),
      beats: require('../../assets/audio/ww1-obama.beats.json'),
    },
  },
  pledge: {
    einstein: {
      mp3: require('../../assets/audio/pledge-einstein.mp3'),
      envelope: require('../../assets/audio/pledge-einstein.envelope.json'),
      beats: require('../../assets/audio/pledge-einstein.beats.json'),
    },
    knowie: {
      mp3: require('../../assets/audio/pledge-knowie.mp3'),
      envelope: require('../../assets/audio/pledge-knowie.envelope.json'),
      beats: require('../../assets/audio/pledge-knowie.beats.json'),
    },
    obama: {
      mp3: require('../../assets/audio/pledge-obama.mp3'),
      envelope: require('../../assets/audio/pledge-obama.envelope.json'),
      beats: require('../../assets/audio/pledge-obama.beats.json'),
    },
  },
} as const;

// Topic order on the chooser (chooser renders this array directly).
export const TOPICS: Topic[] = [
  bioTopic, divideZeroTopic, pemdasTopic, ww1Topic, pledgeTopic,
] as unknown as Topic[];

export function getLecture(topicId: string, teacherId: TeacherId): RenderedLecture {
  const topic = TOPICS.find(t => t.id === topicId);
  if (!topic) throw new Error(`Unknown topic: ${topicId}`);
  const teacher = TEACHERS[teacherId];
  const audio = (ASSETS as any)[topicId]?.[teacherId];
  if (!audio) throw new Error(`No audio for ${topicId} × ${teacherId}`);
  return {
    topic,
    teacher,
    audioFile: audio.mp3,
    envelope: audio.envelope as number[][],
    beats: audio.beats.beats as RenderedBeat[],
    totalMs: audio.beats.totalMs as number,
  };
}
