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
    first_name: '',
    last_name: '',
    display_name: '',
    number: null as number | null,
    position: '',
    nationality: '',
    photo_url: '',
    active: true,
  } as {
    first_name: string;
    last_name: string;
    display_name: string;
    number: number | null;
    position: string;
    nationality: string;
    photo_url: string;
    active: boolean;
  };

  createMatchPayload = {
    match_date: '',
    opponent: '',
    competition: '',
    home_away: '',
    venue: '',
    fc_supra_score: 0,
    opponent_score: 0,
    status: 'scheduled',
  } as {
    match_date: string;
    opponent: string;
    competition: string;
    home_away: string;
    venue: string;
    fc_supra_score: number;
    opponent_score: number;
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
      console.error('Error loading players:', error);
      this.playerMessage.set(this.formatErrorMessage(error, 'Impossible de charger les joueurs.'));
    } finally {
      this.loadingPlayers.set(false);
    }
  }

  async createPlayer() {
    this.playerMessage.set('');

    const displayName = this.createPlayerPayload.display_name.trim();
    const number = this.createPlayerPayload.number;

    if (!displayName) {
      this.playerMessage.set('Le nom d’affichage est requis.');
      return;
    }

    if (number === null || number <= 0) {
      this.playerMessage.set('Le numéro du joueur doit être un entier supérieur à 0.');
      return;
    }

    try {
      await this.playersService.createPlayer({
        first_name: this.createPlayerPayload.first_name.trim() || null,
        last_name: this.createPlayerPayload.last_name.trim() || null,
        display_name: displayName,
        number,
        position: this.createPlayerPayload.position.trim() || null,
        nationality: this.createPlayerPayload.nationality.trim() || null,
        photo_url: this.createPlayerPayload.photo_url.trim() || null,
        active: this.createPlayerPayload.active,
      });
      this.playerMessage.set('Joueur créé avec succès.');
      this.createPlayerPayload = {
        first_name: '',
        last_name: '',
        display_name: '',
        number: null,
        position: '',
        nationality: '',
        photo_url: '',
        active: true,
      };
      await this.loadPlayers();
    } catch (error) {
      console.error('Error creating player:', error);
      this.playerMessage.set(this.formatErrorMessage(error, 'Erreur lors de la création du joueur.'));
    }
  }

  deletePlayer(playerId: number) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce joueur ?')) {
      return;
    }

    this.playersService.deletePlayer(playerId)
      .then(() => {
        this.playerMessage.set('Joueur supprimé avec succès.');
        this.loadPlayers();
      })
      .catch(error => {
        console.error('Error deleting player:', error);
        this.playerMessage.set(this.formatErrorMessage(error, 'Erreur lors de la suppression du joueur.'));
      });
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
      console.error('Error loading matches:', error);
      this.matchMessage.set(this.formatErrorMessage(error, 'Impossible de charger les matchs.'));
    } finally {
      this.loadingMatches.set(false);
    }
  }

  async createMatch() {
    this.matchMessage.set('');

    const payload: CreateMatchPayload = {
      match_date: this.createMatchPayload.match_date || null,
      opponent: this.createMatchPayload.opponent.trim(),
      competition: this.createMatchPayload.competition.trim() || null,
      home_away: this.createMatchPayload.home_away.trim() || null,
      venue: this.createMatchPayload.venue.trim() || null,
      fc_supra_score: this.createMatchPayload.fc_supra_score ?? null,
      opponent_score: this.createMatchPayload.opponent_score ?? null,
      status: this.createMatchPayload.status.trim() || 'scheduled',
    };

    if (!payload.match_date || !payload.opponent) {
      this.matchMessage.set('La date et l’adversaire sont requis pour créer un match.');
      return;
    }

    try {
      await this.matchesService.createMatch(payload);
      this.matchMessage.set('Match créé avec succès.');
      this.createMatchPayload = {
        match_date: '',
        opponent: '',
        competition: '',
        home_away: '',
        venue: '',
        fc_supra_score: 0,
        opponent_score: 0,
        status: 'scheduled',
      };
      await this.loadMatches();
    } catch (error) {
      console.error('Error creating match:', error);
      this.matchMessage.set(this.formatErrorMessage(error, 'Erreur lors de la création du match.'));
    }
  }

  getPlayerLabel(player: Player) {
    return player.display_name || `${player.first_name || ''} ${player.last_name || ''}`.trim() || 'Joueur inconnu';
  }

  getMatchLabel(match: Match) {
    const location = match.home_away ? `${match.home_away} · ` : '';
    return `${location}${match.opponent}`;
  }

  private formatErrorMessage(error: any, fallback: string): string {
    if (error?.message === 'permission denied for table players' || 
        error?.message?.includes('permission denied')) {
      return 'Erreur de permissions : La table players n\'est pas accessible. Configure les RLS (Row Level Security) dans Supabase pour permettre l\'INSERT. Va dans Supabase Dashboard > Authentication > Policies et ajoute une politique permettant à tout utilisateur connecté d\'insérer des joueurs.';
    }
    if (error?.message === 'permission denied for table matches' || 
        error?.message?.includes('permission denied')) {
      return 'Erreur de permissions : La table matches n\'est pas accessible. Configure les RLS pour cette table dans le Supabase Dashboard.';
    }
    if (error?.message) {
      return `Erreur : ${error.message}`;
    }
    if (error?.details) {
      return `Erreur : ${error.details}`;
    }
    return fallback;
  }
}

