import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { Match } from '../match.interface';
import { MatchesService } from '../matches.service';
import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { TeamService } from '../../teams/team.service';
import { Team } from '../../teams/team.interface';
import { AuthService } from '../../../core/services/auth.service';

interface MatchWithTeams extends Match {
  team1?: Team;
  team2?: Team;
}

@Component({
  selector: 'app-match-detail',
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
    DatePipe,
  ],
  templateUrl: './match-detail.html',
  styleUrl: './match-detail.scss',
})
export class MatchDetailComponent implements OnInit {
  private route: ActivatedRoute = inject(ActivatedRoute);
  private matchesService: MatchesService = inject(MatchesService);
  private teamService = inject(TeamService);
  private authService = inject(AuthService);
  private router: Router = inject(Router);

  isAuthenticated$ = this.authService.isAuthenticated$;
  currentUser$ = this.authService.currentUser$;

  public dialog: MatDialog = inject(MatDialog);
  public snackBar: MatSnackBar = inject(MatSnackBar);

  id: string = '';
  match$!: Observable<MatchWithTeams>;

  ngOnInit(): void {
    const id: string | null = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.id = id;
      this.match$ = this.matchesService.getMatch(id);

      this.match$ = this.matchesService.getMatch(id).pipe(
        switchMap((match) =>
          forkJoin({
            match: of(match),
            team1: this.teamService.getTeam(match.team1Id),
            team2: this.teamService.getTeam(match.team2Id),
          }).pipe(
            map(({ match, team1, team2 }) => ({
              ...match,
              team1,
              team2,
            })),
          ),
        ),
      );
    }
  }

  askDeleteMatch(): void {
    this.openConfirmDeleteDialog();
  }

  private openConfirmDeleteDialog(): void {
    const dialogRef: MatDialogRef<ConfirmDialogComponent, any> = this.dialog.open(
      ConfirmDialogComponent,
      {
        width: '450px',
        data: {
          title: 'Delete Match',
          message: 'Are you sure you want to delete this match?',
        },
      },
    );

    dialogRef.afterClosed().subscribe((result: any): void => {
      if (result) {
        this.deleteMatch();
      }
    });
  }

  private deleteMatch(): void {
    if (this.id) {
      this.matchesService.deleteMatch(this.id).subscribe({
        next: (_response: void): void => {
          this.router.navigateByUrl('/matches');
          this.snackBar.open('Match deleted successfully', 'Close', {
            duration: 3000,
          });
        },
        error: (err: any): void => {
          this.openErrorSnackBar(err.message || 'Failed to delete match');
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
