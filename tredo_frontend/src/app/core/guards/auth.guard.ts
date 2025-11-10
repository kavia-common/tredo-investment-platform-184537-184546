import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

// PUBLIC_INTERFACE
export const AuthGuard: CanActivateFn = () => {
  /** Guard requiring authentication; redirects to /login when no session. */
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAuthenticated()) {
    return true;
  }
  return router.parseUrl('/login');
};
