import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Match } from '../match.interface';
import { MatchesService } from '../matches.service';
import { MatchFormComponent } from '../match-form/match-form';
import { CommonModule, AsyncPipe } from '@angular/common';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-match-edit',
  imports: [CommonModule, MatProgressSpinner, AsyncPipe, MatchFormComponent],
  templateUrl: './match-edit.html',
  styleUrl: './match-edit.scss',
})
export class MatchEditComponent implements OnInit {
  private route: ActivatedRoute = inject(ActivatedRoute);
  private matchesService: MatchesService = inject(MatchesService);

  match$!: Observable<Match>;

  ngOnInit(): void {
    const id: string | null = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.match$ = this.matchesService.getMatch(id);
    }
  }
}
