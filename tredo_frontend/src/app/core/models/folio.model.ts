export type FolioVisibility = 'public' | 'private' | 'subscribers';

export interface FolioStats {
  /** Percentage return over different windows */
  oneDay?: number;
  oneWeek?: number;
  oneMonth?: number;
  threeMonths?: number;
  sixMonths?: number;
  oneYear?: number;
  allTime?: number;
}

// PUBLIC_INTERFACE
export interface Folio {
  /** Unique identifier */
  id: string;
  /** Human-friendly slug */
  slug: string;
  /** Title of the folio */
  title: string;
  /** Description / thesis */
  description?: string;
  /** Owner analyst id */
  analystId: string;
  /** Visibility level */
  visibility: FolioVisibility;
  /** Tag list for discovery */
  tags?: string[];
  /** Stats for performance */
  stats?: FolioStats;
  /** Created at ISO timestamp */
  createdAt: string;
  /** Updated at ISO timestamp */
  updatedAt: string;
}
