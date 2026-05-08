import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayersService, type Player } from '../../core/services/players.service';

@Component({
  selector: 'app-players',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.scss'],
})
export class PlayersComponent {
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
      const players = await this.playersService.getPlayers();
      this.players.set(players);

      if (!players.length) {
        this.message.set('Aucun joueur actif trouvé.');
      }
    } catch (error) {
      console.error('Erreur lors du chargement des joueurs', error);
      this.message.set('Impossible de charger la liste des joueurs.');
    } finally {
      this.loading.set(false);
    }
  }

  getAvatarInitial(player: Player) {
    const label = player.name || player.username || 'Joueur';
    return label.charAt(0).toUpperCase();
  }
}
