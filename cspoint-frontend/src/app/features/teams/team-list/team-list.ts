import { Component, inject } from '@angular/core';
import { TeamService } from '../team.service';
import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { Team } from '../team.interface';
import { AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { AuthService } from '../../../core/services/auth.service';
import { UsersService } from '../../users/users.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-team-list',
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
  templateUrl: './team-list.html',
  styleUrl: './team-list.scss',
})
export class TeamListComponent {
  private teamService = inject(TeamService);
  private authService = inject(AuthService);
  private usersService = inject(UsersService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  teams$: Observable<Team[]> = this.teamService.getTeams();
  displayedColumns: string[] = ['logo', 'name', 'country', 'ranking', 'action'];

  isAuthenticated$ = this.authService.isAuthenticated$;
  currentUser$ = this.authService.currentUser$;

  addTeam(): void {
    this.router.navigate(['/teams/create']);
  }

  setFavouriteTeam(teamId: string): void {
    this.usersService.setFavouriteTeam(teamId).subscribe({
      next: () => {
        this.snackBar.open('Favorite team set!', 'Close', { duration: 3000 });
      },
      error: (err) => {
        this.snackBar.open(err.message || 'Failed to set favourite team', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  isFavouriteTeam(teamId: string | undefined): boolean {
    if (!teamId) return false;
    return this.authService.currentUser$.value?.favouriteTeamId === teamId;
  }
}
