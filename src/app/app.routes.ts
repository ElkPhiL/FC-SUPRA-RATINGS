import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { MatchesComponent } from './pages/matches/matches.component';
import { PlayersComponent } from './pages/players/players.component';
import { StandingsComponent } from './pages/standings/standings.component';
import { LineupBuilderComponent } from './pages/lineup-builder/lineup-builder.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { MatchDetailComponent } from './pages/match-detail/match-detail.component';

import { AdminGuard } from './pages/admin/admin.guard';
import { AdminLayoutComponent } from './pages/admin/admin-layout.component';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard.component';
import { AdminPlayersComponent } from './pages/admin/players/admin-players.component';
import { AdminPlayerCreateComponent } from './pages/admin/players/admin-player-create.component';
import { AdminPlayerEditComponent } from './pages/admin/players/admin-player-edit.component';
import { AdminMatchesComponent } from './pages/admin/matches/admin-matches.component';
import { AdminMatchCreateComponent } from './pages/admin/matches/admin-match-create.component';
import { AdminMatchEditComponent } from './pages/admin/matches/admin-match-edit.component';
import { AdminLineupComponent } from './pages/admin/matches/admin-lineup.component';
import { AdminRatingsComponent } from './pages/admin/admin-ratings.component';
import { AdminClubsComponent } from './pages/admin/clubs/admin-clubs.component';
import { AdminClubCreateComponent } from './pages/admin/clubs/admin-club-create.component';
import { AdminClubEditComponent } from './pages/admin/clubs/admin-club-edit.component';
import { TeamsComponent } from './pages/teams/teams.component';
import { TeamRosterComponent } from './pages/teams/team-roster.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'matches', component: MatchesComponent },
  { path: 'matches/:id', component: MatchDetailComponent },
  { path: 'teams', component: TeamsComponent },
  { path: 'teams/:id/roster', component: TeamRosterComponent },
  { path: 'players', component: PlayersComponent },
  { path: 'standings', component: StandingsComponent },
  { path: 'lineup-builder', component: LineupBuilderComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AdminGuard],
    children: [
      { path: '', component: AdminDashboardComponent },
      { path: 'clubs', component: AdminClubsComponent },
      { path: 'clubs/new', component: AdminClubCreateComponent },
      { path: 'clubs/:id/edit', component: AdminClubEditComponent },
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