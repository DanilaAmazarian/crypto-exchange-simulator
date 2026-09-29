# API

[English](#english)

NestJS-процесс симулятора. `GET /health` проверяет, что сервер поднят. Котировки уходят в namespace `/market` событием `market.tick` каждые 500 мс.

В общем запуске это контейнер `api` из корневого `docker-compose.yml`, порт `3000`.

Локально без Docker:

```bash
npm install
npm run start:dev
```

Общая схема репозитория описана в корневом `README.md`.

## English

[Русский](#api)

The simulator's NestJS process. `GET /health` checks that the server is up. Quotes are sent on the `/market` namespace as a `market.tick` event every 500 ms.

In the full setup this is the `api` container from the root `docker-compose.yml`, on port `3000`.

Without Docker:

```bash
npm install
npm run start:dev
```

The repository overview is in the root `README.md`.
