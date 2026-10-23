---
title: FolioTheme API
order: 1
---

> [!NOTE] Черновик
> Вставь сюда реальный пример кода из своего мода.

Каждый мод, использующий Folio, задаёт собственную тему книги:

- **фон** разворота;
- **цвета текста**;
- **кнопки** и их внешний вид.

```java
// Пример — замени на реальный API
FolioTheme theme = FolioTheme.builder()
    .background(new ResourceLocation("mymod", "textures/gui/book.png"))
    .textColor(0x2B2116)
    .build();
```
