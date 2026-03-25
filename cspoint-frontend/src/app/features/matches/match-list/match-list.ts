import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { forkJoin, map, Observable } from 'rxjs';
import { Match } from '../match.interface';
import { MatchesService } from '../matches.service';
import { AsyncPipe, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
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

  matches$: Observable<MatchWithTeams[]> = this.matchesService.getMatches();
  displayedColumns: string[] = ['matchup', 'score', 'map', 'date', 'action'];

  isAuthenticated$ = this.authService.isAuthenticated$;
  currentUser$ = this.authService.currentUser$;

  ngOnInit(): void {
    this.matches$ = forkJoin({
      matches: this.matchesService.getMatches(),
      teams: this.teamService.getTeams(),
    }).pipe(
      map(({ matches, teams }) => {
        const teamMap = new Map(teams.map((t) => [t._id!, t]));
        return matches.map((match) => ({
          ...match,
          team1: teamMap.get(match.team1Id),
          team2: teamMap.get(match.team2Id),
        }));
      }),
    );
  }

  addMatch(): void {
    this.router.navigate(['/matches/create']);
  }
}
