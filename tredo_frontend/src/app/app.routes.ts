import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

/**
 * Application routing configuration
 * - Public pages under PublicLayout
 * - Auth pages under AuthLayout
 * - Role guarded shells for analyst, subscriber, and admin (lazy components)
 */
export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', pathMatch: 'full', loadComponent: () => import('./features/public/home.component').then(m => m.HomeComponent) },
      { path: 'explore', loadComponent: () => import('./features/public/explore.component').then(m => m.ExploreComponent) },
      { path: 'folios/:id', loadComponent: () => import('./features/public/folio-detail.component').then(m => m.FolioDetailComponent) },
      { path: 'pricing', loadComponent: () => import('./features/public/pricing.component').then(m => m.PricingComponent) },
      { path: 'about', loadComponent: () => import('./features/public/about.component').then(m => m.AboutComponent) },
    ],
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent) },
      { path: 'register-subscriber', loadComponent: () => import('./features/auth/register-subscriber.component').then(m => m.RegisterSubscriberComponent) },
      { path: 'register-analyst', loadComponent: () => import('./features/auth/register-analyst.component').then(m => m.RegisterAnalystComponent) },
      { path: 'verify-email', loadComponent: () => import('./features/auth/verify-email.component').then(m => m.VerifyEmailComponent) },
    ],
  },
  {
    path: 'analyst',
    component: DashboardLayoutComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['analyst'] },
    children: [
      { path: '', pathMatch: 'full', loadComponent: () => import('./features/analyst/analyst-dashboard.component').then(m => m.AnalystDashboardComponent) },
    ],
  },
  {
    path: 'subscriber',
    component: DashboardLayoutComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['subscriber'] },
    children: [
      { path: '', pathMatch: 'full', loadComponent: () => import('./features/subscriber/subscriber-dashboard.component').then(m => m.SubscriberDashboardComponent) },
    ],
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin'] },
    children: [
      { path: '', pathMatch: 'full', loadComponent: () => import('./features/admin/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
    ],
  },
  { path: '**', redirectTo: '' },
];
