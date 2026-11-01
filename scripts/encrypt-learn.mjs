// Шифрует закрытый раздел dist/learn/**/*.html паролем из COURSE_PASSWORD (StatiCrypt).
// Запускается после `astro build` (npm run build). Без пароля — падает и удаляет dist/learn,
// чтобы открытые уроки не уехали на хостинг.
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync, rmSync, mkdtempSync, readdirSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const learn = join(dist, 'learn');

try {
  process.loadEnvFile(join(root, '.env'));
} catch {
  /* .env нет — берём переменные окружения (GitHub Actions) */
}

const fail = (msg) => {
  if (existsSync(learn)) rmSync(learn, { recursive: true, force: true });
  console.error(`\n✖ encrypt-learn: ${msg}\n  Раздел dist/learn удалён, чтобы не выложить уроки без пароля.\n`);
  process.exit(1);
};

const password = process.env.COURSE_PASSWORD?.trim();
if (!password) fail('нет переменной COURSE_PASSWORD. Локально — site/.env (см. .env.example), в GitHub — секрет COURSE_PASSWORD.');
if (password.length < 8) fail('COURSE_PASSWORD короче 8 символов.');
if (!existsSync(learn)) fail('нет dist/learn — сначала astro build.');

// base берём из собранной главной (<link rel="icon" href="<base>favicon.svg">)
const indexHtml = readFileSync(join(dist, 'index.html'), 'utf8');
const base = /href="([^"]*)favicon\.svg"/.exec(indexHtml)?.[1] ?? '/';

const tmp = mkdtempSync(join(tmpdir(), 'staticrypt-'));
const template = join(tmp, 'password_template.html');
writeFileSync(template, readFileSync(join(root, 'scripts/password_template.html'), 'utf8').replaceAll('%%BASE%%', base));

const bin = join(root, 'node_modules/.bin/staticrypt');
const result = spawnSync(
  bin,
  [
    learn,
    '--recursive',
    '--directory', dist,
    '--config', '.staticrypt.json',
    '--remember', '30',
    '--short',
    '--template', template,
    '--template-title', 'Ваши уроки — «Выйти из черновиков»',
    '--template-button', 'Открыть',
    '--template-placeholder', 'Пароль из бота',
    '--template-remember', 'Запомнить на этом устройстве',
    '--template-error', 'Пароль не подошёл. Проверьте раскладку или скопируйте его из сообщения бота.',
    '--template-toggle-show', 'Показать пароль',
    '--template-toggle-hide', 'Скрыть пароль',
  ],
  { cwd: root, stdio: ['ignore', 'inherit', 'inherit'], env: { ...process.env, STATICRYPT_PASSWORD: password } },
);
rmSync(tmp, { recursive: true, force: true });
if (result.status !== 0) fail(`StatiCrypt завершился с кодом ${result.status}.`);

// проверка: ни одной открытой страницы раздела
const files = [];
const walk = (dir) => readdirSync(dir).forEach((f) => (statSync(join(dir, f)).isDirectory() ? walk(join(dir, f)) : f.endsWith('.html') && files.push(join(dir, f))));
walk(learn);
const open = files.filter((f) => !readFileSync(f, 'utf8').includes('staticrypt'));
if (open.length) fail(`не зашифрованы: ${open.join(', ')}`);
console.log(`✔ encrypt-learn: зашифровано страниц — ${files.length}`);
