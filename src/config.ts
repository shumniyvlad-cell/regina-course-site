// Всё, что Влад может менять на сайте, — здесь.
// После правки: git commit + push → GitHub Actions пересоберёт сайт.

const BOT = 'https://t.me/reporter_code_bot';

export const config = {
  // Адрес сайта. Свой домен: site: 'https://домен.ru', base: '/' (+ public/CNAME, см. README)
  site: 'https://smmvmedia.ru',
  base: '/',

  brand: {
    course: 'Выйти из черновиков',
    tagline: '21 день от черновиков к живому блогу — с ИИ и без монтажёра.',
    school: 'SMM.CODE',
    author: 'Регина Репортёр',
    agency: 'VMEDIA',
  },

  // Deep links бота. start-параметры бот должен научиться понимать (список — в README)
  bot: {
    username: 'reporter_code_bot',
    main: `${BOT}?start=site`,
    sama: `${BOT}?start=site_sama`,
    razbor: `${BOT}?start=site_razbor`,
    regina: `${BOT}?start=site_regina`,
    free: `${BOT}?start=site_free`,
    done: (n: number) => `${BOT}?start=done_${String(n).padStart(2, '0')}`,
    plain: BOT,
  },

  prices: {
    sama: 6600,
    samaStart: 5900, // цена старта: предпродажа и 48 часов после челленджа
    razbor: 9900,
    reginaFrom: 14900,
  },

  // Предпродажа: enabled: true → 5 900 ₽ крупно, 6 600 ₽ зачёркнуто, «до <дата>».
  // После даты сайт сам (в браузере) вернёт обычную цену.
  presale: {
    enabled: false,
    until: '2026-11-30T23:59:59+03:00', // [дата окончания цены старта — уточнить]
  },

  flags: {
    showReviews: false, // включить, когда в src/assets/reviews/ появятся скрины
    showTrailer: false, // включить на этапе 2, когда будет трейлер
    learnEnabled: true, // ссылка «Мои уроки» в подвале
  },

  // Трейлер (этап 2): provider kinescope | vk | rutube | mp4
  trailer: { provider: 'none', id: '' } as { provider: string; id: string },

  contacts: {
    telegram: 'https://t.me/reginareporter',
    telegramLabel: 't.me/reginareporter',
    instagram: 'https://instagram.com/regina.reporter',
    instagramLabel: '@regina.reporter',
    agencyInstagram: 'https://instagram.com/smm.vmedia',
    agencyInstagramLabel: '@smm.vmedia',
    email: '[e-mail для обращений]',
  },

  legal: {
    fullName: 'Нуриева Регина Руслановна',
    inn: '025302267370',
    status: 'самозанятая',
    paymentConfirm: 'сразу после оплаты',
    refund: '[условия возврата — уточнить]',
    documentsDate: '5 ноября 2026',
  },
} as const;

export type SiteConfig = typeof config;

/** 4990 → «4 990 ₽» с неразрывными пробелами */
export function rub(value: number): string {
  return `${value.toLocaleString('ru-RU').replace(/\s/g, ' ')} ₽`;
}

/** Путь с учётом base: url('learn/') → '/learn/' */
export function url(path = ''): string {
  const base = import.meta.env.BASE_URL.replace(/\/?$/, '/');
  return base + path.replace(/^\//, '');
}

/** Цена «от …» для липкой кнопки (на билде; в браузере пересчитывает presale.ts) */
export function presaleActiveAtBuild(): boolean {
  return config.presale.enabled && Date.now() < Date.parse(config.presale.until);
}
