import { Injectable } from '@nestjs/common';
import { ASSET_CATALOG } from './market.constants';
import { MarketSnapshot, PriceQuote } from './market.types';
import { percentChange, roundTo, stepPrice } from './price-step';

interface TrackedQuote {
  symbol: PriceQuote['symbol'];
  name: string;
  volatility: number;
  price: number;
  change: number;
  changePercent: number;
}

@Injectable()
export class MarketService {
  private sequence = 0;
  private quotes: TrackedQuote[] = ASSET_CATALOG.map((asset) => ({
    symbol: asset.symbol,
    name: asset.name,
    volatility: asset.volatility,
    price: asset.seedPrice,
    change: 0,
    changePercent: 0,
  }));

  snapshot(): MarketSnapshot {
    return {
      sequence: this.sequence,
      emittedAt: new Date().toISOString(),
      quotes: this.quotes.map((quote) => this.toQuote(quote)),
    };
  }

  advance(): MarketSnapshot {
    this.sequence += 1;
    this.quotes = this.quotes.map((quote) => {
      const price = stepPrice(quote.price, quote.volatility, Math.random());
      const change = roundTo(price - quote.price, 2);
      return {
        ...quote,
        price,
        change,
        changePercent: percentChange(quote.price, price),
      };
    });

    return this.snapshot();
  }

  private toQuote(quote: TrackedQuote): PriceQuote {
    return {
      symbol: quote.symbol,
      name: quote.name,
      price: quote.price,
      change: quote.change,
      changePercent: quote.changePercent,
    };
  }
}
