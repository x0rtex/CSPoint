import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable } from 'rxjs';
import { NewsService, HltvNewsItem } from '../news/news.service';

@Component({
  selector: 'app-home',
  imports: [AsyncPipe, MatCardModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent {
  private newsService = inject(NewsService);
  news$: Observable<HltvNewsItem[]> = this.newsService.getHltvNews();
}
