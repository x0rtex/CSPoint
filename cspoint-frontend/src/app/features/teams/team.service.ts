import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, throwError, retry, catchError, forkJoin, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { Team } from './team.interface';
import { PlayerService } from '../players/player.service';

@Injectable({
  providedIn: 'root',
})
export class TeamService {
  private http: HttpClient = inject(HttpClient);
  private playerService: PlayerService = inject(PlayerService);
  private apiUrl: string = `${environment.apiUrl}/teams`;

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

  getTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(this.apiUrl).pipe(catchError(this.handleError));
  }

  getTeam(id: string): Observable<Team> {
    return this.http.get<Team>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }

  getTeamsByIds(ids: string[]): Observable<Team[]> {
    if (!ids || ids.length === 0) {
      return of([]);
    }
    const teamRequests: Observable<Team>[] = ids.map((id: string): Observable<Team> => this.getTeam(id));
    return forkJoin(teamRequests);
  }

  createTeam(team: Team): Observable<Team> {
    return this.http
      .post<Team>(this.apiUrl, team, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  updateTeam(id: string, team: Team): Observable<Team> {
    return this.http
      .put<Team>(`${this.apiUrl}/${id}`, team, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  deleteTeam(id: string): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${id}`, {
        headers: this.getHeaders(),
        responseType: 'text' as 'json',
      })
      .pipe(catchError(this.handleError));
  }
}
