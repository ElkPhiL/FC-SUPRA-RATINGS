import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatchFormComponent } from '../../../components/match-form/match-form.component';
import { MatchesService } from '../../../services/matches.service';
import { CompetitionsService } from '../../../services/competitions.service';
import { TeamsService } from '../../../services/teams.service';

@Component({
  selector: 'app-admin-match-create',
  standalone: true,
  imports: [MatchFormComponent],
  templateUrl: './admin-match-create.component.html',
  styleUrls: ['./admin-match-create.component.scss'],
})
export class AdminMatchCreateComponent {
  loading = signal(false);
  message = signal('');

  competitions = signal<any[]>([]);
  teams = signal<any[]>([]);

  constructor(
    private matchesService: MatchesService,
    private competitionsService: CompetitionsService,
    private teamsService: TeamsService,
    private router: Router
  ) {
    this.loadCompetitionsAndTeams();
  }

  async create(payload: any) {
    try {
      this.loading.set(true);

      await this.matchesService.create(payload);

      this.message.set('Match créé');
      this.router.navigate(['/admin/matches']);
    } catch {
      this.message.set('Erreur création');
    } finally {
      this.loading.set(false);
    }
  }

  async loadCompetitionsAndTeams() {
    try {
      this.loading.set(true);
      const [competitions, teams] = await Promise.all([
        this.competitionsService.getAll(),
        this.teamsService.getAll()
      ]);

      this.competitions.set(competitions);
      this.teams.set(teams);
    } catch (error: any) {
      console.error('Erreur de chargement des compétitions ou des équipes', error);
      this.message.set('Erreur de chargement des compétitions ou des équipes');
    } finally {
      this.loading.set(false);
    }
  }
}
