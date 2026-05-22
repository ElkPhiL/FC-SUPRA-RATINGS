import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ActivatedRoute } from '@angular/router';

import { MatchesService } from '../../../services/matches.service';
import { PlayersService } from '../../../services/players.service';
import { MatchPlayersService } from '../../../services/match-players.service';
import { Player } from '../../../models/player.model';
import { FORMATIONS } from '../../../shared/constants/formations';
import { PlayerOnPitch } from '../../../components/player-on-pitch/player-on-pitch.component';
import { PlayerSearchComponent } from '../../../components/player-search/player-search.component';
import { MatchPlayerPayload } from '../../../models/match-players.model';

@Component({
  selector: 'app-admin-lineup',
  standalone: true,
  imports: [CommonModule, DragDropModule, PlayerOnPitch, PlayerSearchComponent],
  templateUrl: './admin-lineup.component.html',
  styleUrls: ['./admin-lineup.component.scss'],
})

export class AdminLineupComponent {
  private route = inject(ActivatedRoute);
  private playersService = inject(PlayersService);
  private matchesService = inject(MatchesService);
  private matchPlayersService = inject(MatchPlayersService);

  matchId = signal<number>(+this.route.snapshot.params['id']);
  players = signal<Player[]>([]);
  loading = signal(true);
  message = signal('');

  availablePlayers = computed(() =>
    this.players().filter(player => !this.isPlayerUsed(player))
  );

  searchOpen = signal(false);
  selectedSlot = signal<any | null>(null);

  lineup = signal<Record<string, Player | null>>({});
  previewingSlot = signal<string | null>(null);
  previewPlayer = signal<Player | null>(null);

  formations = FORMATIONS;
  selectedFormation = signal(this.formations[0]);

  // Exemple de structure dans ton TS
  public benchFormation = signal({
    slots: [
      { key: 'sub_1', label: 'Sub' },
      { key: 'sub_2', label: 'Sub' },
      { key: 'sub_3', label: 'Sub' },
      { key: 'sub_4', label: 'Sub' },
      { key: 'sub_5', label: 'Sub' },
      { key: 'sub_6', label: 'Sub' },
      { key: 'sub_7', label: 'Sub' },
      { key: 'sub_8', label: 'Sub' },
      { key: 'sub_9', label: 'Sub' },
    ]
  });

  constructor() {
    this.loadPlayers();
    this.resetLineup();
    this.loadSavedLineup();
  }

  async loadSavedLineup() {
    const currentMatchId = this.matchId();

    try {
      // 1. Récupérer les infos du match pour avoir la formation (ex: '4-3-3')
      // Note : J'invente le nom 'getMatchById', ajuste selon ton MatchesService
      const match = await this.matchesService.getById(currentMatchId); 
      
      if (match && match.formation) {
        const savedFormation = this.formations.find(f => f.name === match.formation);
        if (savedFormation) {
          this.selectedFormation.set(savedFormation);
        }
      }

      // 2. Initialiser le dictionnaire des slots vides basé sur la bonne formation
      const preparedLineup: Record<string, Player | null> = {};
      
      // On pré-remplit les slots des titulaires à null
      this.selectedFormation().slots.forEach(slot => {
        preparedLineup[slot.key] = null;
      });
      // On pré-remplit les slots du banc à null
      this.benchFormation().slots.forEach(slot => {
        preparedLineup[slot.key] = null;
      });

      // 3. Récupérer les joueurs enregistrés pour ce match
      const savedMatchPlayers = await this.matchPlayersService.getByMatch(currentMatchId);

      // 4. Associer chaque joueur de la BDD à son slot dans Angular
      savedMatchPlayers.forEach(matchPlayer => {
        // On cherche l'objet complet "Player" dans notre liste globale grâce à l'ID
        const fullPlayerInfo = this.players().find(p => p.id === matchPlayer.player_id);
        
        if (fullPlayerInfo && matchPlayer.slot_key) {
          // On place le joueur complet dans le bon slot
          preparedLineup[matchPlayer.slot_key] = fullPlayerInfo;
        }
      });

      // 5. On met à jour le Signal de la lineup d'un seul coup !
      this.lineup.set(preparedLineup);

    } catch (error) {
      console.error('Erreur au chargement de la compo:', error);
      this.message.set('Impossible de charger la composition existante.');
    }
  }

  async loadPlayers() {
    this.loading.set(true);
    this.message.set('');

    try {
        const players = await this.playersService.getPlayersWithPositions();
        this.players.set(players);

        if (!players.length) {
        this.message.set('Aucun joueur actif trouvé.');
        }

    } catch (error: any) {
        this.message.set('Erreur de chargement');
    } finally {
        this.loading.set(false);
    }
  }

  resetLineup() {
    const obj: any = {};

    this.selectedFormation().slots.forEach(slot => {
        obj[slot.key] = null;
    });

    this.lineup.set(obj);
  }

  isPlayerUsed(player: Player): boolean {
    return Object.values(this.lineup())
        .some(p => p?.id === player.id);
  }

  changeFormation(event:any) {
    const name = event.target.value;

    const formation = this.formations.find(f => f.name === name);

    if (!formation) return;

    this.selectedFormation.set(formation);
  }

  deleteFromSlot(slotKey: string) {
    const current = { ...this.lineup() };
    current[slotKey] = null;
    this.lineup.set(current);
  }

  openSearch(slot: any) {
    this.selectedSlot.set(slot);
    this.searchOpen.set(true);
  }

  assignPlayerFromSearch(player: Player) {
    const slot = this.selectedSlot();
    if (!slot) return;

    const current = { ...this.lineup() };
    current[slot.key] = player;

    this.lineup.set(current);
    this.searchOpen.set(false);
  }

async saveLineup() {
    this.loading.set(true);
    this.message.set('Sauvegarde de la composition...');

    try {
      const currentMatchId = this.matchId();
      const lineup = this.lineup();
      const payloads: MatchPlayerPayload[] = [];

      // 1. Sauvegarder le type de formation globale du match
      await this.matchesService.updateFormation(currentMatchId, this.selectedFormation().name);

      // 2. Préparer les données pour les TITULAIRES (Starter)
      // On parcourt les slots de la formation sélectionnée pour éviter d'embarquer les clés du banc par erreur
      this.selectedFormation().slots.forEach(slot => {
        const player = lineup[slot.key];
        if (player) {
          payloads.push({
            match_id: currentMatchId,
            player_id: player.id,
            role: 'starter',
            position_played: slot.label,
            is_captain: false,
            slot_key: slot.key
          });
        }
      });

      // 3. Préparer les données pour les REMPLAÇANTS (Bench)
      this.benchFormation().slots.forEach(slot => {
        const player = lineup[slot.key];
        if (player) {
          payloads.push({
            match_id: currentMatchId,
            player_id: player.id,
            role: 'sub',
            position_played: slot.label,
            is_captain: false,
            slot_key: slot.key
          });
        }
      });

      // 4. L'ÉTAPE CLÉ : On nettoie l'ancienne compo existante en BDD pour ce match
      await this.matchPlayersService.deleteByMatch(currentMatchId);

      // 5. On insère la nouvelle liste d'un seul coup (Bulk Insert) s'il y a des joueurs
      if (payloads.length > 0) {
        await this.matchPlayersService.addMany(payloads);
      }

      this.message.set('Composition sauvegardée avec succès !');

    } catch (error: any) {
      console.error(error);
      this.message.set('Erreur lors de la sauvegarde de la composition.');
    } finally {
      this.loading.set(false);
    }
  }
}