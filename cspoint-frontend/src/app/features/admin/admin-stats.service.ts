import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AdminStats {
  users: number;
  players: number;
  teams: number;
  matches: number;
  playersByCountry?: { country: string; count: number }[];
}

@Injectable({
  providedIn: 'root',
})
export class AdminStatsService {
  private http = inject(HttpClient);
  private apiUrl: string = `${environment.apiUrl}/stats`;

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Stats fetch failed', error);
    return throwError(() => new Error('Failed to load stats'));
  }

  getStats(): Observable<AdminStats> {
    return this.http.get<AdminStats>(this.apiUrl).pipe(catchError(this.handleError));
  }
}
