import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MarketModule } from './market/market.module';

@Module({
  imports: [MarketModule],
  controllers: [AppController],
})
export class AppModule {}
