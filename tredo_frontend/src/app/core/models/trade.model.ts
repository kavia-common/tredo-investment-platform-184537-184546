export type TradeType = 'buy' | 'sell';
export type TradeStatus = 'open' | 'closed' | 'cancelled';

// PUBLIC_INTERFACE
export interface Trade {
  /** Trade id */
  id: string;
  /** Folio id the trade belongs to */
  folioId: string;
  /** Ticker symbol */
  symbol: string;
  /** Buy or Sell */
  type: TradeType;
  /** Quantity of units */
  quantity: number;
  /** Executed price */
  price: number;
  /** Optional stop loss */
  stopLoss?: number;
  /** Optional take profit */
  takeProfit?: number;
  /** Trade status */
  status: TradeStatus;
  /** Executed timestamp ISO */
  executedAt: string;
  /** Closed timestamp ISO if applicable */
  closedAt?: string;
}
