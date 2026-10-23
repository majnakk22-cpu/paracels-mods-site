// Главные настройки сайта — меняй здесь.
export const SITE = {
  title: 'paracels mods',
  author: 'paracels',
  description: 'Мои моды для Minecraft: паразиты, аномальные измерения, хоррор и технологии.',
  tagline: 'Моды для Minecraft Forge 1.20.1 — паразиты, аномалии, хоррор и атомные технологии.',
  // Ссылки в шапке и подвале. Пустые — не показываются.
  github: '', // например 'https://github.com/paracels'
  discord: '',
  // Подставляется в ссылки "Скачать", если у мода указан repo без своих ссылок
  lang: 'ru',
};

export const STATUS_LABEL: Record<string, string> = {
  release: 'Релиз',
  beta: 'Бета',
  alpha: 'Альфа',
  wip: 'В разработке',
};
