import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const apiUri = `${environment.apiUrl}`;

  const jwt: string | null = authService.getToken();

  const authRequest =
    req.url.startsWith(apiUri) && jwt
      ? req.clone({ setHeaders: { Authorization: `Bearer ${jwt}` } })
      : req;

  return next(authRequest).pipe(
    catchError((err) => {
      console.log('Request failed ' + err.status);

      if (err.status === 401 || err.status === 403) {
        authService.logout();
        router.navigate(['/login']);
      }

      return throwError(() => err);
    }),
  );
};
