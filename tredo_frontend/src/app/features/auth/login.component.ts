import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  template: `
    <h2>Login</h2>
    <p>Sign in to your account.</p>
    <button class="btn" type="button" (click)="quickLogin()">Quick login (mock)</button>
  `,
  styles: [``]
})
export class LoginComponent {
  private readonly auth = inject(AuthService);

  quickLogin() {
    this.auth.login('demo@tredo.app', 'password').subscribe();
  }
}
