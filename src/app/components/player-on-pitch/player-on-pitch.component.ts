import { Component } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchPlayerWithPlayer } from '../../models/match-players.model';

@Component({
  selector: 'app-player-on-pitch',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player-on-pitch.component.html',
  styleUrls: ['./player-on-pitch.component.scss'],
})
export class PlayerOnPitch {
  @Input() matchPlayer!: MatchPlayerWithPlayer;
  @Output() remove = new EventEmitter<void>();
}
