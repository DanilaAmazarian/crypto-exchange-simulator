import { Test } from '@nestjs/testing';
import { Subject, timer } from 'rxjs';
import { Socket } from 'socket.io';
import { MARKET_TICK_EVENT, TICK_INTERVAL_MS } from './market.constants';
import { MarketGateway } from './market.gateway';
import { MarketService } from './market.service';
import { MarketSnapshot } from './market.types';

jest.mock('rxjs', () => {
  const actual = jest.requireActual<typeof import('rxjs')>('rxjs');
  return {
    ...actual,
    timer: jest.fn(actual.timer),
  };
});

describe('MarketGateway', () => {
  const timerMock = timer as jest.MockedFunction<typeof timer>;
  let gateway: MarketGateway;
  let market: { advance: jest.Mock; snapshot: jest.Mock };
  let broadcast: jest.Mock;
  let ticks: Subject<number>;

  const snapshot = (sequence: number): MarketSnapshot => ({
    sequence,
    emittedAt: '2026-09-29T08:00:00.000Z',
    quotes: [],
  });

  beforeEach(async () => {
    ticks = new Subject<number>();
    timerMock.mockReturnValue(ticks);

    market = {
      advance: jest.fn(() => snapshot(market.advance.mock.calls.length)),
      snapshot: jest.fn(() => snapshot(0)),
    };
    broadcast = jest.fn();

    const moduleRef = await Test.createTestingModule({
      providers: [MarketGateway, { provide: MarketService, useValue: market }],
    }).compile();

    gateway = moduleRef.get(MarketGateway);
    gateway.server = { emit: broadcast } as never;
  });

  afterEach(() => {
    gateway.onModuleDestroy();
    timerMock.mockReset();
  });

  it('broadcasts one advanced snapshot per clock tick', () => {
    gateway.afterInit();

    expect(timerMock).toHaveBeenCalledWith(0, TICK_INTERVAL_MS);

    ticks.next(0);
    ticks.next(1);

    expect(market.advance).toHaveBeenCalledTimes(2);
    expect(broadcast).toHaveBeenNthCalledWith(
      1,
      MARKET_TICK_EVENT,
      snapshot(1),
    );
    expect(broadcast).toHaveBeenNthCalledWith(
      2,
      MARKET_TICK_EVENT,
      snapshot(2),
    );
  });

  it('sends the current snapshot to a connecting client', () => {
    const clientEmit = jest.fn();

    gateway.handleConnection({
      id: 'client-1',
      emit: clientEmit,
    } as unknown as Socket);

    expect(market.advance).not.toHaveBeenCalled();
    expect(clientEmit).toHaveBeenCalledWith(MARKET_TICK_EVENT, snapshot(0));
  });

  it('stops broadcasting when the module is destroyed', () => {
    gateway.afterInit();
    ticks.next(0);
    broadcast.mockClear();

    gateway.onModuleDestroy();
    ticks.next(1);

    expect(broadcast).not.toHaveBeenCalled();
  });
});
