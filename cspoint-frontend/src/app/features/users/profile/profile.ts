import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/services/auth.service';
import { TeamService } from '../../teams/team.service';
import { PlayerService } from '../../players/player.service';
import { UserForm } from '../user-form/user-form';
import { Observable, of } from 'rxjs';
import { Team } from '../../teams/team.interface';
import { Player } from '../../players/player.interface';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    AsyncPipe,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    UserForm,
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  private authService = inject(AuthService);
  private teamService = inject(TeamService);
  private playerService = inject(PlayerService);

  currentUser$ = this.authService.currentUser$;

  favouriteTeam$?: Observable<Team | null>;
  favouritePlayer$?: Observable<Player | null>;

  ngOnInit(): void {
    this.loadFavourites();
  }

  loadFavourites(): void {
    this.currentUser$.subscribe((user) => {
      if (user) {
        if (user.favouriteTeamId) {
          this.favouriteTeam$ = this.teamService.getTeam(user.favouriteTeamId);
        } else {
          this.favouriteTeam$ = of(null);
        }

        if (user.favouritePlayerId) {
          this.favouritePlayer$ = this.playerService.getPlayer(user.favouritePlayerId);
        } else {
          this.favouritePlayer$ = of(null);
        }
      }
    });
  }
}
