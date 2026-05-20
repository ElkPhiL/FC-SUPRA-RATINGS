import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatchFormComponent } from '../../../components/match-form/match-form.component';
import { MatchesService } from '../../../services/matches.service';
import { Match } from '../../../models/match.model';

@Component({
  selector: 'app-admin-match-edit',
  standalone: true,
  imports: [CommonModule, MatchFormComponent],
  templateUrl: './admin-match-edit.component.html',
  styleUrls: ['./admin-match-edit.component.scss'],
})
export class AdminMatchEditComponent implements OnInit {
  match = signal<Match | null>(null);

  loading = signal(true);
  saving = signal(false);
  message = signal('');

  id!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private matchesService: MatchesService
  ) {}

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.load();
  }

  async load() {
    try {
      const data = await this.matchesService.getById(this.id);
      this.match.set(data);
    } catch {
      this.message.set('Erreur chargement match');
    } finally {
      this.loading.set(false);
    }
  }

  async update(payload: any) {
    try {
      this.saving.set(true);

      await this.matchesService.update(this.id, payload);

      this.message.set('Match modifié');

      this.router.navigate(['/admin/matches']);

    } catch {
      this.message.set('Erreur modification');
    } finally {
      this.saving.set(false);
    }
  }
}