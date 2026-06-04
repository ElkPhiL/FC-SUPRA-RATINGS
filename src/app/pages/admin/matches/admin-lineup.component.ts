import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ActivatedRoute } from '@angular/router';

import { LineupPitchComponent } from '../../../components/lineup-pitch/lineup-pitch.component';
import { PlayerOnPitch } from '../../../components/player-on-pitch/player-on-pitch.component';
import { PlayerSearchComponent } from '../../../components/player-search/player-search.component';

import { MatchesService } from '../../../services/matches.service';
import { PlayersService } from '../../../services/players.service';
import { MatchPlayersService } from '../../../services/match-players.service';

import { Player } from '../../../models/player.model';
import { FORMATIONS } from '../../../shared/constants/formations';
import { MatchPlayerPayload, MatchPlayerWithPlayer } from '../../../models/match-players.model';

@Component({
  selector: 'app-admin-lineup',
  standalone: true,
  imports: [CommonModule, DragDropModule, PlayerOnPitch, PlayerSearchComponent, LineupPitchComponent],
  templateUrl: './admin-lineup.component.html',
  styleUrls: ['./admin-lineup.component.scss'],
})
export class AdminLineupComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private playersService = inject(PlayersService);
  private matchesService = inject(MatchesService);
  private matchPlayersService = inject(MatchPlayersService);

  matchId = signal<number>(+this.route.snapshot.params['id']);
  matchData = signal<any | null>(null); 
  players = signal<Player[]>([]);
  loading = signal<boolean>(true);
  message = signal<string>('');
  
  searchOpen = signal<boolean>(false);
  selectedSlot = signal<any | null>(null);
  
  // Onglet d'équipe actif
  activeTeam = signal<'home' | 'away'>('home');

  // Structure globale indexée par "home_1", "away_9", etc.
  lineup = signal<Record<string, MatchPlayerWithPlayer | null>>({});

  formations = FORMATIONS;
  homeFormation = signal(this.formations[0]);
  awayFormation = signal(this.formations[0]);

  currentFormation = computed(() => this.activeTeam() === 'home' ? this.homeFormation() : this.awayFormation());

  benchFormation = signal({
    slots: Array.from({ length: 9 }, (_, i) => ({ key: `sub_${i + 1}`, label: 'Remplaçant' }))
  });

  availablePlayers = computed(() => {
    const match = this.matchData();
    const activeSide = this.activeTeam();
    
    if (!match) return [];

    const activeClubId = activeSide === 'home' 
      ? (match.home_team_id || match.home_team?.id) 
      : (match.away_team_id || match.away_team?.id);

    if (!activeClubId) return [];

    return this.players().filter(player => {
      const belongsToActiveClub = player.current_team_id === activeClubId;
      const isAlreadyUsed = this.isPlayerUsedInCurrentTeam(player);
      
      return belongsToActiveClub && !isAlreadyUsed;
    });
  });

  ngOnInit(): void {
    this.initializeData();
  }

  private async initializeData(): Promise<void> {
    this.loading.set(true);
    await this.loadMatchDetails();
    await this.loadPlayers();
    this.resetLineupStructures();
    await this.loadSavedLineups();
    this.loading.set(false);
  }

  async loadMatchDetails(): Promise<void> {
    try {
      const match = await this.matchesService.getById(this.matchId());
      this.matchData.set(match);
    } catch (error) {
      this.message.set('Impossible de charger les détails du match.');
    }
  }

  async loadPlayers(): Promise<void> {
    const match = this.matchData();
    if (!match) return;

    try {
      const homeId = match.home_team_id || match.home_team?.id;
      const awayId = match.away_team_id || match.away_team?.id;

      const [homePlayers, awayPlayers] = await Promise.all([
        this.playersService.getByTeam(homeId),
        this.playersService.getByTeam(awayId)
      ]);

      this.players.set([...homePlayers, ...awayPlayers]);
    } catch (error) {
      console.error(error);
      this.message.set('Erreur lors du chargement ciblé des joueurs.');
    }
  }

  resetLineupStructures(): void {
    const freshLineup: Record<string, MatchPlayerWithPlayer | null> = {};
    
    ['home', 'away'].forEach(prefix => {
      for (let i = 1; i <= 11; i++) {
        freshLineup[`${prefix}_${i}`] = null;
      }
      this.benchFormation().slots.forEach(s => freshLineup[`${prefix}_${s.key}`] = null);
    });

    this.lineup.set(freshLineup);
  }

  isPlayerUsedInCurrentTeam(player: Player): boolean {
    const prefix = this.activeTeam() + '_';
    return Object.entries(this.lineup()).some(
      ([key, val]) => key.startsWith(prefix) && val?.player.id === player.id
    );
  }

  async loadSavedLineups(): Promise<void> {
    const currentMatchId = this.matchId();
    const match = this.matchData();
    if (!match) return;

    try {
      if (match.home_formation) {
        const hForm = this.formations.find(f => f.name === match.home_formation);
        if (hForm) this.homeFormation.set(hForm);
      }
      if (match.away_formation) {
        const aForm = this.formations.find(f => f.name === match.away_formation);
        if (aForm) this.awayFormation.set(aForm);
      }

      const savedMatchPlayers = await this.matchPlayersService.getByMatch(currentMatchId);
      const currentLineup = { ...this.lineup() };

      savedMatchPlayers.forEach(matchPlayer => {
        const fullPlayerInfo = this.players().find(p => p.id === matchPlayer.player_id);
        if (fullPlayerInfo && matchPlayer.slot_key) {
          currentLineup[matchPlayer.slot_key] = {
            ...matchPlayer,
            player: fullPlayerInfo
          };
        }
      });

      this.lineup.set(currentLineup);
    } catch (error) {
      console.error(error);
      this.message.set('Erreur lors du chargement des compositions.');
    }
  }

  changeFormation(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const formation = this.formations.find(f => f.name === selectElement.value);
    
    if (formation) {
      if (this.activeTeam() === 'home') {
        this.homeFormation.set(formation);
      } else {
        this.awayFormation.set(formation);
      }
    }
  }

  getSlotPlayer(slotKey: string): MatchPlayerWithPlayer | null {
    const globalKey = `${this.activeTeam()}_${slotKey}`;
    return this.lineup()[globalKey] || null;
  }

  getCurrentTeamPitchLineup(): Record<string, MatchPlayerWithPlayer | null> {
    const pitchLineup: Record<string, MatchPlayerWithPlayer | null> = {};
    for (let i = 1; i <= 11; i++) {
      pitchLineup[`${i}`] = this.getSlotPlayer(`${i}`);
    }
    return pitchLineup;
  }

  deleteFromSlot(slotKey: string): void {
    const globalKey = `${this.activeTeam()}_${slotKey}`;
    this.lineup.update(current => ({ ...current, [globalKey]: null }));
  }

  openSearch(slot: any): void {
    this.selectedSlot.set(slot);
    this.searchOpen.set(true);
  }

  assignPlayerFromSearch(player: Player): void {
    const slot = this.selectedSlot();
    if (!slot) return;

    const globalKey = `${this.activeTeam()}_${slot.key}`;

    this.lineup.update(current => ({
      ...current,
      [globalKey]: {
        id: 0, // Sera résolu lors du diff dans saveLineup()
        match_id: this.matchId(),
        player_id: player.id,
        role: slot.key.startsWith('sub') ? 'sub' : 'starter',
        position_played: slot.label,
        created_at: null,
        is_captain: false,
        slot_key: globalKey,
        player: player
      }
    }));

    this.searchOpen.set(false);
  }

  clearCurrentTeamLineup(): void {
    const prefix = this.activeTeam() + '_';
    this.lineup.update(current => {
      const updated = { ...current };
      Object.keys(updated).forEach(key => {
        if (key.startsWith(prefix)) {
          updated[key] = null;
        }
      });
      return updated;
    });
  }

  async saveLineup(): Promise<void> {
    this.loading.set(true);
    this.message.set('Sauvegarde des compositions...');

    try {
      const currentMatchId = this.matchId();
      const currentLineup = this.lineup();
      
      // 1. Récupérer l'état actuel de la base de données
      const savedMatchPlayers = await this.matchPlayersService.getByMatch(currentMatchId);
      
      const payloadsToUpsert: MatchPlayerPayload[] = [];
      const currentPlayerIdsOnScreen = new Set<number>();

      // Ajustement des libellés de postes selon la formation courante
      ['home', 'away'].forEach(prefix => {
        const formation = prefix === 'home' ? this.homeFormation() : this.awayFormation();
        formation.slots.forEach(slot => {
          const globalKey = `${prefix}_${slot.key}`;
          const matchPlayer = currentLineup[globalKey];
          if (matchPlayer) {
            matchPlayer.position_played = slot.label;
          }
        });
      });

      // 2. Parcourir l'écran pour bâtir les payloads ET lister les joueurs présents
      Object.entries(currentLineup).forEach(([globalKey, matchPlayer]) => {
        if (matchPlayer) {
          // On garde en mémoire que ce joueur est sur le terrain/banc à l'écran
          currentPlayerIdsOnScreen.add(matchPlayer.player.id);

          const payload: MatchPlayerPayload = {
            match_id: currentMatchId,
            player_id: matchPlayer.player.id,
            role: matchPlayer.role,
            position_played: matchPlayer.position_played,
            is_captain: matchPlayer.is_captain,
            slot_key: globalKey
          };

          // ⚠️ SI TU AS CHOISI L'OPTION 1 (id optionnel dans le type) : Uncommente la ligne ci-dessous !
          // const existing = savedMatchPlayers.find(s => s.player_id === matchPlayer.player.id);
          // if (existing) (payload as any).id = existing.id;

          payloadsToUpsert.push(payload);
        }
      });

      // 3. 🔥 LA CORRECTION : On identifie les vrais records à supprimer
      // On ne supprime QUE si le joueur sauvé en BD n'est PLUS DU TOUT présent à l'écran.
      const idsToDelete = savedMatchPlayers
        .filter(saved => !currentPlayerIdsOnScreen.has(saved.player_id))
        .map(saved => saved.id);

      // 4. Mettre à jour les métadonnées du match (formations)
      await this.matchesService.updateFormations(currentMatchId, this.homeFormation().name, this.awayFormation().name);

      // 5. Nettoyage ciblé : Ne supprimera RIEN si c'est les mêmes joueurs
      if (idsToDelete.length > 0) {
        await Promise.all(idsToDelete.map(id => this.matchPlayersService.delete(id)));
      }

      // 6. Sauvegarde intelligente
      if (payloadsToUpsert.length > 0) {
        await this.matchPlayersService.addMany(payloadsToUpsert);
      }

      this.message.set('Compositions enregistrées avec succès !');
      
      // Réaligne l'état local
      await this.loadSavedLineups();

    } catch (error) {
      console.error(error);
      this.message.set('Erreur lors de la sauvegarde.');
    } finally {
      this.loading.set(false);
    }
  }

  assignCaptainToSlot(slotKey: string): void {
    const prefix = this.activeTeam() + '_';
    const targetGlobalKey = `${prefix}${slotKey}`;

    this.lineup.update(currentLineup => {
      // Créer une copie profonde pour éviter de muter le signal directement
      const updated = { ...currentLineup };

      // 1. Retirer le brassard (is_captain: false) à tous les joueurs de l'équipe active
      Object.keys(updated).forEach(key => {
        if (key.startsWith(prefix) && updated[key]) {
          updated[key] = { 
            ...updated[key]!, 
            is_captain: false 
          };
        }
      });

      // 2. Donner le brassard au joueur ciblé
      if (updated[targetGlobalKey]) {
        updated[targetGlobalKey] = { 
          ...updated[targetGlobalKey]!, 
          is_captain: true 
        };
      }

      return updated;
    });
  }
}