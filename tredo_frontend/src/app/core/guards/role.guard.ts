import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';

// PUBLIC_INTERFACE
export const RoleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  /** Guard requiring specific roles; redirects to /login if not authenticated or not authorized. */
  const auth = inject(AuthService);
  const router = inject(Router);

  const roles = (route.data?.['roles'] as UserRole[] | undefined) ?? [];

  if (!auth.isAuthenticated()) {
    return router.parseUrl('/login');
  }

  if (roles.length && !auth.hasRole(roles)) {
    // Not authorized -> redirect to login or a 403 page later
    return router.parseUrl('/login');
  }

  return true;
};
