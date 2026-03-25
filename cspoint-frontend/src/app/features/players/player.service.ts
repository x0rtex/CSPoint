import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { catchError, forkJoin, Observable, of, retry, throwError } from 'rxjs';
import { Player } from './player.interface';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private http: HttpClient = inject(HttpClient);
  private apiUrl: string = `${environment.apiUrl}/players`;

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'x-api-key': environment.apiKey,
    });
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 0) {
      console.error(`An error occurred: ${error.error}`);
    }
    if (error.status == 401 || error.status == 403) {
      console.log(`Authorisation issue: ${error.status}`);
      return throwError(() => new Error('You are not authorised for that action'));
    } else {
      console.error(`Backend Error ${error.status}: ${error.error}`);
    }
    return throwError(() => new Error('Something went wrong, please try again later'));
  }

  getPlayers(): Observable<Player[]> {
    return this.http.get<Player[]>(this.apiUrl).pipe(catchError(this.handleError));
  }

  getPlayer(id: string): Observable<Player> {
    return this.http.get<Player>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }

  getPlayersByIds(ids: string[]): Observable<Player[]> {
    if (!ids || ids.length === 0) {
      return of([]);
    }
    const playerRequests = ids.map((id) => this.getPlayer(id));
    return forkJoin(playerRequests);
  }

  createPlayer(player: Player): Observable<Player> {
    return this.http
      .post<Player>(this.apiUrl, player, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  updatePlayer(id: string, player: Player): Observable<Player> {
    return this.http
      .put<Player>(`${this.apiUrl}/${id}`, player, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  deletePlayer(id: string): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${id}`, {
        headers: this.getHeaders(),
        responseType: 'text' as 'json',
      })
      .pipe(catchError(this.handleError));
  }
}
