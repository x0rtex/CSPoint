import { DatePipe } from '@angular/common';
import { Component, effect, inject, input, InputSignal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { Match } from '../match.interface';
import { MatchesService } from '../matches.service';

@Component({
  selector: 'app-match-form',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    DatePipe,
  ],
  templateUrl: './match-form.html',
  styleUrl: './match-form.scss',
})
export class MatchFormComponent {
  private fb: FormBuilder = inject(FormBuilder);
  private dialog: MatDialog = inject(MatDialog);
  private snackBar: MatSnackBar = inject(MatSnackBar);

  matchesService: MatchesService = inject(MatchesService);
  router: Router = inject(Router);

  match: InputSignal<Match | undefined> = input<Match | undefined>();
  matchForm: FormGroup;
  currentDate: Date = new Date();

  constructor() {
    if (this.match()) {
      console.log(this.match()?.team1Id || 'nothing');
    }

    this.matchForm = this.fb.group({
      team1Id: ['', [Validators.required]],
      team2Id: ['', [Validators.required]],
      team1Score: ['', [Validators.required]],
      team2Score: ['', [Validators.required]],
      map: ['', [Validators.required, Validators.minLength(2)]],
      date: ['', [Validators.required]],
    });

    effect((): void => {
      const match: Match | undefined = this.match();
      if (match) {
        this.matchForm.patchValue({
          team1Id: match.team1Id,
          team2Id: match.team2Id,
          team1Score: match.team1Score,
          team2Score: match.team2Score,
          map: match.map,
          date: match.date,
        });
      }
    });
  }

  onSubmit(): void {
    if (this.matchForm.invalid) {
      return;
    }

    const currentMatch: Match | undefined = this.match();
    const action: 'update' | 'create' = currentMatch && currentMatch._id ? 'update' : 'create';
    const title: string = action === 'update' ? 'Update Match' : 'Create Match';
    const message: string =
      action === 'update'
        ? `Are you sure you want to update this match?`
        : 'Are you sure you want to create this match?';

    this.openConfirmDialog(title, message, action);
  }

  private openConfirmDialog(title: string, message: string, action: 'create' | 'update'): void {
    const dialogRef: MatDialogRef<ConfirmDialogComponent, any> = this.dialog.open(
      ConfirmDialogComponent,
      {
        width: '450px',
        data: {
          title: title,
          message: message,
        },
      },
    );

    dialogRef.afterClosed().subscribe((result: any): void => {
      if (result) {
        this.submitForm(action);
      }
    });
  }

  private submitForm(action: 'create' | 'update'): void {
    console.log('Form submitted with ');
    console.table(this.matchForm.value);

    const currentMatch: Match | undefined = this.match();

    if (action === 'create') {
      this.createNew(this.matchForm.value as Match);
    } else if (currentMatch && currentMatch._id) {
      this.updateExisting(currentMatch._id, this.matchForm.value as Match);
    }
  }

  onCancel(): void {
    const currentMatch: Match | undefined = this.match();

    if (currentMatch && currentMatch._id) {
      this.router.navigate(['/matches', currentMatch._id]);
    } else {
      this.router.navigate(['/matches']);
    }
  }

  updateExisting(id: string, updatedValues: Match): void {
    const matchData: Match = {
      ...updatedValues,
      team1Score:
        typeof updatedValues.team1Score === 'string'
          ? parseInt(updatedValues.team1Score)
          : updatedValues.team1Score,
      team2Score:
        typeof updatedValues.team2Score === 'string'
          ? parseInt(updatedValues.team2Score)
          : updatedValues.team2Score,
    };

    this.matchesService.updateMatch(id, matchData).subscribe({
      next: (): void => {
        this.snackBar.open('Match updated successfully!', 'Close', {
          duration: 3000,
        });
        this.router.navigateByUrl(`/matches/${id}`);
      },
      error: (err: Error): void => {
        this.snackBar.open(`Error: ${err.message}`, 'Dismiss', {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
      },
    });
  }

  createNew(formValues: Match): void {
    const matchData: Match = {
      ...formValues,
      team1Score:
        typeof formValues.team1Score === 'string'
          ? parseInt(formValues.team1Score)
          : formValues.team1Score,
      team2Score:
        typeof formValues.team2Score === 'string'
          ? parseInt(formValues.team2Score)
          : formValues.team2Score,
    };

    this.matchesService.createMatch(matchData).subscribe({
      next: (response: Match): void => {
        this.snackBar.open('Match created successfully!', 'Close', {
          duration: 3000,
        });
        this.router.navigateByUrl(`/matches/${response._id}`);
      },
      error: (err: Error): void => {
        this.snackBar.open(`Error: ${err.message}`, 'Dismiss', {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
      },
    });
  }

  get team1Id() {
    return this.matchForm.get('team1Id');
  }

  get team2Id() {
    return this.matchForm.get('team2Id');
  }

  get team1Score() {
    return this.matchForm.get('team1Score');
  }

  get team2Score() {
    return this.matchForm.get('team2Score');
  }

  get map() {
    return this.matchForm.get('map');
  }

  get date() {
    return this.matchForm.get('date');
  }
}
