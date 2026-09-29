# Web

Angular-клиент симулятора. `MarketSocketService` слушает Socket.IO через RxJS, `MarketStateService` переводит поток в Signals. Таблица читает котировки, сцена Three.js читает изменение BTC.

Тексты интерфейса лежат в `public/i18n/ru.json` и `public/i18n/en.json`. Переключатель в шапке вызывает `TranslateService.use`, выбранный язык сохраняется в `localStorage`.

```bash
npm install
npm start
```

API должен быть доступен на `http://localhost:3000/market`. Адрес задаётся в `src/app/app.config.ts`.
