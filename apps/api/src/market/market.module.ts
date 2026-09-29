import { Module } from '@nestjs/common';
import { MarketGateway } from './market.gateway';
import { MarketService } from './market.service';

@Module({
  providers: [MarketService, MarketGateway],
})
export class MarketModule {}
