# Сайт видеокурса «Выйти из черновиков»

Статический сайт на Astro: лендинг курса Регины Репортёр + закрытый раздел уроков `/learn/` под паролем (StatiCrypt). Деплой — GitHub Pages через GitHub Actions на каждый push в `main`.

Живой адрес: https://shumniyvlad-cell.github.io/regina-course-site/

## Что где менять

Всё, что меняется без программиста, — в `src/config.ts`:

| Что | Где в `config.ts` |
|---|---|
| Цены тарифов | `prices` |
| Предпродажа (3 990 ₽ крупно, 4 990 ₽ зачёркнуто) | `presale.enabled: true` и дата `presale.until`. После даты сайт сам вернёт обычную цену |
| Ссылки бота (start-параметры) | `bot` |
| Показать блок отзывов | положить скрины в `src/assets/reviews/` и `flags.showReviews: true` |
| Трейлер на первом экране | `trailer` + `flags.showTrailer: true` |
| ФИО, ИНН, e-mail, срок подтверждения оплаты, условия возврата | `legal`, `contacts` |

Уроки (названия, «что внутри», задания) — `src/data/lessons.json`. Материалы и к каким урокам они относятся — `src/data/materials.ts` (файлы лежат в `public/m/`).

После правки: `git commit` → `git push` → через 1–2 минуты сайт обновится.

## Пароль раздела уроков

Пароль хранится только в секрете репозитория `COURSE_PASSWORD`. Сменить:

```bash
gh secret set COURSE_PASSWORD
gh workflow run deploy.yml
```

Всем, кто уже вводил пароль, придётся ввести новый.

## Видео уроков (этап 2)

Ссылки на видео не хранятся в репозитории. Они приходят на сборке из секрета `LESSON_VIDEOS_JSON`:

```json
{
  "0": { "provider": "kinescope", "id": "abc123", "duration": 412, "chapters": [{ "t": 0, "title": "Что будет в конце курса" }] },
  "1": { "provider": "rutube", "id": "<id>?p=<ключ приватного видео>" },
  "2": { "provider": "vk", "id": "-123456_456239017_<hash>" },
  "3": { "provider": "mp4", "id": "https://…/lesson-03.mp4" }
}
```

Провайдеры: `kinescope`, `vk`, `rutube`, `mp4`, `none`. Урока нет в JSON — на странице заглушка «Видео скоро появится». Главы (`chapters`) становятся кликабельными таймкодами; переход по главе гарантированно работает у Kinescope и mp4, у VK и Rutube — как поддерживает их плеер.

```bash
gh secret set LESSON_VIDEOS_JSON < videos.json
gh workflow run deploy.yml
```

## Локальный запуск

```bash
npm ci
cp .env.example .env   # вписать свой COURSE_PASSWORD
npm run dev            # http://localhost:4321/regina-course-site/
npm run build          # проверка типов + сборка + шифрование /learn в dist/
```

Без `COURSE_PASSWORD` сборка падает и удаляет `dist/learn` — открытые уроки не уедут на хостинг.

## Что важно знать про защиту

- StatiCrypt шифрует HTML страниц `/learn/`. Пароль запоминается в браузере на 30 дней.
- Файлы материалов в `public/m/` открываются по прямой ссылке без пароля (у них неочевидные имена, но это не защита). Совсем закрытые файлы лучше раздавать через бота.
- `robots.txt` для адреса github.io/<репозиторий> поисковики не читают (только с корня домена), поэтому страницы раздела дополнительно закрыты `noindex`. Со своим доменом `robots.txt` заработает.

## Свой домен

1. Создать файл `public/CNAME` с доменом, например `kurs.example.ru`.
2. У регистратора:
   - для корневого домена — A-записи `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`;
   - для `www` — CNAME на `shumniyvlad-cell.github.io`.
3. В репозитории: Settings → Pages → Custom domain → домен, дождаться проверки и включить Enforce HTTPS.
4. В `src/config.ts`: `site: 'https://домен'`, `base: '/'`. Закоммитить и запушить.

## Стек

Astro 7 + TypeScript strict, свой CSS (токены в `src/styles/global.css`), шрифты Montserrat и JetBrains Mono локально (`@fontsource`), иконки `@lucide/astro`, картинки через `astro:assets` (AVIF/WebP). Никаких внешних CDN, аналитики и cookies.
