import type { LessonVideo, VideoProvider } from './types';

// Видео уроков не хранятся в репозитории: на билде читаем секрет LESSON_VIDEOS_JSON
// формата {"0": {"provider": "kinescope", "id": "…", "duration": 412, "chapters": [{"t": 0, "title": "…"}]}}
const PROVIDERS: VideoProvider[] = ['kinescope', 'vk', 'rutube', 'mp4', 'none'];

function parse(): Record<string, LessonVideo> {
  const raw = process.env.LESSON_VIDEOS_JSON?.trim();
  if (!raw) return {};
  try {
    const data = JSON.parse(raw) as Record<string, Partial<LessonVideo>>;
    const out: Record<string, LessonVideo> = {};
    for (const [key, v] of Object.entries(data)) {
      if (!v || !v.provider || !PROVIDERS.includes(v.provider)) continue;
      out[String(Number(key))] = {
        provider: v.provider,
        id: String(v.id ?? ''),
        duration: typeof v.duration === 'number' ? v.duration : undefined,
        chapters: Array.isArray(v.chapters) ? v.chapters.filter((c) => typeof c?.t === 'number' && c.title) : [],
      };
    }
    return out;
  } catch (err) {
    throw new Error(`LESSON_VIDEOS_JSON: невалидный JSON (${(err as Error).message})`);
  }
}

const videos = parse();

export function videoFor(n: number): LessonVideo {
  const v = videos[String(n)];
  if (!v || v.provider === 'none' || !v.id) return { provider: 'none', id: '', chapters: [] };
  return v;
}
