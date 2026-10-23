---
title: Для разработчиков
order: 1
description: Подключение библиотеки, сцены из кода, запуск, события и сцены из датапака.
---

## Подключение

1. В проекте библиотеки выполни `./gradlew publishToMavenLocal` (или `./gradlew publish`, тогда jar окажется в папке `repo/`).
2. В `build.gradle` своего мода:

```groovy
repositories {
    mavenLocal()
    // или: maven { url = uri('file:///путь/к/storyscenes/repo') }
}
dependencies {
    implementation fg.deobf('dev.storyscenes:storyscenes:1.2.0')
}
```

3. В `mods.toml` своего мода:

```toml
[[dependencies.yourmodid]]
modId="storyscenes"
mandatory=true
versionRange="[1.2,)"
ordering="AFTER"
side="BOTH"
```

> [!TIP] Какую версию указывать
> Для камеры, титров и событий хватит `1.1`. Локации и актёры есть только с `1.2`.

Если сцены в твоём моде — необязательная фича, поставь `mandatory=false` и вызывай API только после проверки `ModList.get().isLoaded("storyscenes")`.

## Сцены из кода

Все времена в тиках: 20 тиков равны одной секунде.

```java
Scene intro = StoryScenesAPI.builder()
    .origin(new Vec3(100, 64, 100))                  // "~" в командах сцены считается от этой точки
    .fadeIn(0, 20)
    .lookAt(0,   new Vec3(90, 70, 90), new Vec3(100, 65, 100), 70)   // камера смотрит на точку, fov 70
    .lookAt(100, new Vec3(96, 66, 94), new Vec3(100, 65, 100), 45)
    .camera(180, 100, 68, 94, 0f, 25f, /*roll*/ 5f, /*fov*/ 60f, /*linear*/ false)
    .subtitle(20, 60, "Старик", "Ты пришёл вовремя.")
    .narrate(90, 50, "Прошла ночь...")                // титр без имени
    .sound(20, new ResourceLocation("minecraft", "entity.villager.ambient"), 1f, 1f)
    .command(60, "summon minecraft:zombie ~ ~ ~4")
    .trigger(80, new ResourceLocation("mymod", "wake_boss"), "phase=1")
    .fadeOut(200, 20)
    .bars(true).skippable(true).protect(true)
    .build();
```

Методы для актёров и локаций описаны на страницах [Актёры](../actors/) и [Локации](../stages/).

## Запуск

```java
StoryScenesAPI.register(new ResourceLocation("mymod", "intro"), intro);     // один раз при старте

StoryScenesAPI.play(new ResourceLocation("mymod", "intro"), serverPlayer);  // или Collection<ServerPlayer>
StoryScenesAPI.play(intro, players);                                         // без регистрации
StoryScenesAPI.stop(player);
StoryScenesAPI.isPlaying(player);
StoryScenesAPI.find(id);                                                     // Optional<Scene> (копия)
```

`play` возвращает `false`, если сцены нет, зрителей нет или запуск отменили через `SceneEvent.Start`.

## События

Слушай на `MinecraftForge.EVENT_BUS`:

```java
@SubscribeEvent
public static void onTrigger(SceneEvent.Trigger e) {
    if (e.getTriggerId().equals(new ResourceLocation("mymod", "wake_boss"))) {
        ServerPlayer owner = e.getOwner();              // кто запустил (может быть null)
        Collection<ServerPlayer> viewers = e.getViewers();
        String arg = e.getArg();                        // "phase=1"
        // твоя логика
    }
}

@SubscribeEvent
public static void onStart(SceneEvent.Start e) { /* e.setCanceled(true) отменит запуск */ }

@SubscribeEvent
public static void onEnd(SceneEvent.End e) { e.getReason(); }
```

Причины завершения (`EndReason`): `FINISHED`, `SKIPPED`, `STOPPED`, `REPLACED` (запустили другую сцену) и `DISCONNECTED`.

## Сцены из датапака

Файл `data/mymod/story_scenes/intro.json` попадает в реестр под id `mymod:intro`. Формат тот же, что у сцен, созданных командами:

```json
{
  "length": 0, "bars": true, "skippable": true, "protect": true,
  "originX": 100.0, "originY": 64.0, "originZ": 100.0,
  "cams":      [{"t": 0, "x": 90, "y": 70, "z": 90, "yaw": 0, "pitch": 30, "roll": 0, "fov": 70, "mode": "smooth"}],
  "subtitles": [{"t": 20, "duration": 60, "speaker": "Старик", "text": "Привет!"}],
  "fades":     [{"t": 0, "duration": 20, "out": false, "color": 0}],
  "sounds":    [{"t": 20, "id": "minecraft:entity.villager.ambient", "volume": 1.0, "pitch": 1.0}],
  "commands":  [{"t": 60, "command": "summon minecraft:zombie ~ ~ ~4"}],
  "triggers":  [{"t": 80, "id": "mymod:wake_boss", "arg": "phase=1"}]
}
```

Датапак с тем же id перекрывает сцену, зарегистрированную в коде. Сцены, созданные командами, лежат в папке мира `storyscenes/<имя>.json`.

## Клиентская сторона

Пакет `dev.storyscenes.api.client` нужен только на клиенте:

- `StoryScenesClient.isPlaying()` и `StoryScenesClient.sceneTime()`;
- события `ClientSceneEvent.Start`, `End` и `Overlay`. В `Overlay` можно рисовать свой интерфейс поверх сцены.

> [!NOTE] Что считать API
> Стабильны классы пакета `dev.storyscenes.api`. Всё остальное внутреннее и может меняться.

## Нюансы

- Чанки грузятся вокруг игрока, а не вокруг камеры. Для далёких планов переноси зрителя заранее (`viewerTeleport` или команда `tp`).
- Во время сцены управление, инвентарь и HUD отключены, а зрители получают Сопротивление V (параметр `protect`).

Полный список изменений по версиям — в `CHANGELOG.md` репозитория.
