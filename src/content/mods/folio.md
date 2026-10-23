---
name: Folio
summary: Библиотека книг-справочников и журналов. Замена Patchouli, в которой каждый мод сам задаёт вид своей книги.
icon: /mods/folio/icon.svg
status: wip
categories: [Библиотека, Интерфейс]
loader: Forge
mcVersions: ["1.20.1"]
modid: folio
order: 10
# repo: paracels/folio
versions:
  - version: "1.0.0"
    type: release
    changelog: Первая версия. FolioTheme API — фон, цвета текста и кнопки задаёт мод.
theme:
  accent: "#8a3b1e"
  accent2: "#c9a66b"
  bg: "#f1e8d6"
  surface: "#fbf6ea"
  text: "#2b2116"
  muted: "#7a6a55"
  border: "#ddd0b6"
  onAccent: "#fff8ee"
  font: "Lora"
  headingFont: "Cormorant Garamond"
  pattern: paper
---

> [!NOTE] Черновик
> Этот текст набросан по заметкам о моде — поправь и дополни под себя.

**Folio** — движок для внутриигровых книг: справочников, журналов, дневников. Он даёт только основу — экраны, разметку, виджеты и описания. Сами предметы, тексты и содержимое остаются в твоём моде.

## Возможности

- **Экраны книг** в виде разворота, со страницами и навигацией.
- **Разметка** текста и кнопки-гиперссылки между страницами.
- **Журналы**, которые сами записывают события и реплики.
- **FolioTheme API** — каждый мод задаёт свой фон, цвета текста и вид кнопок.

## Кто использует

- [Parasites: Outbreak](../parasites/)
- [Нулевая зона](../zerozone/)

## Для разработчиков

Подключи `folio` как зависимость и опиши тему и страницы книги в своём моде. Подробности — на странице [FolioTheme API](./wiki/theme-api/).
