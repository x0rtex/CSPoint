import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export interface HltvNewsItem {
  title: string;
  link: string;
  date?: string;
  comments?: number;
  imageUrl?: string;
  description?: string;
}

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private http = inject(HttpClient);
  private apiUrl: string = `${environment.apiUrl}/news/hltv`;

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('News fetch failed', error);
    return throwError(() => new Error('Failed to load news'));
  }

  getHltvNews(): Observable<HltvNewsItem[]> {
    return this.http.get<HltvNewsItem[]>(this.apiUrl).pipe(catchError(this.handleError));
  }
}
