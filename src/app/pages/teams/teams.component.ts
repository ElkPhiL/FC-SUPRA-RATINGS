import { Component, signal } from '@angular/core';
import { TeamsService } from '../../services/teams.service';
import { RouterLink } from '@angular/router';
import { Team } from '../../models/team.model';

@Component({
  selector: 'app-teams',
  imports: [RouterLink],
  templateUrl: './teams.component.html',
  styleUrl: './teams.component.scss',
})
export class TeamsComponent {
  teams = signal<Team[]>([]);
  loading = signal(true);
  message = signal('');

  constructor(private teamsService: TeamsService) {
    this.loadTeams();
  }

  async loadTeams() {
    this.loading.set(true);
    this.message.set('');

    try {
      const teams = await this.teamsService.getAll();
      this.teams.set(teams);

      if (!teams.length) {
        this.message.set('Aucun team trouvé.');
      }
    } catch (error: any) {
      console.error('Erreur lors du chargement des teams', error);
      console.error('Détails de l\'erreur:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      this.message.set(`Erreur de chargement: ${error.message || 'Erreur inconnue'}`);
    } finally {
      this.loading.set(false);
    }
  }
}
