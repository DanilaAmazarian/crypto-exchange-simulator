import { InjectionToken } from '@angular/core';

export const MARKET_TICK_EVENT = 'market.tick';

export const MARKET_SOCKET_URL = new InjectionToken<string>('MARKET_SOCKET_URL');
