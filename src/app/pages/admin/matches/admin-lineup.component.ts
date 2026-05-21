import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { PlayersService } from '../../../services/players.service';
import { MatchPlayersService } from '../../../services/match-players.service';
import { Player } from '../../../models/player.model';
import { FORMATIONS } from '../../../shared/constants/formations';
import { PlayerOnPitch } from '../../../components/player-on-pitch/player-on-pitch.component';
import { PlayerSearchComponent } from '../../../components/player-search/player-search.component';

@Component({
  selector: 'app-admin-lineup',
  standalone: true,
  imports: [CommonModule, DragDropModule, PlayerOnPitch, PlayerSearchComponent],
  templateUrl: './admin-lineup.component.html',
  styleUrls: ['./admin-lineup.component.scss'],
})

export class AdminLineupComponent {
  matchId!: number;
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

  constructor(private playersService: PlayersService) {
        this.loadPlayers();
        this.resetLineup();
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
}