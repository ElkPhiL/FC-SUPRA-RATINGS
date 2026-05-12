import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatchFormComponent } from '../../../components/match-form.component';
import { MatchesService } from '../../../services/matches.service';

@Component({
  selector: 'app-admin-match-create',
  standalone: true,
  imports: [MatchFormComponent],
  templateUrl: './admin-match-create.component.html',
  styleUrls: ['./admin-match-create.component.scss'],
})
export class AdminMatchCreateComponent {
  loading = signal(false);
  message = signal('');

  constructor(
    private matchesService: MatchesService,
    private router: Router
  ) {}

  async create(payload: any) {
    try {
      this.loading.set(true);

      await this.matchesService.create(payload);

      this.message.set('Match créé');
      this.router.navigate(['/admin/matches']);
    } catch {
      this.message.set('Erreur création');
    } finally {
      this.loading.set(false);
    }
  }
}
