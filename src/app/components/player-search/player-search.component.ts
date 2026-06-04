import {
  Component,
  input,
  Output,
  EventEmitter,
  signal,
  computed,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Player } from '../../models/player.model';
import { PlayerPosition } from '../../shared/constants/player.constants';

@Component({
  selector: 'app-player-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './player-search.component.html',
  styleUrls: ['./player-search.component.scss'],
})
export class PlayerSearchComponent {
  visible = input(false);
  players = input<Player[]>([]);
  slotLabel = input<PlayerPosition>();

  @Output() close = new EventEmitter<void>();
  @Output() selectPlayer = new EventEmitter<Player>();

  search = signal('');

  constructor() {
    effect(() => {
      if (this.visible()) {
        this.search.set('');
      }
    });
  }

  filteredPlayers = computed(() => {
    const term = this.search().toLowerCase().trim();
    const slot = this.slotLabel();
    const allPlayers = this.players() || [];

    // 1. On applique une passe de nettoyage pour transformer la structure Supabase en tableau de strings
    const mappedPlayers = allPlayers.map(player => {
      if (!player) return null;

      // On extrait dynamiquement les abréviations de postes du sous-tableau d'objets player_positions
      // Note : Ajuste 'p.position' si la clé dans l'objet est différente (ex: p.position_name ou p.name)
      const secondaryPositions: string[] = (player as any).player_positions
        ? (player as any).player_positions.map((p: any) => p.position || p.name || p.position_played).filter(Boolean)
        : [];

      return {
        ...player,
        positions: secondaryPositions // On injecte le tableau propre de strings ici !
      };
    }).filter(Boolean) as (Player & { positions: string[] })[];

    // 2. Filtrage intelligent
    const filtered = mappedPlayers.filter(player => {
      const nameMatch = player.display_name?.toLowerCase().includes(term);
      const numberMatch = player.number?.toString().includes(term);
      const positionMatch = player.positions?.some(p => p?.toLowerCase().includes(term));

      return !term || nameMatch || numberMatch || positionMatch;
    });

    // 3. Tri par pertinence de poste puis par numéro
    return filtered.sort((a, b) => {
      const prioDiff = this.getPriority(b, slot) - this.getPriority(a, slot);
      if (prioDiff !== 0) return prioDiff;
      
      return (a.number || 0) - (b.number || 0);
    });
  });

  private getPriority(player: any, slot: PlayerPosition | undefined): number {
    if (!player || !slot) return 0;
    if (player.best_position === slot) return 2;
    if (player.positions && player.positions.includes(slot)) return 1;
    return 0;
  }

  choose(player: any) {
    this.selectPlayer.emit(player);
    this.close.emit();
  }

  closeModal() {
    this.close.emit();
  }
}