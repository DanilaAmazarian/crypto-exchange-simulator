import { resolveClientOrigins } from './runtime.config';

describe('resolveClientOrigins', () => {
  it('keeps the local dev origins when no host is configured', () => {
    expect(resolveClientOrigins({})).toEqual([
      'http://localhost:4200',
      'http://127.0.0.1:4200',
    ]);
  });

  it('builds the page origin from PUBLIC_HOST', () => {
    expect(resolveClientOrigins({ PUBLIC_HOST: '127.0.0.1' })).toEqual([
      'http://127.0.0.1:4200',
    ]);
  });

  it('prefers an explicit CLIENT_ORIGIN list', () => {
    expect(
      resolveClientOrigins({
        PUBLIC_HOST: '127.0.0.1',
        CLIENT_ORIGIN: 'http://market.example, http://localhost:4200',
      }),
    ).toEqual(['http://market.example', 'http://localhost:4200']);
  });
});
