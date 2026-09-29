export const API_PORT = Number(process.env.PORT ?? 3000);

const DEFAULT_CLIENT_ORIGINS = [
  'http://localhost:4200',
  'http://127.0.0.1:4200',
];

export const CLIENT_ORIGINS = (
  process.env.CLIENT_ORIGIN ?? DEFAULT_CLIENT_ORIGINS.join(',')
)
  .split(',')
  .map((origin) => origin.trim())
  .filter((origin) => origin.length > 0);
