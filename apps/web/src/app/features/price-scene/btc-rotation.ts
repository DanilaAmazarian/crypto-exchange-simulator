const BASE_SPEED = 0.35;
const CHANGE_GAIN = 7;
const MAX_CHANGE = 1;

/** Signed radians per second. Sign follows the BTC tick, magnitude follows |Δ%|. */
export function angularSpeedFromChange(changePercent: number): number {
  const direction = Math.sign(changePercent) || 1;
  const magnitude = Math.min(Math.abs(changePercent), MAX_CHANGE);
  return direction * (BASE_SPEED + magnitude * CHANGE_GAIN);
}

export function colorForChange(changePercent: number): number {
  if (changePercent > 0) {
    return 0x3dd68c;
  }
  if (changePercent < 0) {
    return 0xff6b7a;
  }
  return 0x8eb6ff;
}
