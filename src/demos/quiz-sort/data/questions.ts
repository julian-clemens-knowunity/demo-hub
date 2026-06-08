// Extremely easy sorting questions — ragebait premise: "this is what AP Math is."
// Each question = drop tiles into one of two labeled boxes.

export type SortBox = 'left' | 'right';

export type SortTile = {
  id: string;
  label: string;        // what shows on the tile
  correct: SortBox;     // which box the tile belongs in
};

export type SortQuestion = {
  id: string;
  prompt: string;       // big question text
  hint?: string;        // small subtitle under the prompt
  leftLabel: string;    // header of the left box
  rightLabel: string;   // header of the right box
  leftColor: string;    // accent for the left box (KU palette)
  rightColor: string;
  tiles: SortTile[];
};

export const QUESTIONS: SortQuestion[] = [
  {
    id: 'even-odd',
    prompt: 'Sort each number',
    hint: 'Even or odd?',
    leftLabel: 'EVEN',
    rightLabel: 'ODD',
    leftColor: '#2B7FFF',
    rightColor: '#FF6900',
    tiles: [
      { id: 'q1-2', label: '2', correct: 'left' },
      { id: 'q1-7', label: '7', correct: 'right' },
      { id: 'q1-4', label: '4', correct: 'left' },
      { id: 'q1-9', label: '9', correct: 'right' },
    ],
  },
  {
    id: 'pos-neg',
    prompt: 'Positive or negative?',
    leftLabel: 'POSITIVE',
    rightLabel: 'NEGATIVE',
    leftColor: '#00C950',
    rightColor: '#FB2C36',
    tiles: [
      { id: 'q2-5', label: '5', correct: 'left' },
      { id: 'q2-n3', label: '−3', correct: 'right' },
      { id: 'q2-n7', label: '−7', correct: 'right' },
      { id: 'q2-8', label: '8', correct: 'left' },
    ],
  },
  {
    id: 'gt10-lt10',
    prompt: 'Greater or less than 10?',
    leftLabel: '> 10',
    rightLabel: '< 10',
    leftColor: '#8E51FF',
    rightColor: '#2B7FFF',
    tiles: [
      { id: 'q3-12', label: '12', correct: 'left' },
      { id: 'q3-4', label: '4', correct: 'right' },
      { id: 'q3-20', label: '20', correct: 'left' },
      { id: 'q3-3', label: '3', correct: 'right' },
    ],
  },
  {
    id: 'eq10',
    prompt: 'Does it equal 10?',
    hint: 'just add the two numbers',
    leftLabel: '= 10',
    rightLabel: '≠ 10',
    leftColor: '#00C950',
    rightColor: '#FB2C36',
    tiles: [
      { id: 'q4-5+5', label: '5 + 5', correct: 'left' },
      { id: 'q4-3+4', label: '3 + 4', correct: 'right' },
      { id: 'q4-2+8', label: '2 + 8', correct: 'left' },
      { id: 'q4-6+1', label: '6 + 1', correct: 'right' },
    ],
  },
  {
    id: 'whole-frac',
    prompt: 'Whole number or fraction?',
    leftLabel: 'WHOLE',
    rightLabel: 'FRACTION',
    leftColor: '#2B7FFF',
    rightColor: '#E84DA2',
    tiles: [
      { id: 'q5-5', label: '5', correct: 'left' },
      { id: 'q5-half', label: '½', correct: 'right' },
      { id: 'q5-7', label: '7', correct: 'left' },
      { id: 'q5-3-4', label: '¾', correct: 'right' },
    ],
  },
];
