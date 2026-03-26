import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { BehaviorSubject, forkJoin, map } from 'rxjs';
import { Match } from '../match.interface';
import { MatchesService } from '../matches.service';
import { AsyncPipe, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { TeamService } from '../../teams/team.service';
import { Team } from '../../teams/team.interface';
import { AuthService } from '../../../core/services/auth.service';

interface MatchWithTeams extends Match {
  team1?: Team;
  team2?: Team;
}

@Component({
  selector: 'app-match-list',
  imports: [
    AsyncPipe,
    RouterLink,
    MatProgressSpinnerModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    DatePipe,
  ],
  templateUrl: './match-list.html',
  styleUrl: './match-list.scss',
})
export class MatchListComponent {
  private matchesService = inject(MatchesService);
  private teamService = inject(TeamService);
  private authService = inject(AuthService);
  private router = inject(Router);

  matches$ = new BehaviorSubject<MatchWithTeams[]>([]);
  totalMatches = 0;
  pageSize = 10;
  pageIndex = 0;
  displayedColumns: string[] = ['matchup', 'score', 'map', 'date', 'action'];

  isAuthenticated$ = this.authService.isAuthenticated$;
  currentUser$ = this.authService.currentUser$;

  ngOnInit(): void {
    this.loadMatches();
  }

  loadMatches(): void {
    forkJoin({
      matches: this.matchesService.getMatches(this.pageIndex + 1, this.pageSize),
      teams: this.teamService.getTeams(1, 1000),
    })
      .pipe(
        map(({ matches, teams }) => {
          this.totalMatches = matches.total;
          const teamMap = new Map(teams.data.map((t) => [t._id!, t]));
          return matches.data.map((match) => ({
            ...match,
            team1: teamMap.get(match.team1Id),
            team2: teamMap.get(match.team2Id),
          }));
        }),
      )
      .subscribe((data) => this.matches$.next(data));
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadMatches();
  }

  addMatch(): void {
    this.router.navigate(['/matches/create']);
  }
}
