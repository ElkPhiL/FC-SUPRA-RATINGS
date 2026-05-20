import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PlayersService } from '../../../services/players.service';
import { Player } from '../../../models/player.model';
import { PlayerCardComponent } from '../../../components/player-card/player-card.component';
import { SearchBarComponent } from '../../../components/search-bar/search-bar.component';

@Component({
  selector: 'app-admin-players',
  standalone: true,
  imports: [CommonModule, RouterModule, PlayerCardComponent, SearchBarComponent],
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
    try {
      const [players] = await Promise.all([
        this.playersService.getAll(),
        this.playersService.getActive(),
        this.playersService.getNonActive(),
      ]);
      this.players.set(players);
    } catch (error) {
      this.message.set('Erreur chargement joueurs');
    } finally {
      this.loading.set(false);
    }
  }

  deletePlayer(id: number) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce joueur ?')) {
      return;
    }
    this.playersService.delete(id)
      .then(() => {
        this.message.set('Joueur supprimé');
        this.loadPlayers();
      })
      .catch(() => {
        this.message.set('Erreur suppression joueur');
      });
  }
}

