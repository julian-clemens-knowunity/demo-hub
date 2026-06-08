import React, { useState } from 'react';
import { View } from 'react-native';
import TopicChooserScreen from './screens/TopicChooserScreen';
import TeacherChooserScreen from './screens/TeacherChooserScreen';
import TeacherScreen from './screens/TeacherScreen';
import { TOPICS } from './data/lectures';
import { TEACHERS } from './data/teachers';
import { TeacherId } from './data/types';

type Screen = 'topics' | 'teachers' | 'playing';

export default function KnowieTeacherScreen() {
  const [screen, setScreen] = useState<Screen>('topics');
  const [selectedTopic, setSelectedTopic] = useState<string>('');

  const topic = TOPICS.find(t => t.id === selectedTopic);
  const teacher = selectedTopic && topic ? TEACHERS[
    Object.keys(TEACHERS).find(k => TEACHERS[k as TeacherId]) as TeacherId
  ] : null;

  const lecture = selectedTopic && topic
    ? topic.lectures.find(l => l.teacher === 'einstein')
    : null;

  return (
    <View style={{ flex: 1 }}>
      {screen === 'topics' && (
        <TopicChooserScreen
          onPick={(topicId) => {
            setSelectedTopic(topicId);
            setScreen('teachers');
          }}
        />
      )}
      {screen === 'teachers' && selectedTopic && (
        <TeacherChooserScreen
          topicId={selectedTopic}
          onPick={(teacherId) => {
            setScreen('playing');
          }}
          onBack={() => {
            setScreen('topics');
          }}
        />
      )}
      {screen === 'playing' && lecture && (
        <TeacherScreen
          lecture={lecture}
          onBack={() => {
            setScreen('teachers');
          }}
        />
      )}
    </View>
  );
}
