import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayersService } from '../../services/players.service';
import { Player } from '../../models/player.model';
import { PlayerCardComponent } from '../../components/player-card.component';

@Component({
  selector: 'app-players',
  standalone: true,
  imports: [CommonModule, PlayerCardComponent],
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
      const players = await this.playersService.getAll();
      this.players.set(players);

      if (!players.length) {
        this.message.set('Aucun joueur actif trouvé.');
      }
    } catch (error: any) {
      console.error('Erreur lors du chargement des joueurs', error);
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

  getAvatarInitial(player: Player) {
    const label = player.display_name || player.first_name || player.last_name || 'Joueur';
    return label.charAt(0).toUpperCase();
  }

  getPlayerName(player: Player) {
    return player.display_name || `${player.first_name || ''} ${player.last_name || ''}`.trim() || 'Joueur inconnu';
  }
}
