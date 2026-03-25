import { Component } from '@angular/core';
import { MatchFormComponent } from '../match-form/match-form';

@Component({
  selector: 'app-match-create',
  imports: [MatchFormComponent],
  templateUrl: './match-create.html',
  styleUrl: './match-create.scss',
})
export class MatchCreateComponent {}
