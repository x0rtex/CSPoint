import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../../features/users/user.interface';
import { environment } from '../../environments/environment';

interface LoginResponse {
  accessToken: string;
  user: User;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly currentUser$: BehaviorSubject<User | null>;
  readonly isAuthenticated$: BehaviorSubject<boolean>;
  readonly currentUserSignal: WritableSignal<User | null>;
  readonly isAuthenticatedSignal: WritableSignal<boolean>;
  readonly tokenSignal: WritableSignal<string | null>;

  private http = inject(HttpClient);
  private authenticateTimeout?: ReturnType<typeof setTimeout>;

  constructor() {
    const storedUser = this.getUserFromStorage();
    this.currentUser$ = new BehaviorSubject<User | null>(storedUser);
    this.currentUserSignal = signal<User | null>(storedUser);
    this.tokenSignal = signal<string | null>(localStorage.getItem('token'));
    this.isAuthenticatedSignal = signal<boolean>(false);

    const token: string = localStorage.getItem('token') || '';

    if (token !== '') {
      const payload = this.decodeToken(token);
      if (payload) {
        const expires = payload.exp * 1000;
        if (expires > Date.now()) {
          this.isAuthenticated$ = new BehaviorSubject<boolean>(true);
          this.isAuthenticatedSignal.set(true);
          this.startAuthenticateTimer(expires);
        } else {
          this.isAuthenticated$ = new BehaviorSubject<boolean>(false);
          this.isAuthenticatedSignal.set(false);
          this.clearStorage();
          this.tokenSignal.set(null);
        }
      } else {
        this.isAuthenticated$ = new BehaviorSubject<boolean>(false);
        this.isAuthenticatedSignal.set(false);
        this.clearStorage();
        this.tokenSignal.set(null);
      }
    } else {
      this.isAuthenticated$ = new BehaviorSubject<boolean>(false);
      this.isAuthenticatedSignal.set(false);
      this.tokenSignal.set(null);
    }
  }

  private getUserFromStorage(): User | null {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }

  private decodeToken(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  }

  private clearStorage() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  private startAuthenticateTimer(expires: number) {
    const timeout = expires - Date.now() - 60 * 1000;

    this.authenticateTimeout = setTimeout(() => {
      if (this.isAuthenticated$.value) {
        this.logout();
      }
    }, timeout);
  }

  public login(email: string, password: string): Observable<LoginResponse> {
    const loginUrl = `${environment.apiUrl}/auth`;

    return this.http.post<LoginResponse>(loginUrl, { email, password }).pipe(
      tap((response) => {
        this.setAuthData(response.accessToken, response.user);
      }),
    );
  }

  public setAuthData(token: string, user: User): void {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    this.currentUser$.next(user);
    this.isAuthenticated$.next(true);
    this.currentUserSignal.set(user);
    this.isAuthenticatedSignal.set(true);
    this.tokenSignal.set(token);

    const payload = this.decodeToken(token);
    if (payload) {
      const expires = payload.exp * 1000;
      this.startAuthenticateTimer(expires);
    }
  }

  public logout() {
    this.clearStorage();
    this.currentUser$.next(null);
    this.isAuthenticated$.next(false);
    this.currentUserSignal.set(null);
    this.isAuthenticatedSignal.set(false);
    this.tokenSignal.set(null);

    if (this.authenticateTimeout) {
      clearTimeout(this.authenticateTimeout);
    }
  }

  public getToken(): string | null {
    return localStorage.getItem('token');
  }
}
