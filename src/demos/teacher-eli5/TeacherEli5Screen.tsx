import { useState, useEffect } from 'react';
import { TopicChooserScreen } from './screens/TopicChooserScreen';
import { TeacherChooserScreen } from './screens/TeacherChooserScreen';
import { LectureScreen } from './screens/LectureScreen';
import type { Topic, Language } from './data/topics';
import type { Teacher } from './data/teachers';

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
  const [teacher, setTeacher] = useState<Teacher | null>(null);

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
  if (!teacher) {
    return (
      <TeacherChooserScreen
        topic={topic}
        language={language}
        onPick={setTeacher}
        onBack={() => setTopic(null)}
      />
    );
  }
  return (
    <LectureScreen
      topic={topic}
      teacher={teacher}
      language={language}
      onBack={() => {
        setTeacher(null);
        setTopic(null);
      }}
    />
  );
}
