import { Routes } from '@angular/router';

import { HomeComponent } from './features/home/home.component';
import { MatchesComponent } from './features/matches/matches.component';
import { PlayersComponent } from './features/players/players.component';
import { StandingsComponent } from './features/standings/standings.component';
import { AdminComponent } from './features/admin/admin.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'matches', component: MatchesComponent },
  { path: 'players', component: PlayersComponent },
  { path: 'standings', component: StandingsComponent },
  { path: 'admin', component: AdminComponent },
];