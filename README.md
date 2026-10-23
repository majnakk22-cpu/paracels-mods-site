# paracels mods — сайт с модами

Статический сайт-каталог модов: что-то среднее между CurseForge и Modrinth. Свои моды и моды других авторов по заявкам.
У каждого мода — своя тематическая страница (цвета, шрифты, узор шапки), вики-подстраницы,
список версий и галерея. Всё пишется в Markdown, сборка — [Astro](https://astro.build).

## Быстрый старт

Нужен Node.js 18.20+ (лучше 20 или 22).

```bash
npm install
npm run dev      # http://localhost:4321 — живой предпросмотр, правки видны сразу
npm run build    # готовый сайт в папке dist/
```

## Где что лежит

```
src/site.config.ts           ← название сайта, ник, ссылки на GitHub/Discord
src/content/mods/<slug>.md   ← мод: карточка, тема и главная страница (описание)
src/content/pages/<slug>/    ← вики-подстраницы мода (любое число .md файлов)
public/mods/<slug>/          ← иконка, баннер, скриншоты мода
```

`<slug>` — имя файла мода, оно же адрес страницы: `parasites.md` → `/mods/parasites/`.

## Как добавить мод

Создай `src/content/mods/mymod.md`:

```markdown
---
name: Мой мод
author: paracels                    # автор (по умолчанию — из site.config.ts)
summary: Одна-две строки для карточки в каталоге.
icon: /mods/mymod/icon.png          # положи файл в public/mods/mymod/
status: beta                        # release | beta | alpha | wip
categories: [Мобы, Хоррор]          # любые слова — по ним работают фильтры
loader: Forge
mcVersions: ["1.20.1"]
modid: mymod
order: 6                            # порядок в каталоге
featured: false                     # true — большая карточка вверху главной
repo: paracels/mymod                # GitHub-репозиторий (см. «Версии»)
requires: [folio]                   # slug модов с сайта или просто названия
optional: [JEI]
links:
  - { label: Discord, url: "https://discord.gg/..." }
gallery:
  - { src: /mods/mymod/shot1.png, caption: Подпись }
theme:
  accent: "#e0475f"      # главный цвет (кнопки, ссылки)
  accent2: "#7a2a8c"     # второй цвет для узора
  bg: "#120a0d"          # фон страницы
  surface: "#1c1115"     # фон карточек
  text: "#f2e4e7"
  muted: "#ab8f97"
  onAccent: "#1a0508"    # цвет текста на кнопке
  font: "Lora"           # Google Font для текста (необязательно)
  headingFont: "Oswald"  # Google Font для заголовков (необязательно)
  pattern: organic       # none | grid | hazard | organic | scanlines | paper | static | veins | radiation
  banner: /mods/mymod/banner.png   # картинка вместо узора (необязательно)
  css: /mods/mymod/theme.css       # свой CSS для полной свободы (необязательно)
---

Здесь обычный Markdown — это вкладка «Описание».
```

Шрифты: бери с [fonts.google.com](https://fonts.google.com) с поддержкой кириллицы.

## Вики-подстраницы

Каждый файл в `src/content/pages/<slug>/` — отдельная страница во вкладке «Страницы»:

```markdown
---
title: Стадии заражения
order: 1
---
Текст...
```

Ссылки между страницами — относительные: `[Сердце биома](../heart/)`,
со страницы мода на подстраницу — `[Реактор](./wiki/reactor/)`, на другой мод — `[Folio](../folio/)`.

## Выноски

```markdown
> [!NOTE] Заголовок
> Текст
```

Типы: `NOTE`, `TIP`, `WARNING`, `DANGER`, `LORE` (в цвете мода). Заголовок необязателен.
Можно вставлять и обычный HTML — например `<video>` или `<iframe>` с YouTube.

## Версии и скачивания

**Вариант 1 — автоматически из GitHub Releases.** Укажи `repo: ник/репозиторий`.
При сборке сайт возьмёт все релизы: номер версии из тега (`v1.2.0` → `1.2.0`),
первый `.jar` из файлов релиза — для кнопки «Скачать», описание — как список изменений,
и счётчик скачиваний. Релизы с пометкой pre-release или словом beta/alpha в названии получат такой же тип.

**Вариант 2 — вручную** (если репозитория нет или он приватный):

```yaml
versions:
  - version: "1.0.0"
    date: 2026-10-20
    type: release
    url: https://github.com/ник/репо/releases/download/v1.0.0/mymod-1.0.0.jar
    changelog: Что нового
```

Если `repo` указан, но GitHub недоступен — используются ручные версии.

## Заявки на добавление чужих модов

На сайте есть страница **«Добавить мод»** (`/submit/`). Человек заполняет форму, и у него открывается
готовая заявка (Issue) в репозитории сайта — остаётся нажать **Create**. Нужен аккаунт GitHub.

- Шаблон заявки: `.github/ISSUE_TEMPLATE/mod-request.yml`.
- Репозиторий для заявок определяется сам при сборке через GitHub Actions. Если собираешь в другом месте —
  впиши `repo: 'ник/репозиторий'` в `src/site.config.ts`.
- Чтобы заявки получали метку, создай в репозитории метку `заявка` (**Issues → Labels → New label**).
- Правила публикации меняются в начале файла `src/pages/submit.astro` (массив `RULES`).

**Как опубликовать принятый мод:** создай `src/content/mods/<slug>.md` по образцу выше и перенеси данные
из заявки. Обязательно укажи автора — иначе подставится твой ник:

```yaml
author: Steve
authorUrl: https://github.com/steve
```

Когда на сайте больше одного автора, в каталоге сам появляется фильтр «Автор».

## Публикация на GitHub Pages

1. Создай репозиторий (например `mods` или `<ник>.github.io`) и залей туда этот проект.
2. В репозитории: **Settings → Pages → Source: GitHub Actions**.
3. Каждый push в `main` сам соберёт и опубликует сайт. Ещё он пересобирается раз в сутки,
   чтобы обновились версии и счётчики скачиваний. Пересобрать сразу — **Actions → Deploy → Run workflow**.

Адрес будет `https://<ник>.github.io/mods/` (или `https://<ник>.github.io/` для репозитория `<ник>.github.io`).

**Свой домен:** добавь файл `public/CNAME` с доменом и в `.github/workflows/deploy.yml`
поставь `SITE_URL: https://твой-домен` и `BASE_PATH: /`.
