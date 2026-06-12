export type TeacherId = 'alice' | 'bill';

export type Teacher = {
  id: TeacherId;
  name: string;
  blurb: string;
  emoji: string;
  accent: string;
};

export const TEACHERS: Teacher[] = [
  {
    id: 'alice',
    name: 'Alice',
    blurb: 'British, confident',
    emoji: '👩‍🏫',
    accent: '#E84DA2',
  },
  {
    id: 'bill',
    name: 'Bill',
    blurb: 'American, mature narrator',
    emoji: '👨‍🏫',
    accent: '#2B7FFF',
  },
];

export function getTeacher(id: TeacherId): Teacher {
  const t = TEACHERS.find((t) => t.id === id);
  if (!t) throw new Error(`Unknown teacher: ${id}`);
  return t;
}
