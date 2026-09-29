export function stepPrice(
  price: number,
  volatility: number,
  randomUnit: number,
): number {
  const unit = clamp(randomUnit, 0, 1);
  const deltaRate = (unit * 2 - 1) * volatility;
  return roundTo(price * (1 + deltaRate), 2);
}

export function percentChange(previous: number, next: number): number {
  if (previous === 0) {
    return 0;
  }

  return roundTo(((next - previous) / previous) * 100, 4);
}

export function roundTo(value: number, places: number): number {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
