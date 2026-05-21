import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { PlayerPosition } from '../../shared/constants/player.constants';

interface PositionNode {
  code: PlayerPosition;
  top: string;
  left: string;
}

@Component({
  selector: 'app-position-picker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './position-picker.component.html',
  styleUrls: ['./position-picker.component.scss'],
})
export class PositionPickerComponent {
  @Input() positionsSelected: PlayerPosition[] = [];

  @Input() favoritePosition: PlayerPosition | null = null;

  @Output() positionsSelectedChange =
    new EventEmitter<PlayerPosition[]>();

  @Output() favoritePositionChange =
    new EventEmitter<PlayerPosition | null>();

  positions: PositionNode[] = [
    { code: 'GK', top: '88%', left: '50%' },
    { code: 'LWB', top: '55%', left: '18%' },
    { code: 'RWB', top: '55%', left: '82%' },
    { code: 'LB', top: '72%', left: '18%' },
    { code: 'CB', top: '72%', left: '50%' },
    { code: 'RB', top: '72%', left: '82%' },
    { code: 'CDM', top: '55%', left: '50%' },
    { code: 'CM', top: '42%', left: '50%' },
    { code: 'LM', top: '42%', left: '18%' },
    { code: 'RM', top: '42%', left: '82%' },
    { code: 'CAM', top: '29%', left: '50%' },
    { code: 'LW', top: '18%', left: '20%' },
    { code: 'RW', top: '18%', left: '80%' },
    { code: 'ST', top: '8%', left: '50%' },
  ];

  onPositionLeftClick(position: PlayerPosition) {
    if (this.favoritePosition === position) {
      this.favoritePosition = null;
      this.positionsSelected = [
        ...this.positionsSelected,
        position
      ];
    } else {
      this.favoritePosition = position;
      if (!this.positionsSelected.includes(position)) {
        this.positionsSelected = [
            ...this.positionsSelected,
            position
        ];
      }
    }
    this.emitAll();
  }

  onPositionRightClick(event: MouseEvent, position: PlayerPosition) {
    event.preventDefault();

    if (this.favoritePosition === position) {
        return;
    }

    if (this.positionsSelected.includes(position)) {
        this.positionsSelected = this.positionsSelected.filter(p => p !== position);
    } else {
        this.positionsSelected = [
            ...this.positionsSelected,
            position
        ];
    }
    this.emitAll();
  }

  isSelected(position: PlayerPosition) {
    return this.positionsSelected.includes(position);
  }

  isFavorite(position: PlayerPosition) {
    return this.favoritePosition === position;
  }

  private emitAll() {
    this.positionsSelectedChange.emit(
      this.positionsSelected
    );

    this.favoritePositionChange.emit(
      this.favoritePosition
    );
  }
}