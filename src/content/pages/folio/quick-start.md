---
title: Быстрый старт
order: 1
description: Как подключить Folio и получить первую рабочую книгу.
---

Чтобы получить рабочую книгу, нужно четыре шага: зависимость в `mods.toml`, описание данных в конструкторе мода, предмет-книга и тексты в lang-файле.

## 1. Зависимость

В `mods.toml` вашего мода:

```toml
[[dependencies.yourmod]]
    modId="folio"
    mandatory=true
    versionRange="[1.0.0,)"
    ordering="AFTER"
    side="BOTH"
```

Как подключить jar к проекту, описано на странице [Сборка и частые проблемы](../troubleshooting/).

## 2. Описание данных

Этот код выполняется в конструкторе мода, то есть и на клиенте, и на сервере:

```java
public static final ResourceLocation BOOK = new ResourceLocation("yourmod", "guide");
public static final ResourceLocation JOURNAL = new ResourceLocation("yourmod", "journal");

FolioBooks.register(BookDefinition.builder(BOOK)
        .langPrefix("guide.yourmod")
        .title("gui.yourmod.guide.title")
        .subtitle("gui.yourmod.guide.subtitle")
        .section("yourmod:some_item", 0xFF5BD35B)
        .section("yourmod:other_item", 0xFF4FC3E8)
        .chapter("welcome", 0, "yourmod:some_item")
        .chapter("tools", 0, "yourmod:other_item")
        .build());

FolioJournals.register(JournalDefinition.builder(JOURNAL)
        .langPrefix("journal.yourmod")
        .title("gui.yourmod.journal.title")
        .category("gui.yourmod.journal.cat.notes", "yourmod:note", 0xFFE8B84A)
        .entry("first_note", 0, "yourmod:note")
        .build());
```

## 3. Предмет, который открывает книгу

Folio предметов не создаёт. Книга открывается на клиенте:

```java
public class GuideItem extends Item {
    public GuideItem(Properties p) { super(p); }

    @Override
    public InteractionResultHolder<ItemStack> use(Level level, Player player, InteractionHand hand) {
        if (level.isClientSide) {
            DistExecutor.unsafeRunWhenOn(Dist.CLIENT, () -> () -> FolioClient.openBook(YourMod.BOOK));
        }
        return InteractionResultHolder.sidedSuccess(player.getItemInHand(hand), level.isClientSide);
    }
}
```

Журнал открывается с сервера. Folio сам отправит игроку пакет с открытыми записями:

```java
FolioJournals.open(serverPlayer, YourMod.JOURNAL, null);
```

## 4. Тексты

Добавьте в lang-файл мода название, подпись и тексты глав. Ключи описаны на странице [Книга и разметка текста](../book/). Без них вместо текста будут видны сами ключи.
