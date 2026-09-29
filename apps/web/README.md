# Web

Angular-клиент симулятора. `MarketSocketService` слушает Socket.IO через RxJS, `MarketStateService` переводит поток в Signals. Таблица читает котировки, сцена Three.js читает изменение BTC.

Тексты интерфейса лежат в `public/i18n/ru.json` и `public/i18n/en.json`. Переключатель в шапке вызывает `TranslateService.use`, выбранный язык сохраняется в `localStorage`.

В общем запуске это контейнер `web` из корневого `docker-compose.yml`: nginx отдаёт production-сборку на порту `4200`.

Локально без Docker:

```bash
npm install
npm start
```

API должен быть доступен на `http://localhost:3000/market`. В контейнере адрес сокета приходит из `PUBLIC_HOST` или `MARKET_SOCKET_URL` и записывается в `app-config.js` при старте.
