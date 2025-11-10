export type UserRole = 'guest' | 'subscriber' | 'analyst' | 'admin';

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  exp?: number;
  iat?: number;
}

// PUBLIC_INTERFACE
export interface User {
  /** Unique identifier for the user */
  id: string;
  /** Email address */
  email: string;
  /** Display name */
  name: string;
  /** Role for access control */
  role: UserRole;
  /** Optional additional metadata */
  meta?: Record<string, any>;
}
