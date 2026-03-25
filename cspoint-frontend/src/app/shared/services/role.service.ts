import { inject, Injectable } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private authService = inject(AuthService);

  hasRoles(roles: string[]): boolean {
    const userRoles: string[] = this.authService.currentUser$.value?.roles || [];
    return roles.every((role: string): boolean => userRoles.includes(role));
  }

  isAdmin(): boolean {
    return this.hasRoles(['admin']);
  }

  isEditor(): boolean {
    return this.hasRoles(['editor']);
  }
}
