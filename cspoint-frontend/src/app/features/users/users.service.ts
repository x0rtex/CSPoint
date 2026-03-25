import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from './user.interface';
import { AuthService } from '../../core/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl: string = `${environment.apiUrl}/users`;

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'x-api-key': environment.apiKey,
    });
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error);

    if (error.status == 401 || error.status == 403) {
      console.log('authorisation issue', error.status);
      return throwError(() => new Error('You are not authorised for that action'));
    }

    return throwError(() => new Error('Something went wrong.'));
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl).pipe(catchError(this.handleError));
  }

  getUser(id: string): Observable<User> {
    return this.http
      .get<User>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  updateUser(id: string, user: User): Observable<User> {
    let uri: string = `${this.apiUrl}/${id}`;
    return this.http
      .put<User>(uri, user, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  deleteUser(id: string): Observable<string> {
    let uri: string = `${this.apiUrl}/${id}`;
    return this.http
      .delete(uri, {
        headers: this.getHeaders(),
        responseType: 'text',
      })
      .pipe(catchError(this.handleError));
  }

  addUser(user: User): Observable<User> {
    return this.http
      .post<User>(this.apiUrl, user, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  setFavouriteTeam(teamId: string): Observable<User> {
    const currentUser = this.authService.currentUser$.value;
    if (!currentUser?._id) {
      return throwError(() => new Error('User not logged in'));
    }

    const updateData: Partial<User> = {
      username: currentUser.username,
      email: currentUser.email,
      roles: currentUser.roles,
      favouriteTeamId: teamId,
    };

    if (currentUser.password) {
      updateData.password = currentUser.password;
    }

    return this.updateUser(currentUser._id, updateData as User).pipe(
      tap((user) => this.authService.currentUser$.next(user)),
      catchError(this.handleError),
    );
  }

  setFavouritePlayer(playerId: string): Observable<User> {
    const currentUser = this.authService.currentUser$.value;
    if (!currentUser?._id) {
      return throwError(() => new Error('User not logged in'));
    }

    const updateData: Partial<User> = {
      username: currentUser.username,
      email: currentUser.email,
      roles: currentUser.roles,
      favouritePlayerId: playerId,
    };

    if (currentUser.password) {
      updateData.password = currentUser.password;
    }

    return this.updateUser(currentUser._id, updateData as User).pipe(
      tap((user) => this.authService.currentUser$.next(user)),
      catchError(this.handleError),
    );
  }
}
