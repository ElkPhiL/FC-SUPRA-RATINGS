// admin-player-create.component.ts

import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { PlayerFormComponent } from './components/player-form.component';
import { PlayersService } from '../../../core/services/players.service';

@Component({
  selector: 'app-admin-player-create',
  standalone: true,
  imports: [PlayerFormComponent],
  template: `
    <h1>Créer joueur</h1>

    <app-player-form
      mode="create"
      [loading]="loading()"
      (submitForm)="create($event)">
    </app-player-form>

    <p>{{ message() }}</p>
  `,
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