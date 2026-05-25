import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Player } from '../../models/player.model';
import { PlayerOnPitch } from '../player-on-pitch/player-on-pitch.component';

@Component({
  selector: 'app-lineup-pitch',
  standalone: true,
  imports: [CommonModule, PlayerOnPitch],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './lineup-pitch.component.html',
  styleUrls: ['./lineup-pitch.component.scss'],
})

export class LineupPitchComponent {

  @Input({ required: true })
  formation!: any;

  @Input({ required: true })
  lineup!: Record<string, Player | null>;

  @Input()
  editable = false;

  @Output()
  slotClick = new EventEmitter<any>();

  @Output()
  removePlayer = new EventEmitter<string>();

  getPlayer(slotKey: string) {
    return this.lineup[slotKey];
  }
}
