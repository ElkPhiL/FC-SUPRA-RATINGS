import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PlayersService } from '../../../core/services/players.service';
import { Player } from './models/player.model';
import { PlayerCardComponent } from '../../players/components/player-card.component';

@Component({
  selector: 'app-admin-players',
  standalone: true,
  imports: [CommonModule, RouterModule, PlayerCardComponent],
  templateUrl: './admin-players.component.html',
  styleUrls: ['./admin-players.component.scss'],
})
export class AdminPlayersComponent {
  activePlayers = signal<Player[]>([]);
  nonActivePlayers = signal<Player[]>([]);
  loading = signal(true);
  message = signal('');

  constructor(private playersService: PlayersService) {
    this.loadPlayers();
  }

  async loadPlayers() {
    this.loadActivePlayers();
    this.loadNonActivePlayers();
  }

  async loadActivePlayers() {
    this.loading.set(true);
    this.message.set('');
    try {
      const players = await this.playersService.getActive();
      this.activePlayers.set(players);
      if (!players.length) {
        this.message.set('Aucun joueur actif trouvé.');
      }
    } catch (error: any) {
      console.error('Erreur lors du chargement des joueurs actifs', error);
      this.message.set(`Erreur de chargement: ${error?.message ?? 'Erreur inconnue'}`);
    } finally {
      this.loading.set(false);
    }
  }

  async loadNonActivePlayers() {
    this.loading.set(true);
    this.message.set('');
    try {
      const players = await this.playersService.getNonActive();
      this.nonActivePlayers.set(players);
      if (!players.length) {
        this.message.set('Aucun joueur non actif trouvé.');
      }
    } catch (error: any) {
      console.error('Erreur lors du chargement des joueurs non actifs', error);
      this.message.set(`Erreur de chargement: ${error?.message ?? 'Erreur inconnue'}`);
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

