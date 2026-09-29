export const PRICE_WINDOW_MS = 2 * 60 * 1000;

export interface PricePoint {
  at: number;
  price: number;
}

export function appendPricePoint(
  points: PricePoint[],
  point: PricePoint,
  now = point.at,
): PricePoint[] {
  if (!Number.isFinite(point.at) || !Number.isFinite(point.price) || point.price <= 0) {
    return points;
  }

  const cutoff = now - PRICE_WINDOW_MS;
  const last = points[points.length - 1];
  const next = last?.at === point.at ? points : [...points, point];
  return next.filter((item) => item.at >= cutoff);
}

export function sparklinePath(points: PricePoint[], width: number, height: number): string {
  if (points.length === 0 || width <= 0 || height <= 0) {
    return '';
  }

  const min = Math.min(...points.map((point) => point.price));
  const max = Math.max(...points.map((point) => point.price));
  const span = max - min || 1;
  const pad = 4;

  return points
    .map((point, index) => {
      const x = points.length === 1 ? width / 2 : (index / (points.length - 1)) * width;
      const y = height - pad - ((point.price - min) / span) * (height - pad * 2);
      const command = index === 0 ? 'M' : 'L';
      return `${command} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');
}
