import { Component, signal } from '@angular/core';
import { NavigationComponent } from './shared/components/navigation/navigation';

@Component({
  selector: 'app-root',
  imports: [NavigationComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('cspoint-frontend');
}
