import { Component, effect, inject, input, InputSignal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PlayerService } from '../player.service';
import { Player } from '../player.interface';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-player-form',
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
  templateUrl: './player-form.html',
  styleUrl: './player-form.scss',
})
export class PlayerFormComponent {
  private fb: FormBuilder = inject(FormBuilder);
  private dialog: MatDialog = inject(MatDialog);
  private snackBar: MatSnackBar = inject(MatSnackBar);

  playerService: PlayerService = inject(PlayerService);
  router: Router = inject(Router);

  player: InputSignal<Player | undefined> = input<Player | undefined>();
  playerForm: FormGroup;
  currentDate: Date = new Date();

  constructor() {
    if (this.player()) {
      console.log(this.player()?.name || 'nothing');
    }

    this.playerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      nickname: ['', [Validators.required, Validators.minLength(2)]],
      country: ['', [Validators.required, Validators.minLength(3)]],
      photoUrl: ['', [Validators.minLength(10)]],
      rating: ['', [Validators.required, Validators.min(0), Validators.max(3)]],
      teamId: [''],
    });

    effect((): void => {
      const player: Player | undefined = this.player();
      if (player) {
        this.playerForm.patchValue({
          name: player.name,
          nickname: player.nickname,
          country: player.country,
          photoUrl: player.photoUrl,
          rating: player.rating,
          teamId: player.teamId,
        });
      }
    });
  }

  onSubmit(): void {
      if (this.playerForm.invalid) {
        return;
      }

      const currentPlayer: Player | undefined = this.player();
      const action = currentPlayer && currentPlayer._id ? 'update' : 'create';
      const title = action === 'update' ? 'Update Player' : 'Create Player';
      const message = action === 'update'
        ? `Are you sure you want to update ${currentPlayer?.name}?`
        : 'Are you sure you want to create this player?';

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
      console.table(this.playerForm.value);

      const currentPlayer: Player | undefined = this.player();

      if (action === 'create') {
        this.createNew(this.playerForm.value as Player);
      } else if (currentPlayer && currentPlayer._id) {
        this.updateExisting(currentPlayer._id, this.playerForm.value as Player);
      }
    }

  onCancel(): void {
    const currentPlayer: Player | undefined = this.player();

    if (currentPlayer && currentPlayer._id) {
      this.router.navigate(['/players', currentPlayer._id]);
    } else {
      this.router.navigate(['/players']);
    }
  }

  updateExisting(id: string, updatedValues: Player): void {
    const playerData: Player = {
      ...updatedValues,
      rating: typeof updatedValues.rating === 'string'
        ? parseFloat(updatedValues.rating)
        : updatedValues.rating,
        teamId: updatedValues.teamId ? String(updatedValues.teamId) : undefined,
    };

    this.playerService.updatePlayer(id, playerData).subscribe({
      next: (response: Player): void => {
        this.snackBar.open('Player updated successfully!', 'Close', {
          duration: 3000,
        });
        this.router.navigateByUrl(`/players/${id}`);
      },
      error: (err: Error): void => {
        this.snackBar.open(`Error: ${err.message}`, 'Dismiss', {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
      },
    });
  }

  createNew(formValues: Player): void {
    const playerData: Player = {
      ...formValues,
      rating: typeof formValues.rating === 'string'
        ? parseFloat(formValues.rating)
        : formValues.rating,
        teamId: formValues.teamId ? String(formValues.teamId) : undefined,
    };

    this.playerService.createPlayer(playerData).subscribe({
      next: (response: Player): void => {
        this.snackBar.open('Player created successfully!', 'Close', {
          duration: 3000,
        });
        this.router.navigateByUrl(`/players/${response._id}`);
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
    return this.playerForm.get('name');
  }

  get nickname() {
    return this.playerForm.get('nickname');
  }

  get country() {
    return this.playerForm.get('country');
  }

  get rating() {
    return this.playerForm.get('rating');
  }

  get photoUrl() {
    return this.playerForm.get('photoUrl');
  }

  get teamId() {
    return this.playerForm.get('teamId');
  }
}
