import { Component, signal } from '@angular/core';
import { MatchesService, type Match } from '../../core/services/matches.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-matches',
  imports: [RouterLink],
  templateUrl: './matches.component.html',
  styleUrl: './matches.component.scss',
})
export class MatchesComponent {
  matches = signal<Match[]>([]);
  loading = signal(true);
  message = signal('');

  constructor(private matchesService: MatchesService) {
    this.loadMatches();
  }

  async loadMatches() {
    this.loading.set(true);
    this.message.set('');

    try {
      const matches = await this.matchesService.getMatches();
      this.matches.set(matches);

      if (!matches.length) {
        this.message.set('Aucun match trouvé.');
      }
    } catch (error: any) {
      console.error('Erreur lors du chargement des matchs', error);
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
