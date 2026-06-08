import { Teacher } from './types';

// ElevenLabs default library voice IDs (public, free tier accessible)
export const TEACHERS: Record<'einstein' | 'knowie' | 'obama', Teacher> = {
  einstein: {
    id: 'einstein',
    displayName: 'Einstein',
    voiceName: 'George · warm British storyteller',
    elevenLabsVoiceId: 'JBFqnCBsd6RMkjVDRZzb', // George
    voiceSettings: {
      stability: 0.5,
      similarity_boost: 0.75,
      style: 0,
      use_speaker_boost: true,
      speed: 1.0,
    },
    accentColor: '#FFC960',
    faceMap: {
      opener:    'standby',
      setup:     'curious',
      curious:   'curious',
      reveal:    'exasperated',
      punchline: 'laughing',
      flex:      'exasperated',
      closer:    'laughing',
    },
  },
  knowie: {
    id: 'knowie',
    displayName: 'Knowie',
    voiceName: 'Charlie · young Aussie casual',
    elevenLabsVoiceId: 'IKne3meq5aSn9XLyUdCD', // Charlie
    voiceSettings: {
      stability: 0.5,
      similarity_boost: 0.75,
      style: 0,
      use_speaker_boost: true,
      speed: 1.0,
    },
    accentColor: '#00C950',
    faceMap: {
      opener:    'overIt',
      setup:     'questioning',
      curious:   'questioning',
      reveal:    'amazed',
      punchline: 'laughing',
      flex:      'giggling',
      closer:    'laughing',
    },
  },
  obama: {
    id: 'obama',
    displayName: 'Obama',
    voiceName: 'Bill · mature American narrator',
    elevenLabsVoiceId: 'pqHfZKP75CvOlQylNhV4', // Bill
    voiceSettings: {
      stability: 0.55,         // slightly steadier — measured presidential cadence
      similarity_boost: 0.78,
      style: 0,
      use_speaker_boost: true,
      speed: 0.97,             // a touch slower than the other two
    },
    accentColor: '#3D8BFF',    // presidential blue
    faceMap: {
      opener:    'curious',
      setup:     'standby',
      curious:   'curious',
      reveal:    'exasperated',
      punchline: 'laughing',
      flex:      'standby',
      closer:    'laughing',
    },
  },
};
