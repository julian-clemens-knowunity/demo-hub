// Register your demos here
// Format: { id: 'unique-id', name: 'Display Name', component: YourComponent }

import HelloDemo from './demos/hello-demo/HelloDemo';
import QuizSort from './demos/quiz-sort/QuizSortScreen';

export const DEMOS = [
  {
    id: 'quiz-sort',
    name: 'Quiz Sort',
    component: QuizSort,
  },
  {
    id: 'hello',
    name: 'Hello Demo',
    component: HelloDemo,
  },
];
