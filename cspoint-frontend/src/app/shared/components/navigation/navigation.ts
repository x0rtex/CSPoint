import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth.service';
import { MatDividerModule } from '@angular/material/divider';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.html',
  styleUrl: './navigation.scss',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatDividerModule,
    MatListModule,
    MatIconModule,
    MatSlideToggleModule,
    AsyncPipe,
  ],
})
export class NavigationComponent {
  private breakpointObserver = inject(BreakpointObserver);
  private authService = inject(AuthService);
  private router = inject(Router);

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map((result) => result.matches),
    shareReplay(),
  );

  isAuthenticatedSignal = this.authService.isAuthenticatedSignal;
  currentUserSignal = this.authService.currentUserSignal;

  isDarkMode: boolean = false;

  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    this.applyTheme();
  }

  private applyTheme() {
    const htmlElement = document.documentElement;
    if (this.isDarkMode) {
      htmlElement.classList.add('dark-theme');
      htmlElement.classList.remove('light-theme');
    } else {
      htmlElement.classList.add('light-theme');
      htmlElement.classList.remove('dark-theme');
    }
  }
}
