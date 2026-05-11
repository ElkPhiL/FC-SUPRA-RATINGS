import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';

import { PlayersService } from '../../../core/services/players.service';
import { MatchPlayersService } from '../../../core/services/match-players.service';
import { Player } from '../players/models/player.model';

@Component({
  selector: 'app-admin-lineup',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './admin-lineup.component.html',
  styleUrls: ['./admin-lineup.component.scss'],
})
export class AdminLineupComponent implements OnInit {

  matchId!: number;

  // 🔥 Pools
  available: Player[] = [];

  starters: any[] = [];
  bench: any[] = [];
  injured: any[] = [];
  suspended: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private playersService: PlayersService,
    private matchPlayersService: MatchPlayersService
  ) {}

  async ngOnInit() {
    this.matchId = Number(this.route.snapshot.paramMap.get('id'));

    const players = await this.playersService.getActive();
    this.available = players;
  }

  drop(event: CdkDragDrop<any[]>, target: string) {

    if (event.previousContainer === event.container) return;

    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
  }

  // 🔥 SAVE LINEUP
  async save() {

    const buildPayload = (list: any[], role: string) =>
      list.map(p => ({
        match_id: this.matchId,
        player_id: p.id,
        role,
        position_played: p.position_played || null,
        minutes_in: p.minutes_in ?? null,
        minutes_out: p.minutes_out ?? null
      }));

    const payload = [
      ...buildPayload(this.starters, 'starter'),
      ...buildPayload(this.bench, 'sub'),
      ...buildPayload(this.injured, 'injured'),
      ...buildPayload(this.suspended, 'suspended'),
    ];

    await this.matchPlayersService.deleteByMatch(this.matchId);
    await this.matchPlayersService.addMany(payload);

    alert('Lineup sauvegardé');
  }
}