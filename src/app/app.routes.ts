import { Routes } from '@angular/router';

import { HomeComponent } from './features/home/home.component';
import { MatchesComponent } from './features/matches/matches.component';
import { PlayersComponent } from './features/players/players.component';
import { StandingsComponent } from './features/standings/standings.component';
import { AdminComponent } from './features/admin/admin.component';
import { LoginComponent } from './features/login/login.component';
import { RegisterComponent } from './features/register/register.component';
import { ProfileComponent } from './features/profile/profile.component';
import { MatchDetailComponent } from './features/match-detail/match-detail.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'matches', component: MatchesComponent },
  { path: 'players', component: PlayersComponent },
  { path: 'standings', component: StandingsComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'matches/:id', component: MatchDetailComponent }
];