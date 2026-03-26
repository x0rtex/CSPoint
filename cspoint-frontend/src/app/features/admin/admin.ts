import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.interface';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    AsyncPipe,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTableModule,
    MatSnackBarModule,
  ],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class AdminComponent implements OnInit {
  private usersService = inject(UsersService);
  private snackBar = inject(MatSnackBar);

  users$?: Observable<User[]>;
  displayedColumns: string[] = ['username', 'email', 'role', 'actions'];
  roleSelections: Record<string, string> = {};

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.users$ = this.usersService.getUsers();
  }

  getSelectedRole(user: User): string {
    if (!user._id) return 'user';
    return this.roleSelections[user._id] ?? user.roles?.[0] ?? 'user';
  }

  setRoleSelection(user: User, role: string): void {
    if (!user._id) return;
    this.roleSelections[user._id] = role;
  }

  saveUser(user: User): void {
    if (!user._id) return;
    const role = this.getSelectedRole(user);

    this.usersService.updateUserRoles(user._id, [role]).subscribe({
      next: (updatedUser) => {
        this.snackBar.open('Role updated successfully', 'Close', { duration: 3000 });
        if (updatedUser._id) {
          this.roleSelections[updatedUser._id] = updatedUser.roles?.[0] ?? role;
        }
      },
      error: (err: Error) => {
        this.snackBar.open(err.message || 'Failed to update role', 'Close', {
          duration: 4000,
        });
      },
    });
  }

  deleteUser(user: User): void {
    if (!user._id) return;

    const confirmed = window.confirm(`Delete user ${user.username}? This cannot be undone.`);
    if (!confirmed) return;

    this.usersService.deleteUser(user._id).subscribe({
      next: () => {
        this.snackBar.open('User deleted successfully', 'Close', { duration: 3000 });
        this.loadUsers();
      },
      error: (err: Error) => {
        this.snackBar.open(err.message || 'Failed to delete user', 'Close', {
          duration: 4000,
        });
      },
    });
  }
}
