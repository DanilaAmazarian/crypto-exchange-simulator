declare global {
  interface Window {
    __MARKET_SOCKET_URL?: string;
  }
}

export const DEFAULT_MARKET_SOCKET_URL = 'http://localhost:3000/market';

export function readMarketSocketUrl(config: { __MARKET_SOCKET_URL?: string } | undefined): string {
  const value = config?.__MARKET_SOCKET_URL?.trim();
  return value ? value : DEFAULT_MARKET_SOCKET_URL;
}
