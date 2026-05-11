import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { PlayerFormComponent } from '../../../components/player-form.component';
import { PlayersService } from '../../../services/players.service';

@Component({
  selector: 'app-admin-player-create',
  standalone: true,
  imports: [PlayerFormComponent],
  templateUrl: './admin-player-create.component.html',
  styleUrls: ['./admin-player-create.component.scss'],
})
export class AdminPlayerCreateComponent {
  loading = signal(false);
  message = signal('');

  constructor(
    private playersService: PlayersService,
    private router: Router
  ) {}

  async create(payload: any) {
    try {
      this.loading.set(true);

      await this.playersService.create(payload);

      this.message.set('Joueur créé');
      this.router.navigate(['/admin/players']);

    } catch {
      this.message.set('Erreur création');
    } finally {
      this.loading.set(false);
    }
  }
}