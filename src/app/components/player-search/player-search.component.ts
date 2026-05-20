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
  slotLabel = input('');
  slotKey = input('');

  @Output() close = new EventEmitter<void>();
  @Output() selectPlayer = new EventEmitter<Player>();

  search = signal('');
  selectedFilter = signal<'all' | 'favorite'>('favorite');

  constructor() {
    effect(() => {
      if (this.visible()) {
        this.search.set('');
        this.selectedFilter.set('favorite');
      }
    });
  }

  filteredPlayers = computed(() => {
    const term = this.search().toLowerCase().trim();

    return this.players()
      .filter(player => {
        const matchesSearch =
          !term ||
          player.display_name.toLowerCase().includes(term) ||
          player.number.toString().includes(term);

        const matchesFavorite =
          this.selectedFilter() === 'all'
            ? true
            : player.best_position === this.slotLabel();

        console.log(`Filtering player ${player.display_name} (position: ${player.best_position}) - ${this.slotLabel()}`);

        return matchesSearch && matchesFavorite;
      })
      .sort((a,b) => a.number - b.number);
  });

  choose(player: Player) {
    this.selectPlayer.emit(player);
    this.close.emit();
  }

  closeModal() {
    this.close.emit();
  }
}