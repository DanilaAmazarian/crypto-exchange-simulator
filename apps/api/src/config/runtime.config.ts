export const API_PORT = Number(process.env.PORT ?? 3000);

const DEFAULT_CLIENT_ORIGINS = [
  'http://localhost:4200',
  'http://127.0.0.1:4200',
];

export function resolveClientOrigins(
  env: { CLIENT_ORIGIN?: string; PUBLIC_HOST?: string } = process.env,
): string[] {
  const configured = env.CLIENT_ORIGIN?.split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);

  if (configured && configured.length > 0) {
    return configured;
  }

  const host = env.PUBLIC_HOST?.trim();
  if (host) {
    return [`http://${host}:4200`];
  }

  return DEFAULT_CLIENT_ORIGINS;
}

export const CLIENT_ORIGINS = resolveClientOrigins();
