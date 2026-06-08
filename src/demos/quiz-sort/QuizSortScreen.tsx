import React, { useState } from 'react';
import { View } from 'react-native';
import HookScreen from './screens/HookScreen';
import QuizScreen from './screens/QuizScreen';
import ResultScreen from './screens/ResultScreen';

type Screen = 'hook' | 'quiz' | 'result';

export default function QuizSortScreen() {
  const [screen, setScreen] = useState<Screen>('hook');
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);

  return (
    <View style={{ flex: 1 }}>
      {screen === 'hook' && (
        <HookScreen onStart={() => setScreen('quiz')} />
      )}
      {screen === 'quiz' && (
        <QuizScreen
          onComplete={(s, t) => {
            setScore(s);
            setTotal(t);
            setScreen('result');
          }}
        />
      )}
      {screen === 'result' && (
        <ResultScreen
          score={score}
          total={total}
          onRestart={() => {
            setScore(0);
            setTotal(0);
            setScreen('hook');
          }}
        />
      )}
    </View>
  );
}
