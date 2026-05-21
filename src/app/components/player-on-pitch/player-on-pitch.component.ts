import { Component } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import { Player } from '../../models/player.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-player-on-pitch',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player-on-pitch.component.html',
  styleUrls: ['./player-on-pitch.component.scss'],
})
export class PlayerOnPitch {
  @Input() player!: Player;
  @Output() remove = new EventEmitter<void>();
}
