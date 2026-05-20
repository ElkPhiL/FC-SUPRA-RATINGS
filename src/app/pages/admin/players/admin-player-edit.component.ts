import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PlayerFormComponent } from '../../../components/player-form/player-form.component';
import { PlayersService } from '../../../services/players.service';
import { Player } from '../../../models/player.model';
import { PlayerPositionsService } from '../../../services/player-positions.service';

@Component({
  selector: 'app-admin-player-edit',
  standalone: true,
  imports: [CommonModule, PlayerFormComponent],
  templateUrl: './admin-player-edit.component.html',
  styleUrls: ['./admin-player-edit.component.scss'],
})
export class AdminPlayerEditComponent implements OnInit {
  player = signal<Player | null>(null);

  loading = signal(true);
  saving = signal(false);
  message = signal('');

  id!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private playersService: PlayersService,
    private playerPositionsService: PlayerPositionsService
  ) {}

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.load();
  }

  async load() {
    try {
      const data = await this.playersService.getById(this.id);
      const positions = await this.playerPositionsService.getPlayerPositions(this.id);
      data.positions = positions;
      this.player.set(data);
    } catch {
      this.message.set('Erreur chargement joueur');
    } finally {
      this.loading.set(false);
    }
  }

  async update(payload: any) {
    try {
      this.saving.set(true);

      await this.playersService.update(this.id, payload);

      this.message.set('Joueur modifié');

      this.router.navigate(['/admin/players']);

    } catch {
      this.message.set('Erreur modification');
    } finally {
      this.saving.set(false);
    }
  }
}