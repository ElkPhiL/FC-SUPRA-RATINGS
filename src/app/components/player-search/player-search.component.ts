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

    const filtered = this.players().filter(player => {
      const matchesSearch =
        !term ||
        player.display_name.toLowerCase().includes(term) ||
        player.number.toString().includes(term);

      return matchesSearch;
    });

    const getPriority = (player: Player) => {
      if (player.best_position === slot) return 2;
      if (player.positions?.includes(slot)) return 1;
      return 0;
    };

    return filtered.sort((a, b) => {
      const prioDiff =
        getPriority(b) - getPriority(a);

      if (prioDiff !== 0) return prioDiff;

      return a.number - b.number;
    });
  });

  getPriority(player: Player): 0 | 1 | 2 {
    const slot = this.slotLabel();

    if (player.best_position === slot) return 2;
    if (player.positions?.includes(slot)) return 1;
    return 0;
  }

  choose(player: Player) {
    this.selectPlayer.emit(player);
    this.close.emit();
  }

  closeModal() {
    this.close.emit();
  }
}