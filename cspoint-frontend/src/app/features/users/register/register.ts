import { Component } from '@angular/core';
import { UserForm } from '../user-form/user-form';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [UserForm],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {}
