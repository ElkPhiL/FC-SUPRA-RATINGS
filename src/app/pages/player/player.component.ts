import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PlayersService } from '../../services/players.service';
import { MatchPlayersService } from '../../services/match-players.service';
import { Player } from '../../models/player.model';
import { MatchPlayerWithMatch } from '../../models/match-players.model';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private playersService = inject(PlayersService);
  private matchPlayersService = inject(MatchPlayersService);

  playerId = signal<number | null>(null);
  player = signal<Player | null>(null);
  matchHistory = signal<MatchPlayerWithMatch[]>([]);
  loading = signal(true);
  error = signal('');

  age = computed(() => {
    const dob = this.player()?.date_of_birth;
    if (!dob) {
      return null;
    }

    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age -= 1;
    }

    return age;
  });

  currentClubName = computed(() => {
    return this.player()?.team?.club?.name || this.player()?.team?.name || 'Agent Libre';
  });

  currentClubLogo = computed(() => {
    return this.player()?.team?.club?.logo_url || this.player()?.team?.logo_url || null;
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    const playerId = Number(id);

    if (!id || Number.isNaN(playerId)) {
      this.error.set('Joueur introuvable.');
      this.loading.set(false);
      return;
    }

    this.playerId.set(playerId);
    this.loadPlayer(playerId);
    this.loadMatchHistory(playerId);
  }

  async loadPlayer(id: number) {
    this.loading.set(true);
    this.error.set('');

    try {
      const player = await this.playersService.getById(id);
      this.player.set(player);
    } catch (error: any) {
      console.error('Erreur chargement joueur', error);
      this.error.set(error?.message || 'Impossible de charger le joueur.');
    } finally {
      this.loading.set(false);
    }
  }

  async loadMatchHistory(playerId: number) {
    try {
      const history = await this.matchPlayersService.getByPlayer(playerId);
      const sorted = history.sort((a, b) => {
        const dateA = new Date(a.match.match_date || '').getTime();
        const dateB = new Date(b.match.match_date || '').getTime();
        return dateB - dateA;
      });
      this.matchHistory.set(sorted);
    } catch (error: any) {
      console.error('Erreur chargement historique', error);
    }
  }

  get matchStatusClass() {
    return (status: string | null | undefined) => {
      switch (status) {
        case 'played':
          return 'played';
        case 'scheduled':
          return 'scheduled';
        case 'cancelled':
          return 'cancelled';
        default:
          return 'unknown';
      }
    };
  }

  getRoleLabel(role: string) {
    if (!role) return 'Non défini';
    if (role === 'starter') return 'Titulaire';
    if (role === 'sub') return 'Remplaçant';
    if (role === 'bench') return 'Banc';
    if (role === 'absent') return 'Absent';
    return role;
  }

  getMatchScore(match: MatchPlayerWithMatch) {
    const m = match.match;
    if (!m.home_score && !m.away_score) {
      return m.status === 'scheduled' ? 'À venir' : 'Score indisponible';
    }

    const home = m.home_score ?? 0;
    const away = m.away_score ?? 0;
    return `${home} - ${away}`;
  }

  getSecondaryPositions() {
    const positions = this.player()?.positions || [];
    const best = this.player()?.best_position;
    return positions.filter(position => position !== best);
  }

  getOpponentLabel(match: MatchPlayerWithMatch) {
    const playerTeamId = this.player()?.team?.id;
    const home = match.match.home_team;
    const away = match.match.away_team;

    if (!home || !away) {
      return 'Adversaire inconnu';
    }

    if (playerTeamId === home.id) {
      return `vs ${away.name}`;
    }

    if (playerTeamId === away.id) {
      return `vs ${home.name}`;
    }

    return `${home.name} vs ${away.name}`;
  }

  getMatchDate(label: string | null) {
    if (!label) return 'Date inconnue';
    const date = new Date(label);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  }
}