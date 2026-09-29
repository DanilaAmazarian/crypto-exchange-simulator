import { InjectionToken } from '@angular/core';
import { RotatingCubeScene } from './rotating-cube.scene';

export interface MarketCubeScene {
  setChangePercent(changePercent: number): void;
  setBackdrop(color: string): void;
  start(): void;
  dispose(): void;
}

export const MARKET_CUBE_SCENE = new InjectionToken<(host: HTMLCanvasElement) => MarketCubeScene>(
  'MARKET_CUBE_SCENE',
  {
    factory: () => (host) => new RotatingCubeScene(host),
  },
);
