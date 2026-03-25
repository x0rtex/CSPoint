import { DatePipe } from '@angular/common';
import { Component, effect, inject, input, InputSignal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { Team } from '../team.interface';
import { TeamService } from '../team.service';

@Component({
  selector: 'app-team-form',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    DatePipe
  ],
  templateUrl: './team-form.html',
  styleUrl: './team-form.scss',
})
export class TeamFormComponent {
  private fb: FormBuilder = inject(FormBuilder);
  private dialog: MatDialog = inject(MatDialog);
  private snackBar: MatSnackBar = inject(MatSnackBar);

  teamService: TeamService = inject(TeamService);
  router: Router = inject(Router);

  team: InputSignal<Team | undefined> = input<Team | undefined>();
  teamForm: FormGroup;
  currentDate: Date = new Date();

  constructor() {
    if (this.team()) {
      console.log(this.team()?.name || 'nothing');
    }

    this.teamForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      country: ['', [Validators.required, Validators.minLength(3)]],
      logoUrl: ['', [Validators.minLength(10)]],
      ranking: ['', [Validators.required, Validators.min(1)]],
      playerIds: this.fb.array([])
    });

    effect((): void => {
      const team: Team | undefined = this.team();
      if (team) {
        this.teamForm.patchValue({
          name: team.name,
          country: team.country,
          logoUrl: team.logoUrl,
          ranking: team.ranking,
          playerIds: team.playerIds,
        });

        this.playerIds.clear();

        if (team.playerIds) {
          team.playerIds.forEach((playerId) => {
            this.playerIds.push(this.fb.control(playerId));
          });
        }
      }
    });
  }

  onSubmit(): void {
      if (this.teamForm.invalid) {
        return;
      }

      const currentTeam: Team | undefined = this.team();
      const action: 'update' | 'create' = currentTeam && currentTeam._id ? 'update' : 'create';
      const title: string = action === 'update' ? 'Update Team' : 'Create Team';
      const message: string = action === 'update'
        ? `Are you sure you want to update ${currentTeam?.name}?`
        : 'Are you sure you want to create this team?';

      this.openConfirmDialog(title, message, action);
    }

    private openConfirmDialog(title: string, message: string, action: 'create' | 'update'): void {
      const dialogRef: MatDialogRef<ConfirmDialogComponent, any> = this.dialog.open(ConfirmDialogComponent, {
        width: '450px',
        data: {
          title: title,
          message: message,
        },
      });

      dialogRef.afterClosed().subscribe((result: any): void => {
        if (result) {
          this.submitForm(action);
        }
      });
    }

    private submitForm(action: 'create' | 'update'): void {
      console.log('Forms submitted with ');
      console.table(this.teamForm.value);

      const currentTeam: Team | undefined = this.team();

      if (action === 'create') {
        this.createNew(this.teamForm.value as Team);
      } else if (currentTeam && currentTeam._id) {
        this.updateExisting(currentTeam._id, this.teamForm.value as Team);
      }
    }

  onCancel(): void {
    const currentTeam: Team | undefined = this.team();

    if (currentTeam && currentTeam._id) {
      this.router.navigate(['/teams', currentTeam._id]);
    } else {
      this.router.navigate(['/teams']);
    }
  }

  updateExisting(id: string, updatedValues: Team): void {
    const teamData: Team = {
      ...updatedValues,
      ranking: typeof updatedValues.ranking === 'string'
        ? parseInt(updatedValues.ranking)
        : updatedValues.ranking,
    };

    this.teamService.updateTeam(id, teamData).subscribe({
      next: (): void => {
        this.snackBar.open('Team updated successfully!', 'Close', {
          duration: 3000,
        });
        this.router.navigateByUrl(`/teams/${id}`);
      },
      error: (err: Error): void => {
        this.snackBar.open(`Error: ${err.message}`, 'Dismiss', {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
      },
    });
  }

  createNew(formValues: Team): void {
    const teamData: Team = {
      ...formValues,
      ranking: typeof formValues.ranking === 'string'
        ? parseInt(formValues.ranking)
        : formValues.ranking,
    };

    this.teamService.createTeam(teamData).subscribe({
      next: (response: Team): void => {
        this.snackBar.open('Team created successfully!', 'Close', {
          duration: 3000,
        });
        this.router.navigateByUrl(`/teams/${response._id}`);
      },
      error: (err: Error): void => {
        this.snackBar.open(`Error: ${err.message}`, 'Dismiss', {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
      },
    });
  }

  get name() {
    return this.teamForm.get('name');
  }

  get country() {
    return this.teamForm.get('country');
  }

  get ranking() {
    return this.teamForm.get('ranking');
  }

  get logoUrl() {
    return this.teamForm.get('logoUrl');
  }

  get playerIds(): FormArray {
    return this.teamForm.get('playerIds') as FormArray;
  }

  addPlayerId(): void {
    const playerIdControl = this.fb.control('');
    this.playerIds.push(playerIdControl);
  }

  removePlayerId(index: number): void {
    this.playerIds.removeAt(index);
  }
}
