import { Component, effect, inject, input } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UsersService } from '../users.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { User } from '../user.interface';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-user-form',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatSnackBarModule,
  ],
  templateUrl: './user-form.html',
  styleUrl: './user-form.scss',
})
export class UserForm {
  private fb = inject(FormBuilder);
  private usersService = inject(UsersService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  user = input<User | undefined>();
  userForm: FormGroup;

  constructor() {
    const isEditMode: boolean = !!this.user();

    this.userForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        isEditMode ? [] : [Validators.required, Validators.minLength(6), Validators.maxLength(64)],
      ],
    });

    effect((): void => {
      const user: User | undefined = this.user();

      if (user) {
        this.userForm.patchValue({
          username: user.username,
          email: user.email,
        });

        this.userForm.get('password')?.clearValidators();
        this.userForm.get('password')?.updateValueAndValidity();

      }
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.openErrorSnackBar('Please make sure all fields are valid');
      return;
    }

    const currentUser: User | undefined = this.user();

    if (!currentUser || !currentUser._id) {
      this.createNew(this.userForm.value as User);
    } else {
      this.updateExisting(currentUser._id, this.userForm.value as User);
    }
  }

  createNew(formValues: User) {
    const { username, email, password } = formValues;

    if (!password) {
      this.openErrorSnackBar('Password is required');
      return;
    }

    const userData: User = {
      username,
      email,
      password,
    };

    this.usersService.addUser(userData).subscribe({
      next: (_response) => {
        this.openSuccessSnackBar('Registration successful! Please login.');
        this.router.navigateByUrl('/login');
      },
      error: (err: Error) => {
        this.openErrorSnackBar(err.message || 'Registration failed. Please try again.');
        console.error(err.message);
      },
    });
  }

  updateExisting(id: string, updatedValues: User): void {
    const userData: User = {
      username: updatedValues.username,
      email: updatedValues.email,
      password: updatedValues.password || '',
    };

    if (updatedValues.password && updatedValues.password.trim() !== '') {
      userData.password = updatedValues.password;
    }

    if (updatedValues.favouriteTeamId) {
      userData.favouriteTeamId = updatedValues.favouriteTeamId;
    }

    if (updatedValues.favouritePlayerId) {
      userData.favouritePlayerId = updatedValues.favouritePlayerId;
    }

    this.usersService.updateUser(id, userData).subscribe({
      next: (response) => {
        this.openSuccessSnackBar('User updated successfully!');
        this.authService.logout();
        this.router.navigateByUrl('/login');
      },
      error: (err: Error) => {
        this.openErrorSnackBar(err.message || 'Update failed. Please try again.');
        console.error(err.message);
      },
    });
  }

  get username() {
    return this.userForm.get('username');
  }

  get email() {
    return this.userForm.get('email');
  }

  get password() {
    return this.userForm.get('password');
  }


  openErrorSnackBar(message: string): void {
    this.snackBar.open(message, 'Dismiss', {
      duration: 15000,
      panelClass: ['error-snackbar'],
    });
  }

  openSuccessSnackBar(message: string): void {
    this.snackBar.open(message, 'Dismiss', {
      duration: 5000,
      panelClass: ['success-snackbar'],
    });
  }
}
