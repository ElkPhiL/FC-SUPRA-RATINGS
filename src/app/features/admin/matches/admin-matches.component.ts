import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatchesService, type Match } from '../../../core/services/matches.service';

@Component({
  selector: 'app-admin-matches',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-matches.component.html',
  styleUrls: ['./admin-matches.component.scss'],
})
export class AdminMatchesComponent {
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
        this.message.set('Aucun match enregistré pour l’instant.');
      }
    } catch (error: any) {
      console.error('Erreur lors du chargement des matchs', error);
      this.message.set(`Erreur de chargement: ${error?.message ?? 'Erreur inconnue'}`);
    } finally {
      this.loading.set(false);
    }
  }

  getMatchTitle(match: Match) {
    return match.opponent || 'Adversaire inconnu';
  }

  getMatchScore(match: Match) {
    return `${match.fc_supra_score ?? '-'} - ${match.opponent_score ?? '-'}`;
  }
}

