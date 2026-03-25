import { Component, inject } from '@angular/core';
import { forkJoin, map, Observable, Subscriber } from 'rxjs';
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

  players$: Observable<Player[]> = this.playerService.getPlayers();
  displayedColumns: string[] = ['image', 'nickname', 'name', 'country', 'rating', 'team', 'action'];

  isAuthenticated$ = this.authService.isAuthenticated$;
  currentUser$ = this.authService.currentUser$;

  ngOnInit(): void {
    this.players$ = forkJoin({
      players: this.playerService.getPlayers(),
      teams: this.teamService.getTeams(),
    }).pipe(
      map(({ players, teams }) => {
        const teamMap = new Map(teams.map((t) => [t._id!, t]));
        return players.map((player) => ({
          ...player,
          team: player.teamId ? teamMap.get(player.teamId) : undefined,
        }));
      }),
    );
  }

  addPlayer(): void {
    this.router.navigate(['/players/create']);
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
