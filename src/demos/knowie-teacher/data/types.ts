// ───────── TOPIC (pure content, teacher-agnostic) ─────────

export type BeatHint =
  | 'opener'      // hook line, slightly bored/disinterested
  | 'setup'       // delivering factual setup
  | 'curious'    // asking a question
  | 'reveal'      // the "wait what" moment
  | 'punchline'   // the joke / payoff
  | 'flex'        // closing victory smug
  | 'closer';     // sign-off

export type CaptionBeat = {
  text: string;        // visible caption
  hint: BeatHint;      // maps to a face per teacher
  highlight?: string;  // substring rendered in accent color
};

export type Topic = {
  id: string;
  title: string;        // big topic line on the pre-roll card
  subtitle: string;     // small line below the title
  eyebrow: string;      // e.g. "🧬 BIO 101"
  emoji: string;        // chooser tile icon
  scriptText: string;   // full continuous text sent to ElevenLabs
  beats: CaptionBeat[]; // ordered, must collectively cover scriptText
};

// ───────── TEACHER (voice + character) ─────────

export type TeacherId = 'einstein' | 'knowie' | 'obama';
export type EinsteinFace = 'standby' | 'curious' | 'laughing' | 'exasperated';
export type ObamaFace = 'standby' | 'curious' | 'laughing' | 'exasperated';
export type KnowieFace =
  | 'standby' | 'approving' | 'excited' | 'laughing' | 'giggling'
  | 'amazed' | 'angry' | 'dazed' | 'overIt' | 'confused' | 'questioning';

export type Teacher = {
  id: TeacherId;
  displayName: string;       // 'Einstein' / 'Knowie'
  voiceName: string;         // shown on chooser, e.g. 'George · warm British'
  elevenLabsVoiceId: string; // ElevenLabs library voice ID
  voiceSettings: {
    stability: number;
    similarity_boost: number;
    style: number;
    use_speaker_boost: boolean;
    speed: number;
  };
  accentColor: string;       // eyebrow + highlight + dots
  // Maps BeatHint → character-specific face. Each teacher uses its own face palette.
  faceMap: Record<BeatHint, string>;
};

// ───────── RENDERED LECTURE (topic × teacher × generated audio) ─────────

// Beat with timing resolved against actual mp3 (auto-derived from ElevenLabs
// /with-timestamps API alignment by the generate-voice.mjs script).
export type RenderedBeat = {
  caption: string;
  highlight?: string;
  face: string;       // resolved via teacher.faceMap[hint]
  startMs: number;
  durationMs: number;
};

export type RenderedLecture = {
  topic: Topic;
  teacher: Teacher;
  beats: RenderedBeat[];
  totalMs: number;
  audioFile: number;       // require() result
  envelope: number[][];    // [[ms, dB], ...] for lip-sync
};
