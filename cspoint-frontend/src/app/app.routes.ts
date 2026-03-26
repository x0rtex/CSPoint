import { Routes } from '@angular/router';

import { HomeComponent } from './features/home/home';
import { PlayerListComponent } from './features/players/player-list/player-list';
import { MatchListComponent } from './features/matches/match-list/match-list';
import { TeamListComponent } from './features/teams/team-list/team-list';
import { PlayerDetailComponent } from './features/players/player-detail/player-detail';
import { PlayerEditComponent } from './features/players/player-edit/player-edit';
import { PlayerCreateComponent } from './features/players/player-create/player-create';
import { TeamDetailComponent } from './features/teams/team-detail/team-detail';
import { TeamEditComponent } from './features/teams/team-edit/team-edit';
import { TeamCreateComponent } from './features/teams/team-create/team-create';
import { MatchCreateComponent } from './features/matches/match-create/match-create';
import { MatchDetailComponent } from './features/matches/match-detail/match-detail';
import { MatchEditComponent } from './features/matches/match-edit/match-edit';
import { Login } from './features/users/login/login';
import { Register } from './features/users/register/register';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { Profile } from './features/users/profile/profile';
import { editorGuard } from './core/guards/editor-guard';
import { AdminComponent } from './features/admin/admin';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'profile', component: Profile, canActivate: [authGuard] },
  { path: 'teams', component: TeamListComponent },
  { path: 'teams/create', component: TeamCreateComponent, canActivate: [authGuard] },
  { path: 'teams/:id/edit', component: TeamEditComponent, canActivate: [editorGuard] },
  { path: 'teams/:id', component: TeamDetailComponent },
  { path: 'players', component: PlayerListComponent },
  { path: 'players/create', component: PlayerCreateComponent, canActivate: [authGuard] },
  { path: 'players/:id/edit', component: PlayerEditComponent, canActivate: [editorGuard] },
  { path: 'players/:id', component: PlayerDetailComponent },
  { path: 'matches', component: MatchListComponent },
  { path: 'matches/create', component: MatchCreateComponent, canActivate: [authGuard] },
  { path: 'matches/:id/edit', component: MatchEditComponent, canActivate: [editorGuard] },
  { path: 'matches/:id', component: MatchDetailComponent },
  { path: 'admin', component: AdminComponent, canActivate: [adminGuard] },
];
