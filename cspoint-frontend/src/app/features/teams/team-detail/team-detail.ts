import { Component, inject, OnInit } from '@angular/core';
import { TeamService } from '../team.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { Team } from '../team.interface';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { Player } from '../../players/player.interface';
import { PlayerService } from '../../players/player.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-team-detail',
  imports: [
    AsyncPipe,
    CommonModule,
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
  ],
  templateUrl: './team-detail.html',
  styleUrl: './team-detail.scss',
})
export class TeamDetailComponent implements OnInit {
  private route: ActivatedRoute = inject(ActivatedRoute);
  private teamService: TeamService = inject(TeamService);
  private playerService: PlayerService = inject(PlayerService);
  private authService = inject(AuthService);
  private router: Router = inject(Router);

  public dialog: MatDialog = inject(MatDialog);
  public snackBar: MatSnackBar = inject(MatSnackBar);

  id: string = '';
  team$!: Observable<Team>;
  players$!: Observable<Player[]>;
  displayedColumns: string[] = ['nickname', 'rating', 'actions'];

  isAuthenticated$ = this.authService.isAuthenticated$;
  currentUser$ = this.authService.currentUser$;

  ngOnInit(): void {
    const id: string | null = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.id = id;
      this.team$ = this.teamService.getTeam(id);
      this.players$ = this.team$.pipe(
        switchMap((team: Team) => this.playerService.getPlayersByIds(team.playerIds || [])),
      );
    }
  }

  askDeleteTeam(): void {
    this.openConfirmDeleteDialog();
  }

  private openConfirmDeleteDialog(): void {
    const dialogRef: MatDialogRef<ConfirmDialogComponent, any> = this.dialog.open(
      ConfirmDialogComponent,
      {
        width: '450px',
        data: {
          title: 'Delete Team',
          message: 'Are you sure you want to delete this team?',
        },
      },
    );

    dialogRef.afterClosed().subscribe((result: any): void => {
      if (result) {
        this.deleteTeam();
      }
    });
  }

  private deleteTeam(): void {
    if (this.id) {
      this.teamService.deleteTeam(this.id).subscribe({
        next: (_response: void): void => {
          this.router.navigateByUrl('/teams');
          this.snackBar.open('Team deleted successfully', 'Close', {
            duration: 3000,
          });
        },
        error: (err: any): void => {
          this.openErrorSnackBar(err.message || 'Failed to delete team');
        },
      });
    }
  }

  openErrorSnackBar(message: string): void {
    this.snackBar.open(message, 'Dismiss', {
      duration: 15000,
      panelClass: ['error-snackbar'],
    });
  }
}
