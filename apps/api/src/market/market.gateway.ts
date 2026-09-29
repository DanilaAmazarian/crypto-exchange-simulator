import { Logger, OnModuleDestroy } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Subscription, timer } from 'rxjs';
import { Namespace, Socket } from 'socket.io';
import { CLIENT_ORIGINS } from '../config/runtime.config';
import {
  MARKET_NAMESPACE,
  MARKET_TICK_EVENT,
  TICK_INTERVAL_MS,
} from './market.constants';
import { MarketService } from './market.service';

@WebSocketGateway({
  namespace: MARKET_NAMESPACE,
  cors: { origin: CLIENT_ORIGINS },
})
export class MarketGateway
  implements
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnModuleDestroy
{
  private readonly logger = new Logger(MarketGateway.name);
  private ticks?: Subscription;

  @WebSocketServer()
  server!: Namespace;

  constructor(private readonly market: MarketService) {}

  afterInit(): void {
    this.ticks = timer(0, TICK_INTERVAL_MS).subscribe(() => {
      this.server?.emit(MARKET_TICK_EVENT, this.market.advance());
    });
  }

  handleConnection(client: Socket): void {
    this.logger.log(`client connected ${client.id}`);
    client.emit(MARKET_TICK_EVENT, this.market.snapshot());
  }

  handleDisconnect(client: Socket): void {
    this.logger.log(`client disconnected ${client.id}`);
  }

  onModuleDestroy(): void {
    this.ticks?.unsubscribe();
  }
}
