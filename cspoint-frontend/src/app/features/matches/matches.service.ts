import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, throwError, retry, catchError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Match } from './match.interface';
import { PagedResponse } from '../../shared/models/paged-response';

@Injectable({
  providedIn: 'root',
})
export class MatchesService {
  private http: HttpClient = inject(HttpClient);
    private apiUrl: string = `${environment.apiUrl}/matches`;

    private getHeaders(): HttpHeaders {
      return new HttpHeaders({
        'Content-Type': 'application/json',
        'x-api-key': environment.apiKey
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

    getMatches(page = 1, limit = 10): Observable<PagedResponse<Match>> {
      return this.http
        .get<PagedResponse<Match>>(`${this.apiUrl}?page=${page}&limit=${limit}`)
        .pipe(catchError(this.handleError));
    }

    getMatch(id: string): Observable<Match> {
      return this.http
        .get<Match>(`${this.apiUrl}/${id}`)
        .pipe(catchError(this.handleError));
    }

    createMatch(match: Match): Observable<Match> {
      return this.http
        .post<Match>(this.apiUrl, match, { headers: this.getHeaders() })
        .pipe(catchError(this.handleError));
    }

    updateMatch(id: string, match: Match): Observable<Match> {
      return this.http
        .put<Match>(`${this.apiUrl}/${id}`, match, { headers: this.getHeaders() })
        .pipe(catchError(this.handleError));
    }

    deleteMatch(id: string): Observable<void> {
      return this.http
        .delete<void>(`${this.apiUrl}/${id}`, {
          headers: this.getHeaders(),
          responseType: 'text' as 'json'
        })
        .pipe(catchError(this.handleError));
    }
}
