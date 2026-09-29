# Симулятор криптобиржи

Учебный каркас: NestJS публикует случайные котировки BTC, ETH и SOL по WebSocket, Angular показывает их в таблице и крутит 3D-куб со скоростью, которая зависит от изменения цены Bitcoin.

## Стек

- API: NestJS 11, Socket.IO, RxJS `timer`
- Web: Angular 21, RxJS `fromEvent`, Angular Signals, ngx-translate, Three.js

## Запуск

Нужны Docker и Docker Compose. API и Angular собираются в отдельные образы и запускаются своими контейнерами.

```bash
npm start
```

Та же команда без npm: `docker compose up --build`. Остановка: `npm run stop`.

- API: http://localhost:3000/health
- Сокет: `http://localhost:3000/market`, событие `market.tick` каждые 500 мс
- Web: http://localhost:4200

Браузер открывает страницу с хоста, поэтому сокет по-прежнему указывает на `http://localhost:3000/market`. Контейнеры между собой по этому адресу не ходят.

Локально без Docker, из каталога приложения: `npm install` и `npm run start:dev` для API, `npm start` для Angular. Тесты: `npm test` в корне, либо `npm run test:api` и `npm run test:web`.

Адреса клиента для CORS задаются переменной `CLIENT_ORIGIN` — список через запятую. По умолчанию разрешены `http://localhost:4200` и `http://127.0.0.1:4200`. Порт API — `PORT` (по умолчанию `3000`). URL сокета на фронте задаётся в `apps/web/src/app/app.config.ts`.

## Поток данных

```text
Price step  ->  MarketService  ->  MarketGateway
                                      |  market.tick / 500ms
                                      v
MarketSocketService (Observable)  ->  MarketStateService (Signal)
                                      |                 |
                                      v                 v
                                 MarketBoard      RotatingCubeScene
```

Контракт сообщения продублирован в двух файлах и должен совпадать:

- `apps/api/src/market/market.types.ts`
- `apps/web/src/app/core/market/market.models.ts`

```ts
{
  sequence: number;
  emittedAt: string;
  quotes: Array<{
    symbol: 'BTC' | 'ETH' | 'SOL';
    name: string;
    price: number;
    change: number;
    changePercent: number;
  }>;
}
```

`change` и `changePercent` — дельта относительно предыдущего тика.

## Структура

```text
apps/api/Dockerfile      образ NestJS
apps/web/Dockerfile      образ Angular за nginx
docker-compose.yml       контейнеры api и web

apps/api/src/market
  price-step.ts        чистая функция случайного шага
  market.service.ts    общее состояние котировок
  market.gateway.ts    Socket.IO namespace /market
  market.module.ts

apps/web/src/app
  core/i18n            ngx-translate, словари public/i18n
  core/market          сокет, Observable и Signals
  features/market-board
  features/price-scene
    btc-rotation.ts          Δ% BTC -> рад/с
    rotating-cube.scene.ts   сцена Three.js без Angular
    price-scene.ts           связывание signal и сцены
```

Скорость куба: `sign(Δ%) * (0.35 + min(|Δ%|, 1) * 7)` радиан в секунду. Положительный тик крутит куб в одну сторону и красит его зелёным, отрицательный — в другую и красным.
