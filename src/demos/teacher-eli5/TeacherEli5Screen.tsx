import { useState, useEffect } from 'react';
import { TopicChooserScreen } from './screens/TopicChooserScreen';
import { LectureScreen } from './screens/LectureScreen';
import { getTeacher } from './data/teachers';
import type { Topic, Language } from './data/topics';

function setBodyBg(color: string) {
  if (typeof document === 'undefined') return;
  document.body.style.backgroundColor = color;
  document.documentElement.style.backgroundColor = color;
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  if (themeMeta) themeMeta.setAttribute('content', color);
}

export default function TeacherEli5Screen() {
  const [language, setLanguage] = useState<Language>('en');
  const [topic, setTopic] = useState<Topic | null>(null);

  useEffect(() => {
    setBodyBg('#000000');
  }, []);

  if (!topic) {
    return (
      <TopicChooserScreen
        language={language}
        onLanguageChange={setLanguage}
        onPick={setTopic}
      />
    );
  }
  return (
    <LectureScreen
      topic={topic}
      teacher={getTeacher(topic.teacher)}
      language={language}
      onBack={() => setTopic(null)}
    />
  );
}
