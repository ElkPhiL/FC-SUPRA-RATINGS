import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlayersService, type CreatePlayerPayload, type Player } from '../../core/services/players.service';
import { MatchesService, type CreateMatchPayload, type Match } from '../../core/services/matches.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent {
  players = signal<Player[]>([]);
  matches = signal<Match[]>([]);
  loadingPlayers = signal(true);
  loadingMatches = signal(true);
  playerMessage = signal('');
  matchMessage = signal('');

  createPlayerPayload = {
    name: '',
    username: '',
    number: null as number | null,
    position: '',
    active: true,
  } as {
    name: string;
    username: string;
    number: number | null;
    position: string;
    active: boolean;
  };

  createMatchPayload = {
    date: '',
    home_team: '',
    away_team: '',
    home_score: 0,
    away_score: 0,
    status: 'scheduled',
  } as {
    date: string;
    home_team: string;
    away_team: string;
    home_score: number;
    away_score: number;
    status: string;
  };

  constructor(private playersService: PlayersService, private matchesService: MatchesService) {
    this.loadPlayers();
    this.loadMatches();
  }

  async loadPlayers() {
    this.loadingPlayers.set(true);
    this.playerMessage.set('');

    try {
      const players = await this.playersService.getPlayers();
      this.players.set(players);
      if (!players.length) {
        this.playerMessage.set('Aucun joueur actif pour l’instant.');
      }
    } catch (error) {
      this.playerMessage.set('Impossible de charger les joueurs.');
    } finally {
      this.loadingPlayers.set(false);
    }
  }

  async createPlayer() {
    this.playerMessage.set('');

    const name = this.createPlayerPayload.name.trim();
    const username = this.createPlayerPayload.username.trim();
    const number = this.createPlayerPayload.number;

    if (!name || !username || number === null || number <= 0) {
      this.playerMessage.set('Merci de remplir le nom, le pseudonyme et le numéro du joueur.');
      return;
    }

    try {
      await this.playersService.createPlayer({
        name,
        username,
        number,
        position: this.createPlayerPayload.position.trim(),
        active: this.createPlayerPayload.active,
      });
      this.playerMessage.set('Joueur créé avec succès.');
      this.createPlayerPayload = { name: '', username: '', number: null, position: '', active: true };
      await this.loadPlayers();
    } catch (error) {
      this.playerMessage.set('Erreur lors de la création du joueur.');
    }
  }

  async loadMatches() {
    this.loadingMatches.set(true);
    this.matchMessage.set('');

    try {
      const matches = await this.matchesService.getMatches();
      this.matches.set(matches);
      if (!matches.length) {
        this.matchMessage.set('Aucun match enregistré pour l’instant.');
      }
    } catch (error) {
      this.matchMessage.set('Impossible de charger les matchs.');
    } finally {
      this.loadingMatches.set(false);
    }
  }

  async createMatch() {
    this.matchMessage.set('');

    const payload = {
      date: this.createMatchPayload.date,
      home_team: this.createMatchPayload.home_team.trim(),
      away_team: this.createMatchPayload.away_team.trim(),
      home_score: this.createMatchPayload.home_score,
      away_score: this.createMatchPayload.away_score,
      status: this.createMatchPayload.status.trim() || 'scheduled',
    };

    if (!payload.date || !payload.home_team || !payload.away_team) {
      this.matchMessage.set('Merci de remplir la date et les équipes du match.');
      return;
    }

    try {
      await this.matchesService.createMatch(payload);
      this.matchMessage.set('Match créé avec succès.');
      this.createMatchPayload = { date: '', home_team: '', away_team: '', home_score: 0, away_score: 0, status: 'scheduled' };
      await this.loadMatches();
    } catch (error) {
      this.matchMessage.set('Erreur lors de la création du match.');
    }
  }

  getPlayerLabel(player: Player) {
    return player.username || player.name || 'Joueur inconnu';
  }

  getMatchLabel(match: Match) {
    return `${match.home_team} vs ${match.away_team}`;
  }
}

