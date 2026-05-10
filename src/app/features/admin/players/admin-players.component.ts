import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PlayersService } from '../../../core/services/players.service';
import { Player } from './models/player.model';

@Component({
  selector: 'app-admin-players',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-players.component.html',
  styleUrls: ['./admin-players.component.scss'],
})
export class AdminPlayersComponent {
  players = signal<Player[]>([]);
  loading = signal(true);
  message = signal('');

  constructor(private playersService: PlayersService) {
    this.loadPlayers();
  }

  async loadPlayers() {
    this.loading.set(true);
    this.message.set('');

    try {
      const players = await this.playersService.getAll();
      this.players.set(players);

      if (!players.length) {
        this.message.set('Aucun joueur actif trouvé.');
      }
    } catch (error: any) {
      console.error('Erreur lors du chargement des joueurs', error);
      this.message.set(`Erreur de chargement: ${error?.message ?? 'Erreur inconnue'}`);
    } finally {
      this.loading.set(false);
    }
  }

  getPlayerName(player: Player) {
    return (
      player.display_name ||
      `${player.first_name ?? ''} ${player.last_name ?? ''}`.trim() ||
      'Joueur inconnu'
    );
  }
}

