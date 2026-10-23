---
title: Журнал
order: 3
description: Категории и записи журнала, выдача записей игроку.
---

Журнал — список записей, которые игрок открывает по ходу игры. Пока запись закрыта, она показана как «???». Журнал описывает `JournalDefinition`, регистрируется он через `FolioJournals.register`.

## Методы билдера

| Метод | Что задаёт |
|---|---|
| `JournalDefinition.builder(id)` | Идентификатор журнала |
| `.langPrefix(prefix)` | Префикс ключей записей, например `journal.yourmod` |
| `.title(key)` | Ключ заголовка журнала |
| `.category(nameKey, icon, argbColor)` | Категория: ключ названия, иконка-предмет и цвет акцента; нумеруются с нуля |
| `.entry(id, category, icon)` | Запись: id, номер категории и иконка-предмет |
| `.storageKey(key)` | Ключ хранения в данных игрока; по умолчанию собирается из id журнала |
| `.theme(theme)` и `.skin(texture)` | Оформление, как у книги |

Тексты записи берутся из ключей `journal.yourmod.<id>.title` и `journal.yourmod.<id>.text`; разметка в `.text` та же, что в главах книги. Закладка «Все записи» показывает записи всех категорий, остальные закладки по одной категории. При большом числе категорий колонка закладок прокручивается так же, как в книге.

## Выдача записей

Всё делается на сервере. Folio хранит открытые записи в постоянных данных игрока, поэтому они переживают смерть, и сам показывает уведомление:

```java
FolioJournals.unlock(serverPlayer, YourMod.JOURNAL, "first_note"); // true, если запись новая
FolioJournals.has(serverPlayer, YourMod.JOURNAL, "first_note");
FolioJournals.unlocked(serverPlayer, YourMod.JOURNAL);               // список открытых id
FolioJournals.open(serverPlayer, YourMod.JOURNAL, "first_note");      // открыть журнал сразу на записи
FolioJournals.open(serverPlayer, YourMod.JOURNAL, null);              // просто открыть журнал
```

`unlock` молча возвращает `false` для неизвестного журнала или id записи: опечатка не роняет игру, но и запись не откроется.

## Записка-предмет

Предмет-записку (один предмет, id записи в NBT) вы пишете сами: при использовании вызовите `unlock` и `open` для её записи, а название предмета берите из `def.langPrefix() + "." + id + ".title"`.
