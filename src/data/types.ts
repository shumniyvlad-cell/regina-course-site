export interface LessonTask {
  title: string;
  time: string;
  items: string[];
}

export interface Lesson {
  n: number;
  slug: string;
  module: string;
  title: string;
  subtitle: string;
  duration: string;
  slides: number;
  inside: string[];
  task: LessonTask;
  hashtag: string | null;
}

export interface LessonsFile {
  course: string;
  note: string;
  lessons: Lesson[];
}

export interface ModuleInfo {
  key: string; // как в lessons.json → module
  label: string; // «Модуль 1 · Упаковка»
  short: string; // «Упаковка»
  tagline: string;
  lessons: Lesson[];
}

export type VideoProvider = 'kinescope' | 'vk' | 'rutube' | 'mp4' | 'none';

export interface VideoChapter {
  t: number;
  title: string;
}

export interface LessonVideo {
  provider: VideoProvider;
  id: string;
  duration?: number;
  chapters?: VideoChapter[];
}

export interface Material {
  id: string;
  title: string;
  note: string;
  file: string; // путь внутри public/
  download: string; // имя файла при скачивании
  kind: 'pdf' | 'xlsx' | 'txt';
  lessons: number[]; // к каким урокам
  temporary?: boolean;
}
