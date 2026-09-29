import { readMarketSocketUrl } from './market-socket-url';

describe('readMarketSocketUrl', () => {
  it('falls back to the local API when the page has no runtime config', () => {
    expect(readMarketSocketUrl(undefined)).toBe('http://localhost:3000/market');
    expect(readMarketSocketUrl({ __MARKET_SOCKET_URL: '  ' })).toBe('http://localhost:3000/market');
  });

  it('reads the socket address injected into the page', () => {
    expect(readMarketSocketUrl({ __MARKET_SOCKET_URL: 'http://127.0.0.1:3000/market' })).toBe(
      'http://127.0.0.1:3000/market',
    );
  });
});
