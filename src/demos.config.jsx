// Register your demos here
// Format: { id: 'unique-id', name: 'Display Name', component: YourComponent }

import QuizSort from './demos/quiz-sort/QuizSortScreen';
import KickGame from './demos/kick-game/KickGameScreen';
import TeacherEli5 from './demos/teacher-eli5/TeacherEli5Screen';

export const DEMOS = [
  {
    id: 'kick-game',
    name: 'Kick Game',
    component: KickGame,
    // bgColor matches the floor color so the iPhone safe-area at the bottom blends in
    bgColor: '#5C8FCB',
  },
  {
    id: 'quiz-sort',
    name: 'Quiz Sort',
    component: QuizSort,
    bgColor: '#0a0a0a',
  },
  {
    id: 'teacher-eli5',
    name: 'Talking Teacher',
    component: TeacherEli5,
    bgColor: '#000000',
  },
];
