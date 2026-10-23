// Главные настройки сайта — меняй здесь.
export const SITE = {
  title: 'paracels mods',
  author: 'paracels',
  description: 'Каталог модов для Minecraft: тематические страницы, вики и версии каждого мода.',
  heroTitle: 'Моды для', // + выделенное слово ниже
  heroAccent: 'Minecraft',
  tagline: 'Каталог модов с тематическими страницами, вики и версиями. Есть свой мод? Добавь его в каталог.',
  // Ссылки в шапке и подвале. Пустые — не показываются.
  github: '', // например 'https://github.com/paracels'
  discord: '',
  // Репозиторий сайта (ник/репо) — сюда приходят заявки на добавление модов (GitHub Issues).
  // На GitHub Actions определяется сам; впиши вручную, если собираешь сайт где-то ещё.
  repo: process.env.GITHUB_REPOSITORY || '',
  // Реакции и комментарии на страницах модов (giscus + GitHub Discussions).
  // Как получить repoId и categoryId — в README, раздел «Реакции и комментарии».
  // Пока они пустые, блок комментариев не показывается.
  giscus: {
    repoId: 'R_kgDOVURDnQ',
    category: 'Отзывы',
    categoryId: 'DIC_kwDOVURDnc4DJY7z',
  },
  lang: 'ru',
};

export const STATUS_ORDER = ['release', 'beta', 'alpha', 'wip'] as const;

export const STATUS_LABEL: Record<string, string> = {
  release: 'Релиз',
  beta: 'Бета',
  alpha: 'Альфа',
  wip: 'В разработке',
};
