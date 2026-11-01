import raw from './lessons.json';
import type { Lesson, LessonsFile, ModuleInfo } from './types';

const file = raw as LessonsFile;

export const lessons: Lesson[] = [...file.lessons].sort((a, b) => a.n - b.n);

const moduleMeta: Record<string, { label: string; short: string; tagline: string }> = {
  'Старт': { label: 'Старт', short: 'Старт', tagline: 'Перед началом' },
  'Модуль 0 · Внутренний код': { label: 'Модуль 0', short: 'Внутренний код', tagline: 'Сначала смелость, потом контент' },
  'Модуль 1 · Упаковка': { label: 'Модуль 1', short: 'Упаковка', tagline: 'Профиль, понятный за 5 секунд' },
  'Модуль 2 · Контент-система': { label: 'Модуль 2', short: 'Контент-система', tagline: 'План, по которому легко снимать' },
  'Модуль 3 · ИИ без монтажёра': { label: 'Модуль 3', short: 'ИИ без монтажёра', tagline: 'Телефон, нейросеть и 15 минут' },
  'Модуль 4 · Заявки из блога': { label: 'Модуль 4', short: 'Заявки из блога', tagline: 'Чтобы блог приводил клиентов' },
};

export const modules: ModuleInfo[] = [];
for (const lesson of lessons) {
  let mod = modules.find((m) => m.key === lesson.module);
  if (!mod) {
    const meta = moduleMeta[lesson.module] ?? { label: lesson.module, short: lesson.module, tagline: '' };
    mod = { key: lesson.module, ...meta, lessons: [] };
    modules.push(mod);
  }
  mod.lessons.push(lesson);
}

export const pad = (n: number) => String(n).padStart(2, '0');

export function moduleOf(lesson: Lesson): ModuleInfo {
  return modules.find((m) => m.key === lesson.module)!;
}
