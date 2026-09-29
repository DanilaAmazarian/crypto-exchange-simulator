import { formatClock, formatSigned, formatUsd } from './format';

describe('formatUsd', () => {
  it('formats a price in dollars', () => {
    expect(formatUsd(67420)).toBe('$67,420.00');
  });
});

describe('formatSigned', () => {
  it('prefixes a positive number and keeps a negative sign', () => {
    expect(formatSigned(1.2, 2)).toBe('+1.20');
    expect(formatSigned(-1.2, 2)).toBe('-1.20');
    expect(formatSigned(0, 3)).toBe('0.000');
  });
});

describe('formatClock', () => {
  it('formats the same instant for the active locale', () => {
    const iso = '2026-09-29T00:00:00.000Z';

    expect(formatClock(iso, 'ru-RU')).toMatch(/\d{2}:\d{2}:\d{2}/);
    expect(formatClock(iso, 'en-US').toLowerCase()).toMatch(/am|pm/);
  });
});
