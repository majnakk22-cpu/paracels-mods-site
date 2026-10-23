---
name: Story Scenes
summary: Сюжетные катсцены как в летсплеях — камера, актёры, декорации. Сцены собираются из кода, JSON или прямо командами.
icon: /mods/storyscenes/icon.svg
status: beta
categories: [Библиотека, Сюжет]
loader: Forge
mcVersions: ["1.20.1"]
modid: storyscenes
order: 11
# repo: paracels/storyscenes
versions:
  - version: "1.2.0"
    type: beta
    changelog: |
      Сцены-локации из JSON, сущность storyscenes:actor,
      методы актёров и сцен в SceneBuilder, отдельный CHANGELOG.md.
theme:
  accent: "#ff4d5e"
  accent2: "#5b7cff"
  bg: "#0c0c12"
  surface: "#15151e"
  text: "#ececf4"
  muted: "#9393a8"
  onAccent: "#1a0306"
  headingFont: "Rubik Mono One"
  pattern: scanlines
---

> [!NOTE] Черновик
> Этот текст набросан по заметкам о моде — поправь и дополни под себя.

Хочешь, чтобы в твоём моде были сюжетные сцены как в story-летсплеях — с камерой, актёрами и декорациями? **Story Scenes** — библиотека для этого.

## Возможности

- **Сцены командами** — собирай и запускай сцену прямо в игре, хоть из командного блока.
- **API для модов** — `SceneBuilder` для описания сцен из кода.
- **Актёры** — NPC-сущность `storyscenes:actor`, которая ходит, говорит и играет роль.
- **Локации из JSON** — целые декорации, на которых разворачивается действие.

## Кто использует

- [Нулевая зона](../zerozone/) — 11 лорных видеокассет.
