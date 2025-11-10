export type SubscriptionStatus = 'active' | 'past_due' | 'canceled' | 'incomplete';

// PUBLIC_INTERFACE
export interface Subscription {
  /** Subscription id */
  id: string;
  /** Subscriber user id */
  userId: string;
  /** Folio id subscribed to */
  folioId: string;
  /** Status of subscription */
  status: SubscriptionStatus;
  /** Current period start ISO */
  currentPeriodStart: string;
  /** Current period end ISO */
  currentPeriodEnd: string;
  /** Price per period in minor units (e.g., paise) */
  unitAmount: number;
  /** Currency, ISO code */
  currency: string;
  /** Created timestamp ISO */
  createdAt: string;
  /** Cancel at period end */
  cancelAtPeriodEnd?: boolean;
}
