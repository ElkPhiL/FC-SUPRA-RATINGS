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

  // Éléments d'état (Signals)
  matchId = signal<number>(+this.route.snapshot.params['id']);
  players = signal<Player[]>([]);
  loading = signal<boolean>(true);
  message = signal<string>('');
  
  searchOpen = signal<boolean>(false);
  selectedSlot = signal<any | null>(null);
  lineup = signal<Record<string, MatchPlayerWithPlayer | null>>({});

  formations = FORMATIONS;
  selectedFormation = signal(this.formations[0]);

  benchFormation = signal({
    slots: Array.from({ length: 9 }, (_, i) => ({ key: `sub_${i + 1}`, label: 'Remplaçant' }))
  });

  // Sélections d'état dérivées (Computed)
  availablePlayers = computed(() =>
    this.players().filter(player => !this.isPlayerUsed(player))
  );

  ngOnInit(): void {
    this.initializeData();
  }

  private async initializeData(): Promise<void> {
    this.loading.set(true);
    await this.loadPlayers();
    this.resetLineup();
    await this.loadSavedLineup();
    this.loading.set(false);
  }

  async loadPlayers(): Promise<void> {
    try {
      const allPlayers = await this.playersService.getPlayersWithPositions();
      this.players.set(allPlayers);
      if (!allPlayers.length) {
        this.message.set('Aucun joueur actif trouvé.');
      }
    } catch (error) {
      this.message.set('Erreur lors du chargement des joueurs.');
    }
  }

  async loadSavedLineup(): Promise<void> {
    const currentMatchId = this.matchId();
    try {
      const match = await this.matchesService.getById(currentMatchId); 
      
      if (match?.formation) {
        const savedFormation = this.formations.find(f => f.name === match.formation);
        if (savedFormation) {
          this.selectedFormation.set(savedFormation);
        }
      }

      const preparedLineup: Record<string, MatchPlayerWithPlayer | null> = {};
      this.selectedFormation().slots.forEach(slot => preparedLineup[slot.key] = null);
      this.benchFormation().slots.forEach(slot => preparedLineup[slot.key] = null);

      const savedMatchPlayers = await this.matchPlayersService.getByMatch(currentMatchId);

      savedMatchPlayers.forEach(matchPlayer => {
        const fullPlayerInfo = this.players().find(p => p.id === matchPlayer.player_id);
        if (fullPlayerInfo && matchPlayer.slot_key) {
          preparedLineup[matchPlayer.slot_key] = {
            ...matchPlayer,
            player: fullPlayerInfo
          };
      }});

      this.lineup.set(preparedLineup);
    } catch (error) {
      console.error(error);
      this.message.set('Impossible de charger la composition existante.');
    }
  }

  resetLineup(): void {
    const freshLineup: Record<string, MatchPlayerWithPlayer | null>= {};
    this.selectedFormation().slots.forEach(slot => freshLineup[slot.key] = null);
    this.benchFormation().slots.forEach(slot => freshLineup[slot.key] = null);
    this.lineup.set(freshLineup);
  }

  isPlayerUsed(player: Player): boolean {

    return Object.values(this.lineup()).some(
      p => p?.player.id === player.id
    );

  }

  changeFormation(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const formation = this.formations.find(f => f.name === selectElement.value);
    
    if (formation) {
      this.selectedFormation.set(formation);
      // Optionnel : décommente si tu veux reset le terrain au changement de tactique
      // this.resetLineup(); 
    }
  }

  deleteFromSlot(slotKey: string): void {
    this.lineup.update(current => ({ ...current, [slotKey]: null }));
  }

  openSearch(slot: any): void {
    this.selectedSlot.set(slot);
    this.searchOpen.set(true);
  }

  assignPlayerFromSearch(player: Player): void {

    const slot = this.selectedSlot();

    if (!slot) return;

    this.lineup.update(current => ({

      ...current,

      [slot.key]: {
        id: 0,
        match_id: this.matchId(),
        player_id: player.id,
        role: 'starter',
        position_played: null,
        created_at: null,
        is_captain: false,
        slot_key: slot.key,
        player: player
      }

    }));

    this.searchOpen.set(false);

  }

  async saveLineup(): Promise<void> {
    this.loading.set(true);
    this.message.set('Sauvegarde de la composition...');

    try {
      const currentMatchId = this.matchId();
      const currentLineup = this.lineup();
      const payloads: MatchPlayerPayload[] = [];

      await this.matchesService.updateFormation(currentMatchId, this.selectedFormation().name);

      // Titulaires
      this.selectedFormation().slots.forEach(slot => {

        const matchPlayer = currentLineup[slot.key];

        if (matchPlayer) {

          payloads.push({
            match_id: currentMatchId,

            player_id: matchPlayer.player.id,

            role: 'starter',

            position_played: slot.label,

            is_captain: false,

            slot_key: slot.key
          });

        }

      });

      // Remplaçants
      this.benchFormation().slots.forEach(slot => {

        const matchPlayer = currentLineup[slot.key];

        if (matchPlayer) {

          payloads.push({
            match_id: currentMatchId,

            player_id: matchPlayer.player.id,

            role: 'sub',

            position_played: slot.label,

            is_captain: false,

            slot_key: slot.key
          });

        }

      });

      await this.matchPlayersService.deleteByMatch(currentMatchId);

      if (payloads.length > 0) {
        await this.matchPlayersService.addMany(payloads);
      }

      this.message.set('Composition sauvegardée avec succès !');
    } catch (error) {
      console.error(error);
      this.message.set('Erreur lors de la sauvegarde.');
    } finally {
      this.loading.set(false);
    }
  }
}