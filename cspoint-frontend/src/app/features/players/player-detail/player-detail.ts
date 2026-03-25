import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable, of, switchMap } from 'rxjs';
import { Player } from '../player.interface';
import { PlayerService } from '../player.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { Team } from '../../teams/team.interface';
import { TeamService } from '../../teams/team.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-player-detail',
  imports: [
    AsyncPipe,
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
  ],
  templateUrl: './player-detail.html',
  styleUrl: './player-detail.scss',
})
export class PlayerDetailComponent implements OnInit {
  private route: ActivatedRoute = inject(ActivatedRoute);
  private playerService: PlayerService = inject(PlayerService);
  private teamService: TeamService = inject(TeamService);
  private authService = inject(AuthService);
  private router: Router = inject(Router);

  public dialog: MatDialog = inject(MatDialog);
  public snackBar: MatSnackBar = inject(MatSnackBar);

  id: string = '';
  player$!: Observable<Player>;
  team$!: Observable<Team | null>;

  isAuthenticated$ = this.authService.isAuthenticated$;
  currentUser$ = this.authService.currentUser$;

  ngOnInit(): void {
    const id: string | null = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.id = id;
      this.player$ = this.playerService.getPlayer(id);

      this.team$ = this.player$.pipe(
        switchMap((player) => (player.teamId ? this.teamService.getTeam(player.teamId) : of(null))),
      );
    }
  }

  askDeletePlayer(): void {
    this.openConfirmDeleteDialog();
  }

  private openConfirmDeleteDialog(): void {
    const dialogRef: MatDialogRef<ConfirmDialogComponent, any> = this.dialog.open(
      ConfirmDialogComponent,
      {
        width: '450px',
        data: {
          title: 'Delete Player',
          message: 'Are you sure you want to delete this player?',
        },
      },
    );

    dialogRef.afterClosed().subscribe((result: any): void => {
      if (result) {
        this.deletePlayer();
      }
    });
  }

  private deletePlayer(): void {
    if (this.id) {
      this.playerService.deletePlayer(this.id).subscribe({
        next: (_response: void): void => {
          this.router.navigateByUrl('/players');
          this.snackBar.open('Player deleted successfully', 'Close', {
            duration: 3000,
          });
        },
        error: (err: any): void => {
          this.openErrorSnackBar(err.message || 'Failed to delete player');
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
