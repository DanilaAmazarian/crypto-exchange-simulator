# API

NestJS-процесс симулятора. `GET /health` проверяет, что сервер поднят. Котировки уходят в namespace `/market` событием `market.tick` каждые 500 мс.

В общем запуске это контейнер `api` из корневого `docker-compose.yml`, порт `3000`.

Локально без Docker:

```bash
npm install
npm run start:dev
```

Общая схема репозитория описана в корневом `README.md`.
