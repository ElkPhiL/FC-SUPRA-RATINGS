import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatchesService } from '../../services/matches.service';
import { Match } from '../../models/match.model';

@Component({
  standalone: true,
  selector: 'app-matches',
  imports: [CommonModule, RouterLink],
  templateUrl: './matches.component.html',
  styleUrl: './matches.component.scss',
})
export class MatchesComponent {
  matches = signal<Match[]>([]);
  loading = signal(true);
  message = signal('');
  filter = signal('');
  sortBy = signal<'date' | 'competition' | 'home' | 'away' | 'status'>('date');
  sortDirection = signal<'asc' | 'desc'>('asc');

  filteredMatches = computed(() => {
    const filterValue = this.filter().trim().toLowerCase();
    const rawMatches = this.matches();

    const filtered = filterValue
      ? rawMatches.filter((match) => {
          const searchValues = [
            match.home_team?.name,
            match.away_team?.name,
            match.competition?.name,
            match.venue,
            match.status,
            match.match_date,
          ];
          return searchValues.some((value) => value?.toLowerCase().includes(filterValue));
        })
      : rawMatches;

    return [...filtered].sort((a, b) => {
      const direction = this.sortDirection() === 'asc' ? 1 : -1;

      switch (this.sortBy()) {
        case 'competition':
          return direction * this.compareString(a.competition?.name, b.competition?.name);
        case 'home':
          return direction * this.compareString(a.home_team?.name, b.home_team?.name);
        case 'away':
          return direction * this.compareString(a.away_team?.name, b.away_team?.name);
        case 'status':
          return direction * this.compareString(a.status, b.status);
        case 'date':
        default:
          return direction * this.compareDate(a.match_date, b.match_date);
      }
    });
  });

  constructor(private matchesService: MatchesService) {
    this.loadMatches();
  }

  trackByMatch(_: number, match: Match) {
    return match.id;
  }

  async loadMatches() {
    this.loading.set(true);
    this.message.set('');

    try {
      const matches = await this.matchesService.getAll();
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
        code: error.code,
      });
      this.message.set(`Erreur de chargement: ${error.message || 'Erreur inconnue'}`);
    } finally {
      this.loading.set(false);
    }
  }

  private compareString(a: string | null | undefined, b: string | null | undefined) {
    return (a ?? '').localeCompare(b ?? '', 'fr', { sensitivity: 'base' });
  }

  private compareDate(a: string | null, b: string | null) {
    const timeA = a ? new Date(a).getTime() : 0;
    const timeB = b ? new Date(b).getTime() : 0;
    return timeA - timeB;
  }
}
