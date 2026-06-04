import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchPlayerWithPlayer } from '../../models/match-players.model';

@Component({
  selector: 'app-player-on-pitch',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player-on-pitch.component.html',
  styleUrls: ['./player-on-pitch.component.scss']
})
export class PlayerOnPitch {
  @Input({ required: true }) matchPlayer!: MatchPlayerWithPlayer;
  @Input() editable: boolean = false;

  @Output() remove = new EventEmitter<void>();
  @Output() makeCaptain = new EventEmitter<void>();
}