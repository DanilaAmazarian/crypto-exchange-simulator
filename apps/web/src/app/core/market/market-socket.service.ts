import { DestroyRef, inject, Injectable } from '@angular/core';
import { fromEvent, map, merge, Observable, shareReplay, startWith } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { ConnectionStatus, MarketSnapshot } from './market.models';
import { MARKET_SOCKET_URL, MARKET_TICK_EVENT } from './market.tokens';

@Injectable({ providedIn: 'root' })
export class MarketSocketService {
  private readonly socket: Socket = io(inject(MARKET_SOCKET_URL));

  /** Raw socket stream. Components should read signals from MarketStateService. */
  readonly snapshots$: Observable<MarketSnapshot> = fromEvent<MarketSnapshot>(
    this.socket,
    MARKET_TICK_EVENT,
  ).pipe(shareReplay({ bufferSize: 1, refCount: false }));

  readonly status$: Observable<ConnectionStatus> = merge(
    fromEvent(this.socket, 'connect').pipe(map((): ConnectionStatus => 'live')),
    fromEvent(this.socket, 'disconnect').pipe(map((): ConnectionStatus => 'offline')),
  ).pipe(
    startWith<ConnectionStatus>(this.socket.connected ? 'live' : 'connecting'),
    shareReplay({ bufferSize: 1, refCount: false }),
  );

  constructor() {
    inject(DestroyRef).onDestroy(() => this.socket.disconnect());
  }
}
