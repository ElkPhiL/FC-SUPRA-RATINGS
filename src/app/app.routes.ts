import { Routes } from '@angular/router';

import { HomeComponent } from './features/home/home.component';
import { MatchesComponent } from './features/matches/matches.component';
import { PlayersComponent } from './features/players/players.component';
import { StandingsComponent } from './features/standings/standings.component';
import { LoginComponent } from './features/login/login.component';
import { RegisterComponent } from './features/register/register.component';
import { ProfileComponent } from './features/profile/profile.component';
import { MatchDetailComponent } from './features/match-detail/match-detail.component';

import { AdminGuard } from './features/admin/admin.guard';
import { AdminLayoutComponent } from './features/admin/admin-layout.component';
import { AdminDashboardComponent } from './features/admin/admin-dashboard.component';
import { AdminPlayersComponent } from './features/admin/players/admin-players.component';
import { AdminPlayerCreateComponent } from './features/admin/players/admin-player-create.component';
import { AdminPlayerEditComponent } from './features/admin/players/admin-player-edit.component';
import { AdminMatchesComponent } from './features/admin/matches/admin-matches.component';
import { AdminMatchCreateComponent } from './features/admin/matches/admin-match-create.component';
import { AdminMatchEditComponent } from './features/admin/matches/admin-match-edit.component';
import { AdminLineupComponent } from './features/admin/matches/admin-lineup.component';
import { AdminRatingsComponent } from './features/admin/admin-ratings.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'matches', component: MatchesComponent },
  { path: 'matches/:id', component: MatchDetailComponent },
  { path: 'players', component: PlayersComponent },
  { path: 'standings', component: StandingsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AdminGuard],
    children: [
      { path: '', component: AdminDashboardComponent },
      { path: 'players', component: AdminPlayersComponent },
      { path: 'players/new', component: AdminPlayerCreateComponent },
      { path: 'players/:id/edit', component: AdminPlayerEditComponent },
      { path: 'matches', component: AdminMatchesComponent },
      { path: 'matches/new', component: AdminMatchCreateComponent },
      { path: 'matches/:id/edit', component: AdminMatchEditComponent },
      { path: 'matches/:id/lineup', component: AdminLineupComponent },
      { path: 'matches/:id/ratings', component: AdminRatingsComponent },
    ],
  },
];