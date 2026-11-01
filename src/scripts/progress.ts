// Прогресс ученицы хранится только в этом браузере (localStorage). Любое чтение/запись — в try/catch:
// в приватном режиме или при запрете хранилища раздел должен работать, просто без памяти.
const KEY = 'vic-progress-v1';
export const TOTAL = 16;

export interface Progress {
  viewed: number[];
  done: number[];
  tasks: Record<string, boolean[]>;
  last: number | null;
}

const empty = (): Progress => ({ viewed: [], done: [], tasks: {}, last: null });

export function load(): Progress {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return empty();
    const p = JSON.parse(raw) as Partial<Progress>;
    return {
      viewed: Array.isArray(p.viewed) ? p.viewed : [],
      done: Array.isArray(p.done) ? p.done : [],
      tasks: p.tasks && typeof p.tasks === 'object' ? p.tasks : {},
      last: typeof p.last === 'number' ? p.last : null,
    };
  } catch {
    return empty();
  }
}

export function save(p: Progress): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* хранилище недоступно — молча работаем без памяти */
  }
}

const addUnique = (arr: number[], n: number) => (arr.includes(n) ? arr : [...arr, n].sort((a, b) => a - b));

export function markViewed(n: number): Progress {
  const p = load();
  p.viewed = addUnique(p.viewed, n);
  p.last = n;
  save(p);
  return p;
}

export function setDone(n: number, done = true): Progress {
  const p = load();
  p.done = done ? addUnique(p.done, n) : p.done.filter((x) => x !== n);
  save(p);
  return p;
}

export function setTask(n: number, idx: number, value: boolean, total: number): Progress {
  const p = load();
  const list = Array.from({ length: total }, (_, i) => !!p.tasks[n]?.[i]);
  list[idx] = value;
  p.tasks[n] = list;
  if (list.every(Boolean)) p.done = addUnique(p.done, n);
  save(p);
  return p;
}

/** Первый урок, где задание ещё не отмечено; null — всё пройдено */
export function nextLesson(p: Progress): number | null {
  for (let n = 0; n < TOTAL; n++) if (!p.done.includes(n)) return n;
  return null;
}
