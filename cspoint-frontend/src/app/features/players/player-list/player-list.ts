import { Component, inject, signal } from '@angular/core';
import { BehaviorSubject, forkJoin, map, combineLatest, finalize } from 'rxjs';
import { Player } from '../player.interface';
import { PlayerService } from '../player.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AsyncPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TeamService } from '../../teams/team.service';
import { AuthService } from '../../../core/services/auth.service';
import { UsersService } from '../../users/users.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-player-list',
  imports: [
    AsyncPipe,
    RouterLink,
    MatProgressSpinnerModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './player-list.html',
  styleUrl: './player-list.scss',
})
export class PlayerListComponent {
  private playerService = inject(PlayerService);
  private teamService = inject(TeamService);
  private authService = inject(AuthService);
  private usersService = inject(UsersService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  players$ = new BehaviorSubject<(Player & { team?: any })[]>([]);
  playerFilter$ = new BehaviorSubject<string>('');
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  isAuthenticatedSignal = this.authService.isAuthenticatedSignal;
  filteredPlayers$ = combineLatest([this.players$, this.playerFilter$]).pipe(
    map(([players, filter]) => {
      const value = filter.trim().toLowerCase();
      if (!value) return players;
      return players.filter((player) =>
        [player.nickname, player.name, player.country, player.team?.name]
          .filter(Boolean)
          .some((field) => field.toLowerCase().includes(value)),
      );
    }),
  );
  totalPlayers = 0;
  pageSize = 10;
  pageIndex = 0;
  displayedColumns: string[] = ['image', 'nickname', 'name', 'country', 'rating', 'team', 'action'];

  isAuthenticated$ = this.authService.isAuthenticated$;
  currentUser$ = this.authService.currentUser$;

  ngOnInit(): void {
    this.loadPlayers();
  }

  loadPlayers(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    forkJoin({
      players: this.playerService.getPlayers(this.pageIndex + 1, this.pageSize),
      teams: this.teamService.getTeams(1, 1000),
    })
      .pipe(
        map(({ players, teams }) => {
          this.totalPlayers = players.total;
          const teamMap = new Map(teams.data.map((t) => [t._id!, t]));
          return players.data.map((player) => ({
            ...player,
            team: player.teamId ? teamMap.get(player.teamId) : undefined,
          }));
        }),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe({
        next: (data) => this.players$.next(data),
        error: (err: Error) => {
          this.errorMessage.set(err.message || 'Failed to load players');
        },
      });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadPlayers();
  }

  addPlayer(): void {
    this.router.navigate(['/players/create']);
  }

  onFilterChange(value: string): void {
    this.playerFilter$.next(value);
  }

  setFavouritePlayer(playerId: string): void {
    this.usersService.setFavouritePlayer(playerId).subscribe({
      next: () => {
        this.snackBar.open('Favorite player set!', 'Close', { duration: 3000 });
      },
      error: (err) => {
        this.snackBar.open(err.message || 'Failed to set favourite player', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  isFavouritePlayer(playerId: string | undefined): boolean {
    if (!playerId) return false;
    return this.authService.currentUser$.value?.favouritePlayerId === playerId;
  }
}
